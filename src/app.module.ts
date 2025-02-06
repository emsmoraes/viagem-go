import { Module } from '@nestjs/common';
import { ConfigModule, ConfigModule as ConfigModuleNest } from "@nestjs/config"
import { EnvModule } from './modules/env/env.module';
import { envSchema } from './modules/env/env';
import { PrismaModule } from './shared/database/prisma.module';

@Module({
    imports: [
        ConfigModuleNest.forRoot({
            validate: (env) => envSchema.parse(env),
            isGlobal: true,
        }),
        EnvModule,
        PrismaModule,
        ConfigModule.forRoot({ isGlobal: true }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
