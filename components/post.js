import Link from 'next/link'
import Image from 'next/image'

export default function Post({post, index}) {
  return (
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
  )
}
