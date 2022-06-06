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
    displayName: string,
    connectionId: string
}

function MeetingRoom() {
    const [meetingStatus, setMeetingStatus] = React.useState('fetching')
    const [users, setUsers] = React.useState<IUser[]>([])
    const [newUser, registerNewUser] = React.useState<IUser | null>(null)
    const [userList, setUserList] = React.useState<IUser[]>([])
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
            console.log("LOG: ", users.find(x => x.connectionId === exitedId))
            const updatedList = users.filter(x => x.connectionId !== exitedId)
            console.log("updatedList: ", updatedList)
            setUsers(updatedList)
        }
    }, [exitedId])
    useEffect(() => {
        console.log("userList: ", userList)
            const updatedList = [
                ...users,
                ...userList
            ]
            setUsers(updatedList)
    }, [userList])
    useEffect(() => {
        console.log("new: ", newUser)
        if (newUser) {
            const updatedList = users
            if(newUser.meetingId === meetingId && !users.some(x => x.connectionId === newUser.connectionId)) {
                updatedList.push(newUser)
            }
            setUsers(updatedList)
        }
    }, [newUser])
    let socket: any = useRef(null)
    const { meetingId }: any = useParams()
    React.useEffect(() => {
        socket.current = io('http://localhost:5000')
        socket.current.on('connect_error', () => {
            setTimeout(() => socket.current.connect(), 5000)
        })
        socket.current.on('connect', (payload: any) => {
            console.log("connect", socket.current?.id)
            registerNewUser({
                connectionId: socket.current.id,
                displayName: "Me",
                meetingId: meetingId,
            })
        })
        socket.current.on('updateData', (payload: any) => {
            setUserList(payload.userConnections)
        })
        socket.current.on('newUser', (payload: any) => {
            setTimeout(() => {
                registerNewUser(payload)
            }, 100);
        })
        socket.current.on('userLeft', (payload: any) => {
            console.log("DDD: ", payload)
            setExitedId(payload)
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