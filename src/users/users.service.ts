import { Injectable } from "@nestjs/common"
import type { Model } from "mongoose"
import type { User, UserDocument } from "./user.schema"
import * as bcrypt from "bcryptjs"

@Injectable()
export class UsersService {
  private userModel: Model<UserDocument>

  constructor(userModel: Model<UserDocument>) {
    this.userModel = userModel
  }

  async create(userData: Partial<User>): Promise<User> {
    if (!userData.password) {
      throw new Error("Password is required")
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const user = new this.userModel({
      ...userData,
      password: hashedPassword,
    })
    return user.save()
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec()
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec()
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec()
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }
}
