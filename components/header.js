import Link from 'next/link'

function Header() {
  return (
    <header className='container-2xl py-6'>
      <nav className='space-x-4'>
        <Link href='/'>
          <a>About</a>
        </Link>
        <Link href='/blog'>
          <a>Blog</a>
        </Link>
      </nav>
    </header>
  )
}
export default Header
