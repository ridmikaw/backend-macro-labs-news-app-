import { Controller, Post, Body, ValidationPipe } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { ValidateCaptchaService } from '../captcha/validate-captcha.service';
import { IsEmail, IsString, MinLength, IsIn } from "class-validator"
import { UserRole } from "../users/user.schema"; // Import UserRole enum

class RegisterDto {
  @IsString()
  @MinLength(3)
  username: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string

}

class LoginDto {
  @IsString()
  identifier: string // email or username

  @IsString()
  password: string
}

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly validateCaptchaService: ValidateCaptchaService, 
  ) {}

  @Post('register')
  async register(@Body(ValidationPipe) registerDto: RegisterDto, @Body('captchaToken') captchaToken: string) {
    await this.validateCaptchaService.validate(captchaToken); 
    return this.authService.register(
      registerDto.username,
      registerDto.email,
      registerDto.password,
      UserRole.USER, // Default role for new users is USER. Admin can change this later in admin panel
    );
  }

  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto, @Body('captchaToken') captchaToken: string) {
    await this.validateCaptchaService.validate(captchaToken); // Validate Captcha
    return this.authService.login(loginDto.identifier, loginDto.password);
  }
}
