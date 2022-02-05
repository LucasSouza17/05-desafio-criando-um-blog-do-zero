// pages/404.js
import Link from 'next/link'
import Head from "next/head"

export default function Custom404() {
  return <>
    <div>
      <Head>
          <title>404 - oops</title>
      </Head>
      <div className="fourohfour">
        <h1>404 - Page Not Found</h1>
        <Link href="/">
          <a>
            Go back home
          </a>
        </Link>
      </div>
      <style jsx>
        {`
          .fourohfour {
            margin: 0 auto;
            padding: 100px 0 100px 0;
            max-width: 700px;
          }
        `}
      </style>
    </div>
  </>
}