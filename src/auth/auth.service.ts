import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { UsersService } from "../users/users.service"
import { User, UserRole } from "../users/user.schema"

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService, // Ensure UsersService is injected
    private readonly jwtService: JwtService, // Ensure JwtService is injected
  ) {}

  async register(username: string, email: string, password: string, role: UserRole) {
    const existingUser = await this.usersService.findByEmail(email)
    if (existingUser) {
      throw new ConflictException("User with this email already exists")
    }

    const existingUsername = await this.usersService.findByUsername(username)
    if (existingUsername) {
      throw new ConflictException("Username already taken")
    }

    const user = await this.usersService.create({ username, email, password, role }) as any // Ensure `_id` is accessible
    const payload = { sub: user._id, username: user.username, role: user.role }

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    }
  }

  async login(identifier: string, password: string) {
    const user =
      (await this.usersService.findByEmail(identifier)) || (await this.usersService.findByUsername(identifier))

    if (!user || !(await this.usersService.validatePassword(password, user.password))) {
      throw new UnauthorizedException("Invalid credentials")
    }

    const payload = { sub: (user as any)._id, username: user.username, role: user.role } // Ensure `_id` is accessible

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: (user as any)._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email)
    if (user && (await this.usersService.validatePassword(password, user.password))) {
      return user
    }
    return null
  }
}
