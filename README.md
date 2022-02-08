# Spacetraveling - Blog

Spacetraveling faz parte de um desafio do curso Ignite - Trilha ReactJS da Rocketseat, o objetivo desse desafio era criar um blog do zero utilizando NextJS em conjunto com o PrismicCMS além de buscar seguir fielmente o layout do proposto pelo figma.

## Demonstração

![App Screenshot](https://i.ibb.co/YW0XJ8k/2022-02-08-20-13-22.gif)


## Funcionalidades

- Gerar páginas estáticas a partir dos posts já existentes no Prismic em tempo de build.
- Gerar páginas estáticas quano houver uma nova publicação de forma dinâmica.
- Comentário através do github utterances.
- Páginação utilizando API do prismic para ter um valor fixo para o número de posts a serem renderizados e paginar a partir disso.
- Opção de visualizar posts mais recentes ou mais antigos quando finalizar de ler uma publicação.
- Preview de um post ainda não publicado no Prismic.
- Tempo de leitura para cada post.


## Aprendizados

Um dos aprendizados mais importantes foi entender e práticar ainda mais as funções serverless do NextJS e lidar com um CMS como o Prismic.
Além disso criar várias funcionalidades legais como: Tempo de leitura; Preview com PrismicCMS; Praticar um pouco o CSS usando SASS;
Muito importante enfrentar os desafios e evoluir com eles e tudo acaba sempre se tornando um aprendizado por menor que seja.


## Stack utilizada

**Front-end:** ReactJS, NextJS e PrismicCMS



## Instalação

Instale spacetraveling com yarn

```bash
  yarn install
  yarn dev
```
    
## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

`PRISMIC_API_ENDPOINT`

`PRISMIC_ACCESS_TOKEN`

`PRISMIC_REPO_NAME`

