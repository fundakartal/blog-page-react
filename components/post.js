import Link from 'next/link'
import Image from 'next/image'

export default function Post({ post, index }) {
  const { title, description, date, tags, thumbnailUrl } = post.frontMatter
  return (
    <Link href={'/blog/' + post.slug} passHref key={index}>
      <a className='flex flex-col md:flex-row max-w-[500px] md:max-w-full rounded-lg bg-white shadow-lg'>
        <div className='md:max-w-[50%] text-[0]'>
          <Image
            src={thumbnailUrl}
            className='rounded-t-lg md:rounded-tr-none md:rounded-l-lg w-fill'
            alt='thumbnail'
            width={500}
            height={400}
            objectFit='cover'
          />
        </div>
        <article className='p-6 flex flex-col gap-y-4'>
          <h5 className='text-gray-900 text-xl font-medium'>{title}</h5>
          <p className='text-gray-700 text-base'>{description}</p>
          <p>
            {tags.map((tag) => (
              <Link href={`/tag/${tag.toLowerCase()}`} key={tag}>
                <a className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2'>
                  {tag.toLowerCase()}
                </a>
              </Link>
            ))}
          </p>
          <p className='text-gray-600 text-xs'>{date}</p>
        </article>
      </a>
    </Link>
  )
}
