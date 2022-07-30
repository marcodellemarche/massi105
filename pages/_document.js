// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

import React from 'react';
// eslint-disable-next-line @next/next/no-document-import-in-page
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang='it'>
        <Head>
          <link rel="icon" href="/favicon.png" />
          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
            integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Lato:300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&display=swap"
            rel="stylesheet"
          />
          {/* <link
            href="https://fonts.googleapis.com/css?family=Playfair+Display:400,700,900&display=swap"
            rel="stylesheet"
          /> */}
          <meta name="title" content="Massi105 | Utensili Makita" key="title" />
          <meta name="description" content="Vendiamo utensili Makita da anni, con professionalità e velocità di consegna" />
          <meta property="og:title" content="Massi105 | Utensili Makita" />
          <meta property="og:image" content="https://cdn.chec.io/email/assets/marketing/demo-preview.png" />
          <meta property="og:description" content="Vendiamo utensili Makita da anni, con professionalità e velocità di consegna" />
          <meta property="og:url" content="https://massi105.it" />
          <meta property="twitter:title" content="Massi105 | Utensili Makita" />
          <meta name="twitter:creator" content="@marcodellemarche" />
          <meta property="twitter:image" content="https://cdn.chec.io/email/assets/marketing/demo-preview.png" />
          <meta property="twitter:description" content="Vendiamo utensili Makita da anni, con professionalità e velocità di consegna" />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
