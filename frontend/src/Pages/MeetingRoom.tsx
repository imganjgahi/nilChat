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
    const [users, setUsers] = React.useState<IUser[]>([])
    const [wsId, setWsId] = useState("")
    let socket: any = useRef(null)
    const { meetingId }: any = useParams()

    const configuration = {
        ...servers,
    }


    async function setNewConnection(connectionId) {
        let connection = new RTCPeerConnection(configuration)

        connection.onnegotiationneeded = async (e) => {
            await setOffer(connectionId)
        }
        connection.onicecandidate = (event) => {
            if(event.candidate) {
                SDP_function(JSON.stringify({iceCandidate: event.candidate}), connectionId)
            }
        }
    }
    async function turnVideoOn(connectionId) {
        if(connectionId === wsId) {
            const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            if (document.getElementById(connectionId)) {
                (document.getElementById(connectionId) as any).srcObject = localStream
            }
        } else {
            setNewConnection(connectionId)
        }

    }
    useEffect(() => {
        users.forEach(async (person) => {
            await turnVideoOn(person.connectionId)
        })
    }, [users])

    async function setOffer(connectionId: string) {
        
    }

    async function SDP_function(data, to_connectionId) {
        socket.current?.emit('SDPProccess', {
            massage: data,
            to_connectionId
        })
    }
    React.useEffect(() => {
        let _sc = socket.current
        _sc = io('http://localhost:5000')
        _sc.on('connect', () => setWsId( _sc.id))
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

        _sc.on("newUser" , (payload: IUser) => {
            setUsers((userList) => userList.concat(payload))
        })
        _sc.on("updateUserList", (payload) => {
            setUsers((state) => payload.list)
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

    console.log("socket.current?.id: ", wsId)
    return (
        <div>
            <p>Status: {status}</p>
            <p>PROFILE: {users.find(x => x.connectionId === wsId)?.displayName || ""} </p>
            <Link to="/">Back</Link>
            <p>
                {users.map((x: any) => {
                    return <p> {x.displayName} </p>
                })}
            </p>
                <div className="videos">
                    {
                        users.map(person => {
                            return <video id={person.connectionId} src="" className="myVideo" autoPlay muted controls />
                        })
                    }
                </div>
        </div>

    )
}

export default MeetingRoom