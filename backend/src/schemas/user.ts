import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  cardholderId: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, unique: true, index: true })
  wallet: string;

  @Prop({ required: false })
  nonce?: string;

  @Prop({ required: true })
  signature: string;

  @Prop({ required: false })
  score?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
