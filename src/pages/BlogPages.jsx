import { Link, useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Reveal from '../components/Reveal'
import PageHero from '../components/PageHero'
import MagneticButton from '../components/MagneticButton'
import { BLOG_POSTS, BLOG_AUTHOR, getPost, relatedPosts } from '../data/blogPosts'
import { BRAND, BOOKING_URL, asset } from '../data/site'
import { scaleIn, stagger, fadeUp } from '../motion'

function formatDate(iso) {
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

function coverSrc(post) {
  return asset(post.image || post.coverFallback || 'og-image.jpg')
}

function Block({ block }) {
  if (block.type === 'h3') return <h3>{block.text}</h3>
  if (block.type === 'ul') {
    return (
      <ul>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }
  return <p>{block.text}</p>
}

export function BlogHub() {
  return (
    <>
      <PageHero>
        <div className="container">
          <Reveal className="section-kicker">Resources</Reveal>
          <Reveal as="h1">Blog</Reveal>
          <Reveal as="p">
            Deep guides on custom software, mobile apps, websites, SEO, AEO, GEO and hiring in India.
          </Reveal>
        </div>
      </PageHero>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div
            className="blog-grid"
            variants={stagger(0.04)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.08 }}
          >
            {BLOG_POSTS.map((post) => (
              <motion.div key={post.slug} variants={scaleIn}>
                <Link className="blog-card" to={`/blog/${post.slug}`}>
                  <img src={coverSrc(post)} alt={post.imageAlt || post.title} loading="lazy" width="640" height="360" />
                  <div className="body">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <h3>{post.title}</h3>
                    <p>{post.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          <p className="section-note" style={{ marginTop: '2rem' }}>
            Prefer short answers? Open the <Link to="/faq">FAQ hub</Link> or{' '}
            <Link to="/contact">contact {BRAND}</Link>.
          </p>
        </div>
      </section>
    </>
  )
}

export function BlogPost() {
  const { slug } = useParams()
  const post = getPost(slug)
  if (!post) return <Navigate to="/blog" replace />

  const related = relatedPosts(post.slug)
  const toc = post.sections.map((s) => s.h2)

  return (
    <>
      <PageHero>
        <div className="container blog-hero">
          <Reveal className="section-kicker">
            <Link to="/blog">Blog</Link>
          </Reveal>
          <Reveal as="h1">{post.title}</Reveal>
          <Reveal as="p">{post.desc}</Reveal>
          <Reveal as="div" className="blog-meta" variants={fadeUp}>
            <span>
              Last updated: <time dateTime={post.updated || post.date}>{formatDate(post.updated || post.date)}</time>
            </span>
            <span>Written by {BLOG_AUTHOR}</span>
            <span>Expert written and reviewed</span>
          </Reveal>
        </div>
      </PageHero>

      <section className="section blog-article-section" style={{ paddingTop: 0 }}>
        <div className="container blog-layout">
          <aside className="blog-toc" aria-label="Table of contents">
            <strong>Table of contents</strong>
            <ol>
              {toc.map((heading) => (
                <li key={heading}>
                  <a href={`#${slugify(heading)}`}>{heading}</a>
                </li>
              ))}
              <li>
                <a href="#faqs">FAQs</a>
              </li>
            </ol>
          </aside>

          <article className="prose blog-article">
            <img
              className="blog-cover"
              src={coverSrc(post)}
              alt={post.imageAlt || post.title}
              width="1200"
              height="675"
            />

            {post.sections.map((section) => (
              <section key={section.h2} id={slugify(section.h2)}>
                <h2>{section.h2}</h2>
                {section.blocks.map((block, i) => (
                  <Block key={`${section.h2}-${i}`} block={block} />
                ))}
              </section>
            ))}

            <section id="faqs">
              <h2>FAQs</h2>
              <div className="faq">
                {post.faqs.map(([q, a]) => (
                  <details key={q}>
                    <summary>{q}</summary>
                    <p>{a}</p>
                  </details>
                ))}
              </div>
            </section>

            <div className="blog-cta">
              <h2>Ready to build?</h2>
              <p>
                Share your brief. {BRAND} replies with fit, timeline and a clear commercial path.
              </p>
              <div className="hero-cta">
                <MagneticButton href={BOOKING_URL} className="btn btn-primary" external>
                  Book a free call
                </MagneticButton>
                <MagneticButton to="/contact" className="btn btn-ghost">
                  Contact us
                </MagneticButton>
              </div>
            </div>
          </article>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">Related guides</h2>
            <div className="blog-grid">
              {related.map((p) => (
                <Link key={p.slug} className="blog-card" to={`/blog/${p.slug}`}>
                  <img src={coverSrc(p)} alt="" loading="lazy" width="640" height="360" />
                  <div className="body">
                    <time dateTime={p.date}>{formatDate(p.date)}</time>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
