import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body className="m-0 bg-blue-500 overflow-y-hidden">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
