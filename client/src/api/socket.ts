import { io, Socket } from 'socket.io-client'

class SocketApi {
    static socket: null | Socket = null

    static createConnection() {
        this.socket = io('http://localhost:8099/')

        this.socket.on('connect', () => {
            console.log('client connected')
        })

        this.socket.on('disconnect', (e) => {
            console.log('disconnect', e)
        })
    }
}

export default SocketApi
