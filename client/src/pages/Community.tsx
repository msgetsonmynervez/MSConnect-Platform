import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'
import AppHeader from '../components/AppHeader'
import FogView from '../components/FogView'
import { useEnergy } from '../context/EnergyContext'

interface Post {
  id: string
  body: string
  post_type: string
  hug_count: number
  reply_count: number
  created_at: string
  display_name: string
  group_name: string
}

const POST_TYPE_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  win: { bg: '#EDF3F0', color: '#5C7A6B', label: '🎉 Win' },
  infusion_day: { bg: '#EFF6FF', color: '#3b82f6', label: '💉 Infusion Day' },
  standard: { bg: '#F5F3FF', color: '#7C3AED', label: '💬 Post' },
  question: { bg: '#FFF7ED', color: '#C4714A', label: '❓ Question' },
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export default function Community() {
  const navigate = useNavigate()
  const { fogMode } = useEnergy()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [hugging, setHugging] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser()
      if (!user) { navigate('/signin'); return }
      const { data } = await supabase
        .from('posts')
        .select(`id, body, post_type, hug_count, reply_count, created_at,
          users!author_id (display_name),
          community_groups!group_id (name)`)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(20)
      if (data) {
        setPosts(data.map((p: any) => ({
          id: p.id, body: p.body, post_type: p.post_type,
          hug_count: p.hug_count, reply_count: p.reply_count,
          created_at: p.created_at,
          display_name: p.users?.display_name ?? 'Anonymous',
          group_name: p.community_groups?.name ?? '',
        })))
      }
      setLoading(false)
    }
    load()
  }, [navigate])

  async function handleHug(postId: string, currentCount: number) {
    setHugging(postId)
    setPosts(ps => ps.map(p => p.id === postId ? { ...p, hug_count: p.hug_count + 1 } : p))
    await supabase.from('posts').update({ hug_count: currentCount + 1 }).eq('id', postId)
    setHugging(null)
  }

  if (fogMode) {
    return (
      <div style={{ minHeight: '100vh', background: '#1C2B3A' }}>
        <FogView
          title="Community"
          primaryLabel="Read latest post 💬"
          onPrimary={() => {}}
        />
        <BottomNav />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1C2B3A', paddingBottom: '80px' }}>
      <AppHeader title="Community" subtitle="You are not alone in this" />
      {loading && (
        <div style={{ textAlign: 'center', color: '#8FAF9F', padding: '40px' }}>Loading posts...</div>
      )}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {posts.map(post => {
          const typeStyle = POST_TYPE_STYLES[post.post_type] ?? POST_TYPE_STYLES.standard
          return (
            <div key={post.id} style={{ background: '#FAF7F2', borderRadius: '20px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1C2B3A' }}>{post.display_name}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                    {post.group_name} · {timeAgo(post.created_at)}
                  </div>
                </div>
                <div style={{
                  background: typeStyle.bg, color: typeStyle.color,
                  borderRadius: '20px', padding: '4px 10px', fontSize: '11px', fontWeight: 500
                }}>
                  {typeStyle.label}
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#2C2C2C', lineHeight: 1.6, marginBottom: '16px' }}>{post.body}</p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button onClick={() => handleHug(post.id, post.hug_count)} style={{
                  background: '#EDF3F0', border: 'none', borderRadius: '20px',
                  padding: '8px 14px', fontSize: '13px', color: '#5C7A6B',
                  cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  🤗 {post.hug_count}
                </button>
                <div style={{
                  background: '#F5F5F5', borderRadius: '20px', padding: '8px 14px',
                  fontSize: '13px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  💬 {post.reply_count}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <BottomNav />
    </div>
  )
}
