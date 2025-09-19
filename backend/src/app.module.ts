import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaService } from './db/db.service'
import { StreamService } from './stream/stream.service'

@Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService, PrismaService, StreamService],
})
export class AppModule {}
