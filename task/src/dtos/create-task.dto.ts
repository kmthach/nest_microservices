import { IsEmpty, IsNotEmpty } from "class-validator"
export class CreateTaskDto{
    @IsEmpty()
    userId: number

    @IsEmpty()
    taskId: number 

    @IsNotEmpty()
    title: string
    
    @IsNotEmpty()
    detail: string

}