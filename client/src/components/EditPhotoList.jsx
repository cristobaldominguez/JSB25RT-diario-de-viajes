import { TrashIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

import { APIUrl } from "../config"

function EditPhotoList({ photos, deletePhotoHandler }) {

  return (
    <ul role="list" className="grid grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6">
      {photos.map((photo) => (
        <li key={photo.id} className="relative">
          <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
            <img src={APIUrl + '/images/' + photo.name} alt="" className="object-cover" />
          </div>
          <div className='flex'>
            <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900 grow">{photo.name}</p>
            <Link to={photo.id} onClick={e => deletePhotoHandler({ e, id: photo.id })} className="block text-sm font-medium text-gray-500">
              <TrashIcon className="pointer-events-none h-5 w-5 text-rose-700 mt-2" aria-hidden="true" />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default EditPhotoList
