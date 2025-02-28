import { IsString, IsEmail, IsUrl, IsOptional, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ example: "johndoe@example.com" })
    @IsEmail()
    email: string;

    @ApiProperty({ example: "https://viagens-go.com" })
    @IsUrl()
    redirectUrl: string;

    @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000", required: false })
    @IsOptional()
    @IsUUID()
    agencyId?: string;
}
