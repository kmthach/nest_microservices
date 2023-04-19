import { Prop } from '@nestjs/mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose/dist';
import { HydratedDocument } from 'mongoose';

export type UserHashPasswordDocument = HydratedDocument<UserHashPassword>;
@Schema()
export class UserHashPassword{
    @Prop()
    username: string

    @Prop()
    password: string

}

export const UserHashPasswordSchema = SchemaFactory.createForClass(UserHashPassword);