import React, { useEffect, useRef } from 'react'
import { io } from "socket.io-client";

// const URI = ''
const URI = 'http://localhost:8080'

const socket = io(URI, {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

const configuration = {'iceServers' : [{'urls': 'stun:stun.l.google.com:19302'}]}


export default function Room() {
  const videoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const candidates = useRef([])

  const pc = useRef(new RTCPeerConnection(configuration))

  useEffect(() => {
    const peerConnection = new RTCPeerConnection(configuration);

    peerConnection.onicecandidate = e => {
      if (e.candidate)
        socket.emit('candidate', e.candidate)
    };
    
    peerConnection.oniceconnectionstatechange = e => {
      console.log('state changed', e);
    };

    peerConnection.ontrack = e => {
      console.log('trackes', e.streams);
      remoteVideoRef.current.srcObject = e.streams[0]
      remoteVideoRef.current.play()
    }

    pc.current = peerConnection
  }, [])
  
  const createOffer = () => {
    pc.current.createOffer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    }).then(sdp => {
      pc.current.setLocalDescription(sdp)
      socket.emit('offer', sdp)
    }).catch(e => console.log('error while creating offer', e))
  }

  const createAnswer = () => {
    pc.current.createAnswer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    }).then(sdp => {
      pc.current.setLocalDescription(sdp)
      socket.emit('answer', sdp);
    }).catch(e => console.log('error while creating offer', e))
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.on('newUser', id =>{
      console.log('new user connected', id);
    })

    socket.on('offer', sdp => {
      pc.current.setRemoteDescription(new RTCSessionDescription(sdp));
    })

    socket.on('answer', sdp => {
      pc.current.setRemoteDescription(new RTCSessionDescription(sdp));
    })

    socket.on('candidate', candidate => {
      candidates.current = [...candidates.current, candidate]
      pc.current.addIceCandidate(candidate);
    })
  }, [socket])


  useEffect(() => {
    console.log('nav');
    navigator.mediaDevices.getUserMedia({ video : { width : 300}, audio: true}).then(stream => {
      let video = videoRef.current;
      console.log(video);
      video.srcObject = stream;
      video.play();
      video.muted = true

      stream.getTracks().forEach(track => {
        pc.current.addTrack(track, stream)
      })
    }).catch(err => console.log('error', err))
  }, [videoRef, remoteVideoRef])

  return (
    <div className='w-screen h-screen'>
      <div className='w-full flex justify-between'>
        <video className='bg-slate-500' width={300} ref={videoRef} />
        <video className='bg-slate-500' width={300} ref={remoteVideoRef} />
      </div>
      <button onClick={createOffer}>call</button>
      <button onClick={createAnswer}>answer</button>
    </div>
  )
}