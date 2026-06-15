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
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
