import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import SyntaxHighlighter from 'react-syntax-highlighter'
import Button from '../../components/button'
import Link from 'next/link'
import { useAuth0 } from '@auth0/auth0-react'
import { useState, useEffect } from 'react'

export default function PostPage({ frontMatter, mdxSource, slug }) {
  const { title, description, tags } = frontMatter
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    user,
    getAccessTokenSilently,
  } = useAuth0()
  const [text, setText] = useState('')
  const [url, setUrl] = useState(null)

  useEffect(() => {
    const url = window.location.origin + window.location.pathname
    setUrl(url)
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    const userToken = await getAccessTokenSilently()

    const response = await fetch('/api/comment', {
      method: 'POST',
      body: JSON.stringify({ text, userToken, url }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
  }

  return (
    <div className='container-2xl mt-4'>
      <article className='space-y-6'>
        <h1 className='text-4xl font-bold'>{title}</h1>
        <p>{description}</p>
        <p>
          {tags.map((tag) => (
            <Link href={`/tag/${tag.toLowerCase()}`} key={tag}>
              <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2'>
                {tag.toLowerCase()}
              </span>
            </Link>
          ))}
        </p>
        <hr />
        <div className='prose'>
          <MDXRemote
            {...mdxSource}
            components={{ Button, SyntaxHighlighter }}
          />
        </div>
      </article>
      <form className='mt-10' onSubmit={onSubmit}>
        <textarea
          rows='2'
          className='border border-gray-300 w-full rounded block px-2 py-1'
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <div className='mt-4'>
          {isAuthenticated ? (
            <div className='flex items-center justify-between gap-x-2'>
              <button className='bg-blue-600 px-2 py-1 rounded text-white'>
                Send
              </button>
              <div className='flex items-center gap-x-2'>
                <img src={user.picture} width={40} className='rounded-full' />
                <span className='font-semibold'>{user.name}</span>
                <button
                  onClick={() =>
                    logout({
                      returnTo: `${process.env.NEXT_PUBLIC_URL}/blog/${slug}`,
                    })
                  }
                >
                  &#128473;
                </button>
              </div>
            </div>
          ) : (
            <button
              className='bg-blue-600 px-2 py-1 rounded text-white'
              onClick={() => loginWithRedirect()}
            >
              Login
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export const getStaticPaths = async () => {
  const files = fs.readdirSync(path.join('posts'))

  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace('.mdx', ''),
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps = async ({ params: { slug } }) => {
  const markdownWithMeta = fs.readFileSync(
    path.join('posts', slug + '.mdx'),
    'utf-8'
  )

  const { data: frontMatter, content } = matter(markdownWithMeta)
  const mdxSource = await serialize(content)

  return {
    props: {
      frontMatter,
      slug,
      mdxSource,
    },
  }
}
