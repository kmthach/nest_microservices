import { IsEmpty, IsNotEmpty } from 'class-validator';
export class RegisterRequestDto {
    @IsEmpty()
    id: number

    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    password: string
}