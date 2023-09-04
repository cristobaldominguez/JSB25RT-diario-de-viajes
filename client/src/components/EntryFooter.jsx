import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

function EntryFooter({ id }) {
  return (
    <div className="-mt-px flex divide-x divide-gray-200 w-full">
      <div className="flex w-0 flex-1">
        <Link
          to={`/entries/${id}/edit`}
          className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
        >
          <PencilIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          Editar
        </Link>
      </div>
      <div className="-ml-px flex w-0 flex-1">
        <Link
          to={`/entries/${id}/delete`}
          className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
        >
          <TrashIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          Borrar
        </Link>
      </div>
    </div>
  )
}

export default EntryFooter
