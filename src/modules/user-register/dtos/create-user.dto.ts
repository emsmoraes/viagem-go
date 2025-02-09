import { IsString, IsEmail, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ example: "johndoe@example.com" })
    @IsEmail()
    email: string;

    @ApiProperty({ example: "https://viagens-go.com" })
    @IsUrl()
    redirectUrl: string;
}
