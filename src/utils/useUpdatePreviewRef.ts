// utils/useUpdatePreviewRef.js
import { useEffect } from 'react'
import { useRouter, NextRouter } from 'next/router'
import Cookies from 'js-cookie';

interface RouterI {
  isPreview: boolean;
}

function getExitPreviewRoute(router: NextRouter) {
  const defaultPreviewExitUrl = '/api/exit-preview'
  const linkUrl = router.asPath ? `${defaultPreviewExitUrl}?currentUrl=${router.asPath}` : defaultPreviewExitUrl
  return linkUrl
}

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function useUpdatePreviewRef(previewRef: string | null, documentId: string | null) {
  const router = <NextRouter & RouterI>useRouter()
  const previewExitRoute = getExitPreviewRoute(router)
  useEffect(() => {
    const updatePreview = async () => {
      await timeout(1000)

      const rawPreviewCookie = Cookies.get('io.prismic.preview')
      const previewCookie = rawPreviewCookie ? JSON.parse(rawPreviewCookie) : null

      const previewCookieObject = previewCookie ? previewCookie[`${process.env.PRISMIC_REPO_NAME}.prismic.io`] : null

      const previewCookieRef = previewCookieObject && previewCookieObject.preview
        ? previewCookieObject.preview
        : null

      if (router.isPreview) {
        if (rawPreviewCookie && previewCookieRef) {
          if (previewRef !== previewCookieRef) {
            return router.push(`/api/preview?token=${previewCookieRef}&documentId=${documentId}`)
          }
        } else {
          return router.push(previewExitRoute)
        }
      } else if (rawPreviewCookie && previewCookieRef) {
        return router.push(`/api/preview?token=${previewCookieRef}&documentId=${documentId}`)
      }
      return undefined
    }
    updatePreview()
  }, [])
}