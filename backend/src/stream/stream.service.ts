import {
    WebSocketGateway,
    SubscribeMessage,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { spawn, ChildProcessWithoutNullStreams } from 'child_process'

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class StreamService implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    private ffmpegProcesses: Map<string, ChildProcessWithoutNullStreams> =
        new Map()

    handleConnection(client: Socket) {
        console.log(`Клиент подключен: ${client.id}`)
    }

    @SubscribeMessage('startStream')
    startStream(client: Socket, streamKey: string) {
        if (this.ffmpegProcesses.has(client.id)) {
            console.log(`Стрим для клиента ${client.id} уже запущен.`)
            return
        }

        console.log(
            `Запуск стрима для клиента ${client.id} с ключом: ${streamKey}`
        )

        const ffmpeg = spawn('ffmpeg', [
            '-i',
            'pipe:0',
            '-c:v',
            'libx264',
            '-preset',
            'veryfast',
            '-tune',
            'zerolatency',
            '-c:a',
            'aac',
            '-f',
            'flv',
            `rtmp://nginx-rtmp:1935/stream/${streamKey}`,
        ])

        ffmpeg.stderr.on('data', (data: Buffer) => {
            console.error(
                `FFmpeg Error (Client ${client.id}): ${data.toString()}`
            )
        })

        ffmpeg.on('close', (code: number) => {
            console.log(
                `FFmpeg завершил работу для клиента ${client.id} с кодом: ${code}`
            )
            this.ffmpegProcesses.delete(client.id)
        })

        this.ffmpegProcesses.set(client.id, ffmpeg)
    }

    @SubscribeMessage('stream')
    handleStreamData(client: Socket, data: Buffer) {
        console.log(
            `Получены данные от клиента ${client.id}: ${data.length} байт`
        )
        const ffmpeg = this.ffmpegProcesses.get(client.id)
        if (ffmpeg) {
            ffmpeg.stdin.write(data)
        } else {
            console.error(`FFmpeg не запущен для клиента ${client.id}`)
        }
    }

    handleDisconnect(client: Socket) {
        console.log(`Клиент отключен: ${client.id}`)
        const ffmpeg = this.ffmpegProcesses.get(client.id)

        if (ffmpeg) {
            ffmpeg.stdin.end()
            ffmpeg.kill('SIGINT')
            this.ffmpegProcesses.delete(client.id)
            console.log(`FFmpeg процесс для клиента ${client.id} завершен.`)
        }
    }
}
