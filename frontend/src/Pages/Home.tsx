import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'

function Home() {
    const nav = useNavigate()
    return (
        <div>

            <h1>Home </h1>
            <button onClick={() => {
                nav("/meeting/"+ Math.floor(Math.random() * 30000000))
            }}>New Chat</button>
        </div>
    )
}

export default Home