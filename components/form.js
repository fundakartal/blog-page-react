import { useAuth0 } from '@auth0/auth0-react'

function Form({ onSubmit, setText, text }) {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0()

  return (
    <form className='mt-10' onSubmit={onSubmit}>
      <textarea
        rows='2'
        className='border border-gray-300 w-full rounded block px-2 py-1'
        onChange={(e) => setText(e.target.value)}
        value={text}
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
                    returnTo: `${process.env.NEXT_PUBLIC_URL}/blog`,
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
  )
}

export default Form