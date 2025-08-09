import React from 'react'

const Holder = ({name}) => {
    return (
        <div className=' p-2  w-50 rounded-md bg-sky-100 border-solid border-sky-600 text-center text-sky-700 font-semibold text-lg'>
            {name}
        </div>
    )
}

const MessChangeCard = ({fullname="krishna", rollno="240101046", from="barak", to="lohit", status="accepted"}) => {
  return (
    <div className='h-48 w-full rounded shadow-md mb-4'>
        <div className="h-2/5 bg-gradient-to-r from-sky-600 to-sky-400">
            <div className="text-white text-2xl font-bold pl-4 pt-4">{fullname}</div>
            <span className="text-white text-sm pl-4">{rollno}</span>
        </div>
        <div className="h-3/5 flex flex-row justify-evenly items-center">
            <Holder name = {`from : ${from}`}/>
            <Holder name={`to : ${to}`}/>
            <Holder name={`status : ${status}`}/>
        </div>
    </div>
  )
}

export default MessChangeCard