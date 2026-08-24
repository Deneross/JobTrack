import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(configService: ConfigService) {
        const databaseUrl = configService.getOrThrow<string>('DATABASE_URL');

        const adapter = new PrismaPg({
            connectionString: databaseUrl,
        });

        super({ adapter });
    }
}