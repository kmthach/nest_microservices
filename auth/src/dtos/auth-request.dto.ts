import { IsNotEmpty } from "class-validator";


export class AuthByTokenRequestDto {

    @IsNotEmpty()
    token: string

}