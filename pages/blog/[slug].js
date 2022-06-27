import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import SyntaxHighlighter from 'react-syntax-highlighter'
import Button from '../../components/button'
import Link from 'next/link'
import Form from '../../components/form'
import Comments from '../../components/comments'
import useComment from '../../hooks/useComment'

export default function PostPage({ frontMatter, mdxSource, slug }) {
  const { title, description, tags } = frontMatter
  const [comments, onSubmit, text, setText] =useComment()

  return (
    <div className='container-2xl mt-4'>
      <article className='space-y-6'>
        <h1 className='text-4xl font-bold'>{title}</h1>
        <p>{description}</p>
        <p>
          {tags.map((tag) => (
            <Link href={`/tag/${tag.toLowerCase()}`} key={tag}>
              <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 cursor-pointer'>
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
      <Form onSubmit={onSubmit} text={text} setText={setText} />
      <Comments comments={comments} />
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
