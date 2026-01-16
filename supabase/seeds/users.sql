-- Insert user merlinm@bruu.eu
INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES ('00000000-0000-0000-0000-000000000000', '700fdfd7-f06c-47d4-b515-d8dfdb917a0c', 'authenticated', 'authenticated', 'merlin@bruu.eu', '$2a$10$jyJJNNhCYngfnzgGhfpiYezb1PiOostkw0aQNZKKG1r7fhWDL366u', '2026-01-16 17:18:59.913111+00', null, '', null, '', '2026-01-16 17:18:59.933316+00', '', '', null, '2026-01-16 17:19:37.498646+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "700fdfd7-f06c-47d4-b515-d8dfdb917a0c", "email": "merlin@bruu.eu", "email_verified": true, "phone_verified": false}', null, '2026-01-16 17:18:59.906648+00', '2026-01-16 17:19:37.500429+00', null, null, '', '', null, '', '0', null, '', null, 'false', null, 'false');

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES ('700fdfd7-f06c-47d4-b515-d8dfdb917a0c', '700fdfd7-f06c-47d4-b515-d8dfdb917a0c', '{"sub": "700fdfd7-f06c-47d4-b515-d8dfdb917a0c", "email": "merlin@bruu.eu", "email_verified": false, "phone_verified": false}', 'email', '2026-01-16 17:18:59.909912+00', '2026-01-16 17:18:59.909926+00', '2026-01-16 17:18:59.909926+00', 'f367dfbd-663b-45cc-aa05-f62be53a8b37');

INSERT INTO "public"."gl_profiles" (
    "id",
    "user_email",
    "user_role",
    "user_name",
    "user_country"
) VALUES (
             '700fdfd7-f06c-47d4-b515-d8dfdb917a0c',
             'merlin@bruu.eu',
             'user',
             'Merlin',
             'DE'
         )
ON CONFLICT (id)
    DO UPDATE SET
                  user_name = EXCLUDED.user_name,
                  user_country = EXCLUDED.user_country,
                  user_role = EXCLUDED.user_role,
                  updated_at = now();
