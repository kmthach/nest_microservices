import { IsEmpty, IsNotEmpty } from "class-validator"

export class GetTaskDto{
    taskId: number
    title: string
    detail: string
}

