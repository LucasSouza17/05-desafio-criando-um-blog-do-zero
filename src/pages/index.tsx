import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { FiCalendar, FiUser } from 'react-icons/fi';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { useState } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const postsFormmated = postsPagination.results.map(post => {
    return {
      ...post,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        { locale: ptBR }
      ),
    };
  });

  const [posts, setPosts] = useState<Post[]>(postsFormmated);
  const [nextPage, setNextPage] = useState<String>(postsPagination.next_page);

  const handleLoadMorePosts = async () => {
    if (nextPage !== null) {
      const response = await fetch(`${nextPage}`).then(response =>
        response.json()
      );

      setNextPage(response.next_page);

      const newPosts = response.results.map((post: Post) => {
        return {
          ...post,
          first_publication_date: format(
            new Date(post.first_publication_date),
            'dd MMM yyyy',
            { locale: ptBR }
          ),
        };
      });

      setPosts([...posts, ...newPosts]);
    }
  };

  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>

      <main className={commonStyles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/post/${post.uid}`} key={post.uid}>
              <a>
                <h1>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>
                <div className={styles.metadata}>
                  <time>
                    <FiCalendar color="#BBBBBB" />
                    <span>{post.first_publication_date}</span>
                  </time>
                  <div className={styles.author}>
                    <FiUser color="#BBBBBB" />
                    <span>{post.data.author}</span>
                  </div>
                </div>
              </a>
            </Link>
          ))}
          {nextPage !== null && (
            <button type="button" onClick={handleLoadMorePosts}>
              Carregar mais posts
            </button>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 2,
    }
  );

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = {
    results: posts,
    next_page: postsResponse.next_page,
  };

  return {
    props: {
      postsPagination,
    },
  };
};
