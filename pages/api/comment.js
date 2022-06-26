import { nanoid } from 'nanoid'
import Redis from 'ioredis'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text, userToken, url } = req.body

    if (!text || !userToken || !url) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const userResponse = await fetch(
      `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
    const user = await userResponse.json()

    const comment = {
      id: nanoid(),
      createdAt: Date.now(),
      text,
      user: {
        name: user.name,
        picture: user.picture,
      },
    }
    let redis = new Redis(`${process.env.REDIS_URL}`)
    redis.lpush(url, JSON.stringify(comment))
    redis.quit()
    res.status(200).json(comment)
  }

  if (req.method === 'GET') {
    const { url } = req.query
    let redis = new Redis(`${process.env.REDIS_URL}`)
    const comments = await redis.lrange(url, 0, -1)
    redis.quit()
    const data = comments.map((comment) => JSON.parse(comment))
    res.status(200).json(data)
  }
}
