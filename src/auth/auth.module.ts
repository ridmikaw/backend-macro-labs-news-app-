import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { UsersModule } from "../users/users.module"
import { JwtStrategy } from "./jwt.strategy"
import { ValidateCaptchaService } from "../captcha/validate-captcha.service" 

@Module({
  imports: [
    UsersModule, 
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-secret-key", 
      signOptions: { expiresIn: "1h" },
    }),
  ],
  providers: [
    AuthService, 
    JwtStrategy, 
    ValidateCaptchaService, 
  ],
  controllers: [
    AuthController, 
  ],
  exports: [
    AuthService, 
    PassportModule, 
    JwtModule,
  ],
})
export class AuthModule {}
