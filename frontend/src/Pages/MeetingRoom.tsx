import React, { useEffect, useRef, useState } from 'react'
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
    const [status, setStatus] = React.useState('Pending')
    const [profile, setProfile]= useState<IUser>(null)
    const [users, setUsers] = React.useState<IUser[]>([])
    const myVideoRef: any = useRef(null)
    async function turnVideoOn() {
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        if (myVideoRef.current) {
            myVideoRef.current.srcObject = localStream
        }

    }
    useEffect(() => {
        // turnVideoOn()
    }, [])

    let socket: any = useRef(null)
    const { meetingId }: any = useParams()
    React.useEffect(() => {
        let _sc = socket.current
        _sc = io('http://localhost:5000')
        _sc.on('connect_error', () => {
            setTimeout(() => _sc.connect(), 5000)
        })


        _sc.on('connect', (payload: any) => {
            setStatus('You are online now')
        })
        const userInfo: any = {
            displayName: "Mehran" + (Math.floor(Math.random() * 1000)),
            meetingId: meetingId
        }
        console.log("user: ", userInfo)
        _sc.emit('register', {...userInfo})

        setProfile(userInfo)

        _sc.on("newUser" , (payload: IUser) => {
            setUsers((userList) => userList.concat(payload))
        })

        _sc.emit("getOtherUsers", meetingId)
        _sc.on("updateUserList", (payload) => {
            setUsers((state) => state.concat(payload.list))
        })
        _sc.on('userLeft', (payload) => {
            setUsers((preState) => preState.filter(x => x.connectionId !== payload))
        })
        
        _sc.on('disconnect', () => setStatus('server disconnected'))
        return () => {
            _sc.close()
            _sc = null
        }

    }, [])

    return (
        <div>
            <p>Status: {status}</p>
            <p>PROFILE:{profile?.displayName} in Room {profile?.meetingId} </p>
            <Link to="/">Back</Link>
            <p>
                {users.map((x: any) => {
                    return <p> {x.displayName} </p>
                })}
            </p>

        </div>

    )
}

export default MeetingRoom