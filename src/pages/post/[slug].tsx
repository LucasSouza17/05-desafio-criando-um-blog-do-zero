import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { Comments } from '../../components/Comments';
import Loader from '../../components/Loader';
import Custom404 from '../404';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import useUpdatePreviewRef from '../../utils/useUpdatePreviewRef';

interface Post {
  uid: string;
  first_publication_date: string | null;
  last_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface Navigation {
  prevPost: {
    slug: string;
    title: string;
  };
  nextPost: {
    slug: string;
    title: string;
  };
}

interface PostProps {
  post: Post;
  navigation: Navigation;
  preview: boolean;
  previewData: {
    ref: string | null;
  };
}

export default function Post({
  post,
  navigation,
  preview,
  previewData,
}: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <Loader />;
  }

  if (!post.uid) {
    return <Custom404 />;
  }

  useUpdatePreviewRef(previewData?.ref ?? null, post.uid);

  const firstPublicationDateFormatted = format(
    new Date(post.first_publication_date),
    'dd MMM yyyy',
    { locale: ptBR }
  );

  const lastPublicationDateFormatted =
    '* editado em ' +
    format(new Date(post.last_publication_date), 'dd MMM yyyy', {
      locale: ptBR,
    }) +
    ', às ' +
    format(new Date(post.last_publication_date), 'p', { locale: ptBR });

  const readingTime = () => {
    const totalWords = post.data.content.reduce((total, contentItem) => {
      total += contentItem.heading.split(' ').length;
      total += RichText.asText(contentItem.body.map(item => item)).split(
        ' '
      ).length;

      return total;
    }, 0);

    const minutesRead = totalWords / 200;
    return `${Math.ceil(minutesRead)} min`;
  };

  return (
    <>
      <Head>
        <title>{`${post.data.title} | spacetraveling`}</title>
      </Head>
      <img
        src={post.data.banner.url}
        alt={post.data.title}
        className={styles.banner}
      />
      <main className={commonStyles.container}>
        <div className={styles.post}>
          <div className={styles.postHeader}>
            <h1>{post.data.title}</h1>
            <div className={styles.metadata}>
              <time>
                <FiCalendar color="#BBBBBB" />
                <span>{firstPublicationDateFormatted}</span>
              </time>
              <div className={styles.author}>
                <FiUser color="#BBBBBB" />
                <span>{post.data.author}</span>
              </div>
              <div className={styles.readingTime}>
                <FiClock color="#BBBBBB" />
                <span>{readingTime()}</span>
              </div>
            </div>
            {new Date(post.first_publication_date) <
              new Date(post.last_publication_date) && (
              <span>{lastPublicationDateFormatted}</span>
            )}
          </div>

          <article>
            {post.data.content.map((data, index) => {
              return (
                <div key={index}>
                  <h2>{data.heading}</h2>
                  <div
                    className={styles.postContent}
                    dangerouslySetInnerHTML={{
                      __html: RichText.asHtml(data.body),
                    }}
                  />
                </div>
              );
            })}
          </article>
        </div>

        <section className={styles.footer}>
          <div className={styles.separator} />

          <div className={styles.containerNavigation}>
            <div className={styles.navigation}>
              {navigation.prevPost.slug && (
                <>
                  <span>{navigation.prevPost.title}</span>
                  <Link href={`/post/${navigation.prevPost.slug}`}>
                    <a>Post anterior</a>
                  </Link>
                </>
              )}
            </div>
            <div className={styles.navigation}>
              {navigation.nextPost.slug && (
                <>
                  <span>{navigation.nextPost.title}</span>
                  <Link href={`/post/${navigation.nextPost.slug}`}>
                    <a>Próximo post</a>
                  </Link>
                </>
              )}
            </div>
          </div>

          <Comments />

          {preview && (
            <aside className={commonStyles.buttonPreview}>
              <Link href="/api/exit-preview">
                <a>Sair do modo Preview</a>
              </Link>
            </aside>
          )}
        </section>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.Predicates.at('document.type', 'post'),
  ]);

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const {
    params: { slug },
    previewData,
    preview = false,
  } = context;

  if (slug === 'favicon.png') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {
    ref: previewData?.ref ?? null,
  });

  const prevPost = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date desc]',
    }
  );

  const nextPost = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date]',
    }
  );

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: [...content.body],
        };
      }),
    },
  };

  const navigation = {
    prevPost: {
      slug: prevPost?.results[0]?.uid ?? null,
      title: prevPost?.results[0]?.data.title ?? null,
    },
    nextPost: {
      slug: nextPost?.results[0]?.uid ?? null,
      title: nextPost?.results[0]?.data.title ?? null,
    },
  };

  return {
    props: {
      post,
      navigation,
      preview,
      previewData: previewData ?? null,
    },
    revalidate: 60 * 30, // 30 minutes
  };
};
