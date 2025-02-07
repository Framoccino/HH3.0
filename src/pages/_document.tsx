import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Human Hours - Decentralized Task Management" />
        <link rel="icon" href="/favicon.ico" />
        <title>Human Hours</title>
        
        {/* Add any additional meta tags, links, or scripts here */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 