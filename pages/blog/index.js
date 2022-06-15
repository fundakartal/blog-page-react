import Image from 'next/image'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'

export default function BlogPage({ posts }) {
  return (
    <div className='container-2xl space-y-6'>
      {posts.map((post, index) => (
        <Link href={'/blog/' + post.slug} passHref key={index}>
          <a className='flex flex-col md:flex-row max-w-[500px] md:max-w-xl rounded-lg bg-white shadow-lg'>
            <div className='md:max-w-[50%] text-[0]'>
              <Image
                src={post.frontMatter.thumbnailUrl}
                className='rounded-t-lg md:rounded-tr-none md:rounded-l-lg w-fill'
                alt='thumbnail'
                width={500}
                height={400}
                objectFit='cover'
              />
            </div>
            <div className='p-6 flex flex-col '>
              <h5 className='text-gray-900 text-xl font-medium mb-2'>
                {post.frontMatter.title}
              </h5>
              <p className='text-gray-700 text-base mb-4'>
                {post.frontMatter.description}
              </p>
              <p className='text-gray-600 text-xs'>{post.frontMatter.date}</p>
            </div>
          </a>
        </Link>
      ))}
    </div>
  )
}

export const getStaticProps = async () => {
  const files = fs.readdirSync(path.join('posts'))

  const posts = files.map((filename) => {
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

  return {
    props: {
      posts,
    },
  }
}
