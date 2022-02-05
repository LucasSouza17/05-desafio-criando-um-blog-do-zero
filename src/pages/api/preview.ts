import { Document } from '@prismicio/client/types/documents';
import { NextApiRequest, NextApiResponse } from 'next';
import {Client} from '../../utils/prismicHelpers'

function linkResolver(doc: Document): string {
  if (doc.type === 'post') {
    return `/post/${doc.uid}`;
  }

  return '/';
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { token: ref, documentId } = req.query;

  const redirectUrl = await Client(req)
    .getPreviewResolver(String(ref), String(documentId))
    .resolve(linkResolver, '/');

  if (!redirectUrl) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  res.setPreviewData({ ref });

  res.write(
    `<!DOCTYPE html><html><head><meta http-equiv="Refresh" content="0; url=${redirectUrl}" />
    <script>window.location.href = '${redirectUrl}'</script>
    </head>`
  );

  console.log("Redirect URL" + redirectUrl);

  res.end();
};