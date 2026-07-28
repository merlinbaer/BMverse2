import { serve } from "std/http/server.ts";

const TEAM_ID = Deno.env.get('APPLE_TEAM_ID');
const KEY_ID = Deno.env.get('APPLE_MUSICKIT_KEY');
const PRIVATE_KEY = Deno.env.get('API_MUSICKIT')!;

function base64UrlEncode(buffer: Uint8Array): string {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function createDeveloperToken(): Promise<string> {
  const header = {
    alg: "ES256",
    kid: KEY_ID,
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: TEAM_ID,
    iat: now,
    exp: now + 60 * 60 * 24 * 180, // 180 days
  };

  const encoder = new TextEncoder();
  const headerBase64 = base64UrlEncode(encoder.encode(JSON.stringify(header)));
  const payloadBase64 = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const data = `${headerBase64}.${payloadBase64}`;

  const key = await crypto.subtle.importKey(
    "pkcs8",
    convertPEMToBinary(PRIVATE_KEY),
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    encoder.encode(data)
  );

  const signatureBase64 = base64UrlEncode(new Uint8Array(signature));
  return `${data}.${signatureBase64}`;
}

// Convert PEM to binary
function convertPEMToBinary(pem: string): ArrayBuffer {
  const pemContents = pem
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");
  const binary = atob(pemContents);
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    buffer[i] = binary.charCodeAt(i);
  }
  return buffer.buffer;
}

// Serve token from edge function
serve(async () => {
  try {
    console.log(TEAM_ID);
    console.log(KEY_ID)
    console.log(PRIVATE_KEY)
    const token = await createDeveloperToken();
    console.log("Token: " + token)
    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Token generation error:", err);
    return new Response("Error generating token", { status: 500 });
  }
});
