import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '3')
  const lang = searchParams.get('lang') || 'en'
  const postsDirectory = path.join(process.cwd(), `app/posts${lang === 'es' ? '/es' : ''}`)
  
  // Get all markdown files
  const filenames = fs.readdirSync(postsDirectory)
    .filter(file => file.endsWith('.md'))
  
  // Sort by post number in descending order
  const sortedFilenames = [...filenames].sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || '0')
    const numB = parseInt(b.match(/\d+/)?.[0] || '0')
    return numB - numA
  })

  // Calculate pagination
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedFilenames = sortedFilenames.slice(start, end)

  // Load paginated post contents
  const posts = paginatedFilenames.map(filename => {
    const filePath = path.join(postsDirectory, filename)
    const content = fs.readFileSync(filePath, 'utf8')
    return content
  })

  return NextResponse.json({
    posts,
    total: sortedFilenames.length,
    hasMore: end < sortedFilenames.length
  })
}
