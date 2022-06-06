import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'

const servers = {
    iceServers: [
        {
            urls: [
                'stun:stun.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
            ]
        }
    ]
}

interface IUser {
    meetingId: string,
    userId: string,
    connectionId: string
}

function MeetingRoom() {
    const [meetingStatus, setMeetingStatus] = React.useState('fetching')
    const [users, setUsers] = React.useState<IUser[]>([])
    const [newUser, registerNewUser] = React.useState<IUser | null>(null)
    const [exitedId, setExitedId] = React.useState<string>("")
    const myVideoRef: any = useRef(null)
    async function turnVideoOn() {
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        if (myVideoRef.current) {
            myVideoRef.current.srcObject = localStream
        }

    }
    useEffect(() => {
        turnVideoOn()
    }, [])
    useEffect(() => {
        if (exitedId) {
            const updatedList = users.filter(x => x.connectionId !== exitedId)
            setUsers(updatedList)
        }
    }, [exitedId])
    useEffect(() => {
        if (newUser) {
            const updatedList = users
            if(newUser.meetingId === meetingId) {
                updatedList.push(newUser)
            }
            setUsers(updatedList)
        }
    }, [newUser])
    let socket: any = useRef(null)
    const { meetingId } = useParams()
    React.useEffect(() => {
        socket.current = io('http://localhost:5000')
        socket.current.on('connect', () => console.log("ID: ", socket.current.id))
        socket.current.on('connect_error', () => {
            setTimeout(() => socket.current.connect(), 5000)
        })
        // socket.current.on('time', (data: any) => setMeetingStatus(data))
        socket.current.on('newUser', (payload: any) => {
            registerNewUser(payload)
        })
        socket.current.on('userLeft', (payload: any) => {
            setExitedId(payload.id)
        })
        socket.current.on('disconnect', () => setMeetingStatus('server disconnected'))
        socket.current.emit('userconnect', {
            displayName: "Mehran",
            meetingId: meetingId
        })
        return () => {
            socket.current.close()
            socket.current = null
        }

    }, [])

    return (
        <div>
            <h1>MeetingRoom</h1>
            <p>
                <p>NUM: {users.map((x: any) => {
                    return <p> {x.displayName} </p>
                })}</p>
                <Link to="/">Back</Link>
            </p>

            <div className="videos">
                <video ref={myVideoRef} src="" className="myVideo" autoPlay></video>
            </div>
        </div>

    )
}

export default MeetingRoom