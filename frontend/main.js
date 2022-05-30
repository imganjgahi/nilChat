let localStream;
let remoteStream;
let peerConnection;

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
async function init() {
    localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: false})
    document.getElementById('user-1').srcObject = localStream

    createOffer()
}

let createOffer = async () => {
    peerConnection = new RTCPeerConnection(servers)

    remoteStream = new MediaStream()
    document.getElementById('user-2').srcObject = remoteStream


    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream)
    })

    peerConnection.ontrack = (e) => {
        e.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track)
        })
    }

    peerConnection.onicecandidate = async (e) => {
        if(e.candidate) {
            console.log(" NEW ICE ", e.candidate)
        }
    }
    let offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    console.log("Offer: ", offer)
}
init()