
import { Schema } from '@nestjs/mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose/dist';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/enums/role.enum';

export type UserRoleDocument = HydratedDocument<UserRole>;
@Schema()
export class UserRole {

    @Prop()
    username: string

    @Prop()
    role: Role

}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);