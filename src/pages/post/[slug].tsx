import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { useRouter } from 'next/router';

interface Post {
  uid: string;
  first_publication_date: string | null;
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

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Carregando...</h1>;
  }

  console.log(post);

  const firstPublicationDateFormatted = format(
    new Date(post.first_publication_date),
    'dd MMM yyyy',
    { locale: ptBR }
  );

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
  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
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

  return {
    props: {
      post,
    },
    revalidate: 60 * 30, // 30 minutes
  };
};
