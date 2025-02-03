import React, { useState } from 'react'

export default function Search({search , handlSearchTerm}) {
  
  const [focues, setFocues] = useState(false)

  return (
    <div className={`search relative transition ease-in-out delay-50 ${focues ? ' border border-red-400' : '' }`}> 

      <img 
        src='/search.svg'
        alt='search'
        className='absolute left-4 top-5 h-5 w-5'
      />

      <input 
        type='text'
        placeholder='Search For A Movie'
        value={search}
        onChange={  (e) => handlSearchTerm( e.target.value )}

        onFocus={() => setFocues(true)}
        onBlur={() =>setFocues(false)}
      />

    </div>
  )


}
