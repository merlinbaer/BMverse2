import { ScrollViewStyleReset } from 'expo-router/html'
import React from 'react'

// This file is web-only and used to configure the root HTML for every page.
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line react-native/no-raw-text */}
        <title>BMverse2</title>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no"
        />
        {/* PWA System Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* 1. Force black background on everything */
              :root, html, body {
                background-color: #000000 !important;
                margin: 0;
                padding: 0;
                height: 100% !important;
                width: 100% !important;
              }
          
              /* 2. Full-Screen PWA Splash Screen */
              #pwa-splash {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background-color: #000;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                transition: opacity 0.5s ease-out;
              }

              #pwa-splash img {
                width: 100%;
                height: 100%;
                object-fit: cover; 
              }

              /* 3. Hide the splash when the app is ready */
              .app-loaded #pwa-splash {
                opacity: 0;
                pointer-events: none;
                visibility: hidden;
              }
            `,
          }}
        />
      </head>
      <body>
        {/* PWA Static Splash */}
        <div id="pwa-splash">
          {/* Using the file from public folder for immediate access */}
          <img src="/splash-icon.png" alt="BMverse2" />
          <div className="loader"></div>
        </div>

        {children}
      </body>
    </html>
  )
}
