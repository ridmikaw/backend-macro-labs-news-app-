import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type UserDocument = User & Document

export enum UserRole {
  ADMIN = "admin",
  EDITOR = "editor",
  USER = "user",
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ enum: UserRole, default: UserRole.USER })
  role: UserRole

  @Prop({ default: true })
  isActive: boolean

  @Prop({ required: false })
  captchaToken?: string
}

export const UserSchema = SchemaFactory.createForClass(User)
