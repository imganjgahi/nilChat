import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'

function Home() {
    const nav = useNavigate()
    return (
        <div>
            <p>NILI CHAT</p>
            <button onClick={() => {
                // nav("/meeting/"+ Math.floor(Math.random() * 30000000))
                nav("/meeting/"+ 2)
            }}>New Chat</button>
        </div>
    )
}

export default Home