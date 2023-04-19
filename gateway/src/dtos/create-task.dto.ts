import { IsEmpty, IsNotEmpty } from "class-validator"

export class CreateTaskDto{
    @IsEmpty()
    taskId: number

    @IsNotEmpty()
    userId: number

    @IsNotEmpty()
    title: string
    
    @IsNotEmpty()
    detail: string


}