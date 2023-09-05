import { useNavigate } from 'react-router-dom'
import useServer from '../hooks/useServer'
import EntryForm from '../components/EntryForm'

function NewEntry() {
  const { post } = useServer()
  const redirect = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    const { data } = await post({ url: '/entries/', body: form })
    if (data.status === 'ok') redirect('/')
  }

  return <>
  <div className="container max-w-2xl mx-auto mt-10">
    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">Agrega tu entrada</h2>
    <p className="mt-2 text-lg leading-8 text-gray-600 text-center">
      Learn how to grow your business with our expert advice.
    </p>
    <EntryForm handleSubmit={handleSubmit} entry={{}} deletePhoto={{}} />
  </div>
  </>
}

export default NewEntry
 