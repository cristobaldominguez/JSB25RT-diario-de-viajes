import Flickity from 'react-flickity-component'

import { APIUrl } from '../config'

// CSS
import "flickity/css/flickity.css"

function Carousel({ photos }) {
  const flickityOptions = {
      initialIndex: 0,
      lazyLoad: true,
      pageDots: photos.length > 1
  }

  return (
    <Flickity
      className={'aspect-[16/9] sm:aspect-[2/1] lg:aspect-[3/2]'} // default ''
      elementType={'div'} // default 'div'
      options={flickityOptions} // takes flickity options {}
      disableImagesLoaded={false} // default false
      reloadOnUpdate // default false
      static // default false
    >
      {photos.map(photo => (
        <img 
          key={photo.id}
          className='object-cover w-full h-full'
          data-flickity-lazyload={APIUrl + '/images/' + photo.name}
        />
      ))}
    </Flickity>
  )
}

export default Carousel
