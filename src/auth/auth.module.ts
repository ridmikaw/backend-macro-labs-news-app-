import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { UsersModule } from "../users/users.module"
import { JwtStrategy } from "./jwt.strategy"
import { ValidateCaptchaService } from "../captcha/validate-captcha.service" // Import ValidateCaptchaService

@Module({
  imports: [
    UsersModule, // Import UsersModule to provide UsersService
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-secret-key",
      signOptions: { expiresIn: "24h" },
    }),
  ],
  providers: [
    AuthService, // Ensure AuthService is provided
    JwtStrategy, // Ensure JwtStrategy is provided
    ValidateCaptchaService, // Provide ValidateCaptchaService
  ],
  controllers: [
    AuthController, // Ensure AuthController is registered
  ],
  exports: [
    AuthService, // Export AuthService for use in other modules
  ],
})
export class AuthModule {}
