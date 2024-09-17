import Head from "next/head";

interface LayoutProps {
  title?: string;
  children: React.ReactNode;
  hasBackdrop?: boolean;
}

export const Layout = ({ title, children, hasBackdrop = false }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{`Umobi${title ? ` | ${title}` : ''}`}</title>
      </Head>
      <div className={`containerLayout`}
        style={{ backgroundImage: `url('/square.svg'), url('/line-up.svg')` }}>
        <div className="wrapper" style={{ background: hasBackdrop ? 'var(--background)' : '' }}>
          {children}
        </div>
      </div>
    </>
  )
}

export const LayoutAdmin = ({ title, children, hasBackdrop }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{`Umobi${title ? ` | ${title}` : ''}`}</title>
      </Head>
      <div className={`containerLayoutAdmin`}
        style={{ backgroundImage: `url('/square.svg'), url('/line-up.svg')` }}>
        <div className="wrapperAdmin" style={{ background: hasBackdrop ? 'var(--background)' : '' }}>
          {children}
        </div>
      </div>
    </>
  )
}