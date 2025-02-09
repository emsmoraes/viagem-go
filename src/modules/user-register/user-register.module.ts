import { Module } from "@nestjs/common";
import { UserRegisterController } from "./user-register.controller";
import { UserService } from "./user-register.service";
import { UserRegisterRepository } from "./repositories/user-register.repository";
import { PrismaService } from "src/shared/database/prisma/prisma.service";

@Module({
    imports: [],
    controllers: [UserRegisterController],
    providers: [UserService, UserRegisterRepository, PrismaService]
})
export class UserRegisterModule {} 