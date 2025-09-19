import { Injectable } from '@nestjs/common'
import { PrismaService } from './db/db.service'

@Injectable()
export class AppService {
    constructor(private readonly prisma: PrismaService) {}
    getHello() {
        this.prisma.user.findMany()
    }
}
