'use client'

import { useState, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import matter from 'gray-matter'
import Image from 'next/image'

interface PostMetadata {
  title: string
  date: string
  instagram?: string
  image?: string | string[]
  youtube?: string
}

export default function PostList() {
  const [posts, setPosts] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const postsPerPage = 3

  const loadPosts = useCallback(async () => {
    if (loading || !hasMore) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/posts?page=${page}&limit=${postsPerPage}`)
      const data = await response.json()
      setPosts(prev => [...prev, ...data.posts])
      setHasMore(data.hasMore)
      setPage(prev => prev + 1)
    } catch (error) {
      console.error('Error loading posts:', error)
    }
    setLoading(false)
  }, [loading, hasMore, page, postsPerPage])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  useEffect(() => {
    if (posts.some(post => matter(post).data.instagram)) {
      const script = document.createElement('script')
      script.src = 'https://www.instagram.com/embed.js'
      script.async = true
      script.defer = true
      document.body.appendChild(script)

      const timer = setInterval(() => {
        if (window.instgrm) {
          window.instgrm.Embeds.process()
          clearInterval(timer)
        }
      }, 1000)

      return () => {
        clearInterval(timer)
        const scripts = document.getElementsByTagName('script')
        for (const script of scripts) {
          if (script.src.includes('instagram.com/embed.js')) {
            document.body.removeChild(script)
          }
        }
      }
    }
  }, [posts])

  // Add scroll handler to load more posts
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadPosts()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, hasMore])

  return (
    <div className="space-y-12">
      {posts.map((post, index) => {
        const { data, content } = matter(post)
        const metadata = data as PostMetadata
        
        return (
          <div key={index}>
            <article className="prose prose-slate lg:prose-lg max-w-none prose-headings:font-bold prose-h1:text-4xl">
              <h1>{metadata.title}</h1>
              {metadata.image && (
                Array.isArray(metadata.image) 
                  ? (
                    <div className={`grid gap-4 ${
                      metadata.image.length === 1 ? 'grid-cols-1' :
                      metadata.image.length === 2 ? 'grid-cols-2' :
                      'grid-cols-3'
                    }`}>
                      {metadata.image.map((img, i) => (
                        <Image 
                          key={i} 
                          src={img} 
                          alt={`${metadata.title} ${i + 1}`}
                          width={800}
                          height={600}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )
                  : <Image 
                      src={metadata.image} 
                      alt={metadata.title}
                      width={800}
                      height={600}
                      className="w-full rounded-lg"
                    />
              )}
              {metadata.youtube && (
                <div className="relative w-2/3 pt-[40%] m-auto">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                    src={`https://www.youtube.com/embed/${metadata.youtube}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
              {metadata.instagram && (
                <div className="flex justify-center my-8">
                  <blockquote 
                    className="instagram-media" 
                    data-instgrm-captioned 
                    data-instgrm-permalink={`https://www.instagram.com/p/${metadata.instagram}/`}
                    data-instgrm-version="14"
                    style={{
                      background: '#FFF',
                      border: '0',
                      borderRadius: '3px',
                      boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                      margin: '1px',
                      maxWidth: '540px',
                      minWidth: '326px',
                      padding: '0',
                      width: '99.375%'
                    }}>
                  </blockquote>
                </div>
              )}
            </article>
            {index < posts.length - 1 && <hr className="my-12 border-gray-200" />}
          </div>
        )
      })}
      {loading && <div>Loading...</div>}
    </div>
  )
}
