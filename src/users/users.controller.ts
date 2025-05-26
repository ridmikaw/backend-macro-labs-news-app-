import { Controller, Get, Put, Param, Body, UseGuards, ValidationPipe, BadRequestException, Req } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { UsersService } from "./users.service"
import { UserRole } from "./user.schema"
import { IsEnum } from "class-validator"

class UpdateUserRoleDto {
  @IsEnum(UserRole)
  role: UserRole
}

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard("jwt"))
  async findAll(@Req() req) {
    try {
      console.log("findAll endpoint called with req.user:", req.user)

      if (!req.user || !req.user.userId || !req.user.role) {
        console.error("Invalid user object in request")
        throw new BadRequestException("Invalid user object in request")
      }

      return this.usersService.findAll(req.user.userId, req.user.role)
    } catch (error) {
      console.error("Error in findAll endpoint:", error.stack)
      throw error
    }
  }

  @Get(":id")
  @UseGuards(AuthGuard("jwt"))
  async findOne(@Param('id') id: string, req) {
    return this.usersService.findByIdForAdmin(id, req.user.userId, req.user.role)
  }

  @Put(":id/role")
  @UseGuards(AuthGuard("jwt"))
  async updateRole(@Param('id') id: string, @Body(ValidationPipe) updateRoleDto: UpdateUserRoleDto, req) {
    return this.usersService.updateUserRole(id, updateRoleDto.role, req.user.userId, req.user.role)
  }

  @Put(":id/status")
  @UseGuards(AuthGuard("jwt"))
  async toggleStatus(@Param('id') id: string, req) {
    return this.usersService.toggleUserStatus(id, req.user.userId, req.user.role)
  }
}
