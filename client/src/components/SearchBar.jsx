import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

function SearchBar({ submitHandler }) {
  return (
    <form onSubmit={submitHandler} className="relative mt-2 flex items-center">
      <input
        type="text"
        name="keyword"
        id="search"
        className="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
      <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
        <button type='submit' className="inline-flex items-center px-1 font-sans text-xs text-gray-400">
          <MagnifyingGlassIcon aria-hidden="true" className='h-5' />
        </button>
      </div>
    </form>
  )
}

export default SearchBar
