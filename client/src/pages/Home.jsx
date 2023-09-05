import { useEffect, useState } from 'react'

import useServer from '../hooks/useServer'
import SearchBar from '../components/SearchBar'
import useAuth from '../hooks/useAuth'
import EntryFooter from '../components/EntryFooter'
import Carousel from '../components/Carousel'

// Helpers
import avatar from '../helpers/avatar'

function Home() {
  const [entries, setEntries] = useState([])
  const [keyword, setKeyword] = useState('')
  const { get } = useServer()
  const { isAuthenticated } = useAuth()

  const getEntries = () => {
    get({ url: `/entries?keyword=${keyword}` })
      .then(({ data }) => data.data && setEntries(data.data?.entries))
  }

  const searchSubmitHandler = (e) => {
    e.preventDefault()
    setKeyword(e.target.keyword.value)
  }

  useEffect(() => {
    getEntries()
  }, [])

  useEffect(() => {
    getEntries()
  }, [keyword])

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">From the blog</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Learn how to grow your business with our expert advice.
          </p>
          <SearchBar submitHandler={searchSubmitHandler} />
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {entries && entries.map((post) => (
            <article key={post.id} className="flex flex-col items-start justify-between">
              <div className="relative w-full">
                <div className="rounded-2xl">
                  <Carousel photos={post.photos} />
                </div>
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <time dateTime={post.createdAt} className="text-gray-500">
                    {post.createdAt}
                  </time>
                  <a
                    href="/#"
                    className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                  >
                    {post.place}
                  </a>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <a href="/#">
                      <span className="absolute inset-0" />
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{post.description}</p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4">
                  {avatar(post.avatar)}
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900">
                      <a href="/#">
                        <span className="absolute inset-0" />
                        {post.username}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              {isAuthenticated && !!post.owner && <EntryFooter id={post.id} />}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home