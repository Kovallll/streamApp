'use client'

import { useEffect } from 'react'
import SocketApi from '@api/socket'

export const useConnectSocket = () => {
    const connectSocket = () => {
        SocketApi.createConnection()
    }

    useEffect(() => {
        connectSocket()
    }, [])
}
