import { Module } from "@nestjs/common";
import { UserController } from "./user.controler";
import { UserService } from "./user.service";
import { UserRepository } from "./repositories/user.repository";
import { PrismaService } from "src/shared/database/prisma/prisma.service";

@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserService, UserRepository, PrismaService]
})
export class UserModule {} 