import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose" // Import InjectModel
import type { Model } from "mongoose"
import type { User, UserDocument } from "./user.schema"
import { UserRole } from "./user.schema"
import * as bcrypt from "bcryptjs"

@Injectable()
export class UsersService {
  constructor(
    @InjectModel("User") private readonly userModel: Model<UserDocument>, // Use InjectModel to inject the User model
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    if (!userData.password) {
      throw new BadRequestException("Password is required")
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

  async findAll(requesterId: string, requesterRole: UserRole): Promise<User[]> {
    try {
      console.log("findAll called with:", { requesterId, requesterRole })

      // Only admins can view all users
      if (requesterRole !== UserRole.ADMIN) {
        console.error("Access denied: Only administrators can view user list")
        throw new ForbiddenException("Only administrators can view user list")
      }

      const users = await this.userModel
        .find({}, { password: 0 }) // Exclude password field
        .sort({ createdAt: -1 })
        .exec()

      console.log("Users fetched successfully:", users)
      return users
    } catch (error) {
      console.error("Error in findAll:", error.stack)
      throw new Error(`Failed to fetch users: ${error.message}`)
    }
  }

  async findByIdForAdmin(id: string, requesterId: string, requesterRole: UserRole): Promise<User> {
    // Only admins can view user details
    if (requesterRole !== UserRole.ADMIN) {
      throw new ForbiddenException("Only administrators can view user details")
    }

    const user = await this.userModel.findById(id, { password: 0 }).exec()
    if (!user) {
      throw new NotFoundException("User not found")
    }

    return user
  }

  async updateUserRole(userId: string, newRole: UserRole, requesterId: string, requesterRole: UserRole): Promise<User> {
    // Only admins can update user roles
    if (requesterRole !== UserRole.ADMIN) {
      throw new ForbiddenException("Only administrators can update user roles")
    }

    // Prevent admin from changing their own role
    if (userId === requesterId) {
      throw new BadRequestException("You cannot change your own role")
    }

    const user = await this.userModel.findById(userId)
    if (!user) {
      throw new NotFoundException("User not found")
    }

    // Prevent changing role of other admins (optional security measure)
    if (user.role === UserRole.ADMIN && userId !== requesterId) {
      throw new BadRequestException("Cannot change role of another administrator")
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, { role: newRole }, { new: true, select: { password: 0 } })
      .exec()

    if (!updatedUser) {
      throw new NotFoundException("User not found")
    }

    return updatedUser
  }

  async toggleUserStatus(userId: string, requesterId: string, requesterRole: UserRole): Promise<User> {
    // Only admins can toggle user status
    if (requesterRole !== UserRole.ADMIN) {
      throw new ForbiddenException("Only administrators can toggle user status")
    }

    // Prevent admin from deactivating themselves
    if (userId === requesterId) {
      throw new BadRequestException("You cannot deactivate your own account")
    }

    const user = await this.userModel.findById(userId)
    if (!user) {
      throw new NotFoundException("User not found")
    }

    // Prevent deactivating other admins
    if (user.role === UserRole.ADMIN) {
      throw new BadRequestException("Cannot deactivate administrator accounts")
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, { isActive: !user.isActive }, { new: true, select: { password: 0 } })
      .exec()

    if (!updatedUser) {
      throw new NotFoundException("User not found")
    }

    return updatedUser
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  async getUserStats(): Promise<any> {
    const totalUsers = await this.userModel.countDocuments()
    const activeUsers = await this.userModel.countDocuments({ isActive: true })
    const adminCount = await this.userModel.countDocuments({ role: UserRole.ADMIN })
    const editorCount = await this.userModel.countDocuments({ role: UserRole.EDITOR })
    const userCount = await this.userModel.countDocuments({ role: UserRole.USER })

    return {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
      roles: {
        admin: adminCount,
        editor: editorCount,
        user: userCount,
      },
    }
  }
}
