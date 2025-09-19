'use client'

import SocketApi from '@api/socket'
import { useConnectSocket } from '@hooks'
import { useEffect, useRef, useState } from 'react'

const streamKey = 'myStreamKey'

const CameraWithRecording = () => {
    useConnectSocket()
    const videoRef = useRef<HTMLVideoElement>(null)
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
        null
    )
    const [isStreaming, setIsStreaming] = useState(false)
    const socket = SocketApi.socket
    useEffect(() => {
        const initCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                })
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                    videoRef.current.play()
                }

                const recorder = new MediaRecorder(stream, {
                    mimeType: 'video/webm; codecs=vp8',
                })
                setMediaRecorder(recorder)
            } catch (error) {
                console.error('Ошибка доступа к камере:', error)
            }
        }

        initCamera()

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (
                    videoRef.current.srcObject as MediaStream
                ).getTracks()
                tracks.forEach((track) => track.stop())
            }
            if (socket) {
                socket.disconnect()
            }
        }
    }, [])

    async function startStreaming() {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        })

        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm',
        })

        socket?.emit('startStream', streamKey)

        mediaRecorder.ondataavailable = (event) => {
            console.log('🚀 ~ startStreaming ~ event:', event)

            if (event.data.size > 0) {
                socket?.emit('stream', event.data)
            }
        }
        setIsStreaming(true)
        mediaRecorder.start(100)
    }

    const stopStreaming = () => {
        if (mediaRecorder) {
            mediaRecorder.stop()
            socket?.disconnect()
            setIsStreaming(false)
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
            <h1>Трансляция с камеры</h1>
            <video
                ref={videoRef}
                autoPlay
                muted
                style={{ width: '50%' }}
            ></video>
            <div>
                {!isStreaming ? (
                    <button onClick={startStreaming}>Начать трансляцию</button>
                ) : (
                    <button onClick={stopStreaming}>
                        Остановить трансляцию
                    </button>
                )}
            </div>
            <video id="videoPlayer" controls autoPlay width="640" height="360">
                <source
                    src="http://localhost:8080/hls/myStreamKey.m3u8"
                    type="application/vnd.apple.mpegurl"
                />
                Ваш браузер не поддерживает HLS.
            </video>
        </div>
    )
}

export default CameraWithRecording
