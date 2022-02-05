import Prismic from '@prismicio/client'

export const Client = (req = null) => (
  Prismic.client(process.env.PRISMIC_API_ENDPOINT, createClientOptions(req, process.env.PRISMIC_ACCESS_TOKEN))
);

// Options to be passed to the Client
const createClientOptions = (req = null, prismicAccessToken = null) => {
  const reqOption = req ? { req } : {}
  const accessTokenOption = prismicAccessToken ? { accessToken: prismicAccessToken } : {}
  return {
    ...reqOption,
    ...accessTokenOption,
  }
}

export default Client