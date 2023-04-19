import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserTokenDocument = HydratedDocument<UserToken>;
@Schema()
export class UserToken {

    @Prop()
    username: string

    @Prop()
    token: string

    @Prop()
    expireDate: string

}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);