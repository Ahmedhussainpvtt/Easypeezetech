import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { metaForPath } from './pageMeta'

export default function Seo({ override } = {}) {
  const { pathname } = useLocation()
  const meta = useMemo(() => ({ ...metaForPath(pathname), ...override }), [pathname, override])

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en-IN" />
      <title>{meta.title}</title>
      <meta name="description" content={meta.desc} />
      <meta name="keywords" content={meta.keywords} />
      <meta name="author" content="EasyPeeze Technologies" />
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      <meta name="googlebot" content="index, follow" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      <link rel="canonical" href={meta.canonical} />
      <link rel="sitemap" type="application/xml" title="Sitemap" href="https://easypeezetech.com/sitemap.xml" />
      <meta property="og:type" content={meta.ogType || 'website'} />
      <meta property="og:site_name" content="EasyPeeze Technologies" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.desc} />
      <meta property="og:url" content={meta.canonical} />
      <meta
        property="og:image"
        content={meta.ogImage || 'https://easypeezetech.com/assets/og-image.jpg'}
      />
      <meta property="og:locale" content="en_IN" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.desc} />
      <meta
        name="twitter:image"
        content={meta.ogImage || 'https://easypeezetech.com/assets/og-image.jpg'}
      />
      {(meta.jsonld || []).map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  )
}
