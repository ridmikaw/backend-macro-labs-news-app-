import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { UsersService } from "./users.service"
import { User, UserSchema } from "./user.schema"
import { UsersController } from "./users.controller"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]), // Ensure the User model is registered
  ],
  providers: [
    UsersService, // Ensure UsersService is provided
  ],
  controllers: [
    UsersController, // Ensure UsersController is included
  ],
  exports: [
    UsersService, // Export UsersService if used in other modules
  ],
})
export class UsersModule {}
