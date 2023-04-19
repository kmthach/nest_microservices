import { IsEmpty, IsNotEmpty } from 'class-validator';
export class RegisterRequestDto {

    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    password: string
}