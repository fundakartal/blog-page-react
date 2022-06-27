import { useState, useEffect } from "react"
import { useAuth0 } from "@auth0/auth0-react"

export default function () {
  const { getAccessTokenSilently } = useAuth0()
  const [url, setUrl] = useState(null)
  const [text, setText] = useState('')
  const [comments, setComments] = useState([])

  const fetchComment = async () => {
    const query = new URLSearchParams({ url })
    const newURL = `/api/comment?${query.toString()}`
    const response = await fetch(newURL, {
      method: 'GET',
    })
    const data = await response.json()
    setComments(data)
  }
  useEffect(() => {
    if (!url) return
    fetchComment()
  }, [url])

  useEffect(() => {
    const url = window.location.origin + window.location.pathname
    setUrl(url)
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    const userToken = await getAccessTokenSilently()

    await fetch('/api/comment', {
      method: 'POST',
      body: JSON.stringify({ text, userToken, url }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    fetchComment()
    setText('')
  }

  return [comments, onSubmit, text, setText]
}
