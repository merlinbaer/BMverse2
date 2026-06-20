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
          
              /* 2. Fix content visibility - remove overflow:hidden */
              #root {
                display: flex;
                flex-direction: column;
                min-height: 100% !important;
              }
              
              /* 2. PWA Splash Screen Styles */
              #pwa-splash {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #000;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                transition: opacity 0.5s ease-out;
              }

              #pwa-splash img {
                width: 200px; /* Matches your splash icon scale */
                height: 200px;
                object-fit: contain;
                margin-bottom: 20px;
              }

              /* Spinner below the icon */
              .loader {
                width: 30px;
                height: 30px;
                border: 2px solid #db1b1a;
                border-bottom-color: transparent;
                border-radius: 50%;
                animation: rotation 1s linear infinite;
              }

              @keyframes rotation {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }

              /* Fade out when app is ready */
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
