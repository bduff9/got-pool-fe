import Head from 'next/head';

interface Meta {
  description?: string;
  title?: string;
}

export default ({
  description = 'Game of Thrones Death Pool',
  title,
}: Meta) => (
  <div>
    <Head>
      <title>{`${title ? `${title} | ` : ''}GoT Death Pool`}</title>
      <meta name="description" content={description} key="description" />
      <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" key="viewport" />
      <meta charSet="utf-8" key="charset" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" key="httpequiv" />
    </Head>
  </div>
);
