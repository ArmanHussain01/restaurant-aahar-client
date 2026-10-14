import React from 'react'

const Carousel = ({image,title}) => {


  return (
    <div className='flex flex-col justify-center items-center'>
      <img className='w-40 h-40 lg:h-56 lg:w-56 rounded-full object-cover object-center'
      src={image} alt='' 
      />
      <span className='py-5 font-semibold text-xl text-gray-400 '>{title}</span>

    </div>
  )
}

export default Carousel