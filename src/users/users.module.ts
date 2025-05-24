import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { UsersService } from "./users.service"
import { User, UserSchema } from "./user.schema"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Ensure User model is imported
  ],
  providers: [
    UsersService, // Ensure UsersService is provided
  ],
  exports: [
    UsersService, // Export UsersService if used in other modules
  ],
})
export class UsersModule {}
