import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "your-secret-key", // Replace with your actual secret key
    })
  }

  async validate(payload: any) {
    return { userId: payload.sub, role: payload.role } // Ensure this matches your JWT payload structure
  }
}
