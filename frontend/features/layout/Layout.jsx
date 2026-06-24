import Head from 'next/head';
import Header from './Header';

export default function Layout({ children, title = 'AW Client Report Portal' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="layout">
        <Header />
        <main className="layout__main">{children}</main>
      </div>
    </>
  );
}
