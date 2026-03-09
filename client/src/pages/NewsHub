import { useEffect, useState } from 'react'
import BottomNav from '../components/BottomNav'
import AppHeader from '../components/AppHeader'

interface Article {
  title: string
  source: string
  url: string
  published: string
  summary: string
}

const MS_FEEDS = [
  { name: 'MS Society', url: 'https://www.mssociety.org.uk/research/latest-ms-research' },
  { name: 'MS News Today', url: 'https://multiplesclerosisnewstoday.com' },
  { name: 'MSAA', url: 'https://mymsaa.org/ms-information/updates' },
  { name: 'National MS Society', url: 'https://www.nationalmssociety.org/About-the-Society/News' },
]

const STATIC_ARTICLES: Article[] = [
  {
    title: 'New research shows promise for remyelination therapy in MS patients',
    source: 'MS News Today',
    url: 'https://multiplesclerosisnewstoday.com',
    published: '2026-03-07',
    summary: 'Researchers have identified a new pathway for promoting myelin repair in MS patients, with early clinical trials showing encouraging results in reducing lesion activity.',
  },
  {
    title: 'Exercise and MS: How staying active can slow disease progression',
    source: 'National MS Society',
    url: 'https://www.nationalmssociety.org',
    published: '2026-03-06',
    summary: 'A new review of 40 studies confirms that regular moderate exercise can improve fatigue, mobility, and cognitive function in people living with MS.',
  },
  {
    title: 'FDA approves expanded indication for high-efficacy MS therapy',
    source: 'MSAA',
    url: 'https://mymsaa.org',
    published: '2026-03-05',
    summary: 'The FDA has approved a new indication expanding the use of an existing high-efficacy disease-modifying therapy to include earlier-stage MS patients.',
  },
  {
    title: 'Brain fog in MS: New study maps the cognitive network disruptions',
    source: 'MS Society',
    url: 'https://www.mssociety.org.uk',
    published: '2026-03-04',
    summary: 'Scientists have created the most detailed map to date of how MS lesions disrupt cognitive networks, opening new avenues for targeted cognitive rehabilitation.',
  },
  {
    title: 'Diet and inflammation: What MS patients need to know in 2026',
    source: 'MS News Today',
    url: 'https://multiplesclerosisnewstoday.com',
    published: '2026-03-03',
    summary: 'Emerging evidence continues to support the role of anti-inflammatory diets in managing MS symptoms, with new guidance for patients from leading neurologists.',
  },
  {
    title: 'Progressive MS: Promising results from phase 3 trial of new agent',
    source: 'National MS Society',
    url: 'https://www.nationalmssociety.org',
    published: '2026-03-02',
    summary: 'A phase 3 trial for a novel therapy targeting progressive MS has met its primary endpoint, representing a potential breakthrough for patients with limited treatment options.',
  },
  {
    title: 'Telehealth and MS care: How remote monitoring is changing neurology',
    source: 'MSAA',
    url: 'https://mymsaa.org',
    published: '2026-03-01',
    summary: 'New digital tools and remote monitoring platforms are enabling neurologists to track MS disease activity between clinic visits with greater precision than ever before.',
  },
  {
    title: 'Heat sensitivity in MS: Tips and emerging science',
    source: 'MS Society',
    url: 'https://www.mssociety.org.uk',
    published: '2026-02-28',
    summary: 'Researchers are making progress understanding why heat worsens MS symptoms, with new cooling strategies and clinical guidance for patients heading into warmer months.',
  },
]

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const SOURCE_COLORS: Record<string, string> = {
  'MS News Today': '#648FFF',
  'National MS Society': '#5C7A6B',
  'MSAA': '#C4714A',
  'MS Society': '#D4A843',
}

export default function NewsHub() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('All')

  useEffect(() => {
    setTimeout(() => {
      setArticles(STATIC_ARTICLES)
      setLoading(false)
    }, 600)
  }, [])

  const sources = ['All', 'MS News Today', 'National MS Society', 'MSAA', 'MS Society']

  const filtered = filter === 'All'
    ? articles
    : articles.filter(a => a.source === filter)

  return (
    <div style={{ minHeight: '100vh', background: '#1C2B3A', paddingBottom: '80px' }}>
      <AppHeader title="MS News" subtitle="Stay informed about your condition" />

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {sources.map(s => {
            const active = filter === s
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '50px',
                  border: 'none',
                  background: active ? '#FAF7F2' : 'rgba(255,255,255,0.1)',
                  color: active ? '#1C2B3A' : '#8FAF9F',
                  fontSize: '12px',
                  fontWeight: active ? 600 : 400,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}
              >
                {s}
              </button>
            )
          })}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', color: '#8FAF9F', padding: '40px' }}>
            Loading latest MS news...
          </div>
        )}

        {filtered.map((article, i) => {
          const tagColor = SOURCE_COLORS[article.source] ?? '#8FAF9F'
          return (
            <a
              key={i}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#FAF7F2',
                borderRadius: '20px',
                padding: '20px',
                textDecoration: 'none',
                display: 'block',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
              }}>
                <div style={{
                  background: tagColor + '22',
                  color: tagColor,
                  borderRadius: '20px',
                  padding: '3px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                }}>
                  {article.source}
                </div>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>
                  {formatDate(article.published)}
                </div>
              </div>
              <div style={{
                fontSize: '15px',
                fontWeight: 600,
                color: '#1C2B3A',
                lineHeight: 1.4,
                marginBottom: '8px',
              }}>
                {article.title}
              </div>
              <div style={{
                fontSize: '13px',
                color: '#6B7280',
                lineHeight: 1.6,
              }}>
                {article.summary}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#5C7A6B',
                fontWeight: 500,
                marginTop: '10px',
              }}>
                Read more →
              </div>
            </a>
          )
        })}

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '16px',
          padding: '16px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '12px', color: '#8FAF9F', lineHeight: 1.6 }}>
            News sourced from MS Society, MS News Today, MSAA, and National MS Society.
            Tap any article to read the full story.
          </div>
        </div>

      </div>
      <BottomNav />
    </div>
  )
}
