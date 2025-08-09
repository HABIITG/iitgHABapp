import React from 'react'

const Pagination = ({pages, paginate, pageNumber}) => {

    let pagesarr = [];
    for(let i=1; i<=pages; i++) {
        pagesarr.push(i);
    }

  return (
    <>
        <ul className='flex justify-center align-centre gap-2'>
            {
            pagesarr.map((number) => {
            return(
                <li key={number} className= {`h-8 w-8 flex justify-center align-centre rounded-full bg-sky-400 text-white text-md
                    ${number === pageNumber  ? 'bg-sky-700 shadow-md' : 'bg-sky-400'}
                `}>
                    <button onClick={() => paginate(number)}>
                        {number}
                    </button>
                </li>
            )})
            }
        </ul>
    </>
  )
}

export default Pagination