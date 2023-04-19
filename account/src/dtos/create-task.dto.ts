import { IsEmpty, IsNotEmpty } from "class-validator"

export class CreateUserTaskDto{

    @IsNotEmpty()
    userId: number

    @IsNotEmpty()
    taskId: number

}