import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';

import { getPrismicClient } from '../services/prismic';

import { FiCalendar, FiUser } from 'react-icons/fi'

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

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

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>

      <main className={commonStyles.container}>
        <div className={styles.posts}>
          <Link href={`/post/slug`}>
            <a>
              <strong>Como utilizar Hooks</strong>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <div className={styles.metadata}>
                <time>
                  <FiCalendar color="#BBBBBB" />
                  <span>19 Abr 2021</span>
                </time>
                <div className={styles.author}>
                  <FiUser color="#BBBBBB" />
                  <span>Danilo Vieira</span>
                </div>
              </div>
            </a>
          </Link>

          <Link href={`/post/slug`}>
            <a>
              <strong>Criando um app CRA do zero</strong>
              <p>Tudo sobre como criar a sua primeira aplicação utilizando Create React App</p>
              <div className={styles.metadata}>
                <time>
                  <FiCalendar color="#BBBBBB" />
                  <span>19 Abr 2021</span>
                </time>
                <div className={styles.author}>
                  <FiUser color="#BBBBBB" />
                  <span>Danilo Vieira</span>
                </div>
              </div>
            </a>
          </Link>
          <Link href={`/post/slug`}>
            <a>
              <strong>Como utilizar Hooks</strong>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <div className={styles.metadata}>
                <time>
                  <FiCalendar color="#BBBBBB" />
                  <span>19 Abr 2021</span>
                </time>
                <div className={styles.author}>
                  <FiUser color="#BBBBBB" />
                  <span>Danilo Vieira</span>
                </div>
              </div>
            </a>
          </Link>

          <Link href={`/post/slug`}>
            <a>
              <strong>Criando um app CRA do zero</strong>
              <p>Tudo sobre como criar a sua primeira aplicação utilizando Create React App</p>
              <div className={styles.metadata}>
                <time>
                  <FiCalendar color="#BBBBBB" />
                  <span>19 Abr 2021</span>
                </time>
                <div className={styles.author}>
                  <FiUser color="#BBBBBB" />
                  <span>Danilo Vieira</span>
                </div>
              </div>
            </a>
          </Link>
        </div>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
