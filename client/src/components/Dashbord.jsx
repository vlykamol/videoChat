import React, { useRef } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";

// const URI = ''
const URI = 'http://localhost:8080'

export default function Dashbord() {

  const nameRef = useRef()
  const roomRef = useRef()
  const navigator = useNavigate()

  const handelClick = () => {
    axios.post(`${URI}/api/joinRoom`, {
      name : nameRef.current.value,
      room : roomRef.current.value
    }).then(res => {
      console.log(res.data);
      navigator(`/room/${res.data.room}`)
    }).catch(err => {
      console.log(err.message);
    })
    console.log('click');
  }
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <div className='bg-slate-500/95 text-black p-4 rounded-lg flex flex-col gap-2'>
        <h1 className='font-serif underline text-3xl font-bold text-center'>Join Room</h1>
        <label className='font-mono text-lg' htmlFor="Name">Name : </label>
        <input ref={nameRef} className=' bg-transparent border-b-2 p-1' type="text" />
        <label className='font-mono text-lg' htmlFor="roomId">Room : </label>
        <input ref={roomRef} className=' bg-transparent border-b-2 p-1' type="text" />
        <button onClick={handelClick} className='bg-slate-50 p-2 rounded-xl'>Join</button>
      </div>
    </div>
  )
}
