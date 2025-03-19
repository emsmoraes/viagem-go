import { Module } from "@nestjs/common";
import { UserRegisterController } from "./user-register.controller";
import { UserService } from "./user-register.service";
import { UserRegisterRepository } from "./repositories/user-register.repository";
import { PrismaService } from "src/shared/database/prisma/prisma.service";
import { UserKeyRepository } from "../key/repositories/key.repository";
import { AgencyRepository } from "../user-agency/repositories/user-agency.repository";
import { CleanInactiveUsersJob } from './jobs/clean-expired-users.job';
import { UserRoleRepository } from "../user-role/repositories/user-role.repository";

@Module({
    imports: [],
    controllers: [UserRegisterController],
    providers: [UserService, UserRegisterRepository, UserRoleRepository, PrismaService, UserKeyRepository, AgencyRepository, PrismaService, CleanInactiveUsersJob]
})
export class UserRegisterModule {} 