import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useServer from "../hooks/useServer"
import EntryForm from "../components/EntryForm"

function EditEntry() {
  const { get } = useServer()
  const { id } = useParams()
  const [ entry, setEntry ] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    console.log(form)
  }

  useEffect(() => {
    get({ url: `/entries/${id}` })
      .then(({ data }) => setEntry(data.data.entry))
  }, [])

  if (!entry?.owner) return <h1 className="text-2xl tracking-tight text-gray-900 sm:text-3xl text-center p-8">Necesitas ser el dueño de la entrada para editarla</h1>

  return <>
    <div className="container max-w-2xl mx-auto mt-10">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">Edita tu entrada</h2>
      <p className="mt-2 text-lg leading-8 text-gray-600 text-center">
        Learn how to grow your business with our expert advice.
      </p>
      {entry && <EntryForm handleSubmit={handleSubmit} entry={entry} />}
    </div>
  </>
}

export default EditEntry
