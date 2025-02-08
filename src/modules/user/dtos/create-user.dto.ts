import { IsString, IsEmail, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ example: "John Doe" })
    @IsString()
    name: string;

    @ApiProperty({ example: "johndoe@example.com" })
    @IsEmail()
    email: string;

    @ApiProperty({ example: "securePassword123" })
    @IsString()
    @Length(6, 50)
    password: string;
}
