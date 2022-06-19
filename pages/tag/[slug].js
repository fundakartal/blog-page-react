import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Post from '../../components/post'

export default function TagPage({ posts, slug }) {
  return (
    <div className='container-2xl space-y-6'>
      <h1 className='text-gray-900 text-xl font-medium'>
        Posts tagged with <span>{slug}</span>
      </h1>
      <hr />
      {posts.map((post, index) => (
        <Post key={index} post={post} />
      ))}
    </div>
  )
}

export const getStaticPaths = async () => {
  const files = fs.readdirSync(path.join('posts'))
  const tags = files
    .map((filename) => {
      const markdownWithMeta = fs.readFileSync(
        path.join('posts', filename),
        'utf-8'
      )
      const { data: frontMatter } = matter(markdownWithMeta)
      return frontMatter.tags
    })
    .flat()
    .filter((tag, index, self) => self.indexOf(tag) === index)
    .map((tag) => ({
      params: {
        slug: tag.toLowerCase(),
      },
    }))
  return {
    paths: tags,
    fallback: false,
  }
}

export const getStaticProps = async ({ params: { slug } }) => {
  const files = fs.readdirSync(path.join('posts'))
  const posts = files
    .map((filename) => {
      const markdownWithMeta = fs.readFileSync(
        path.join('posts', filename),
        'utf-8'
      )
      const { data: frontMatter } = matter(markdownWithMeta)
      return {
        frontMatter,
        slug: filename.split('.')[0],
      }
    })
    .filter((post) =>
      post.frontMatter.tags.some((tag) => tag.toLowerCase() === slug)
    )
  return {
    props: {
      slug,
      posts: posts.sort((a, b) => {
        return new Date(b.frontMatter.date) - new Date(a.frontMatter.date)
      }),
    },
  }
}