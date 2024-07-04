import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import {
  CREATE_USER_PATTERN,
  GET_USER_PATTERN,
  PING_PATTERN,
  ResponseType,
  UPDATE_USER_PATTERN,
  UpdateQueryType,
  generateResponse,
} from '@shopifize/helpers';
import {
  CreateUserDto,
  JwtAuthGuard,
  Pagination,
  PaginationDto,
  RoleDto,
  Roles,
  RolesGuard,
  UpdateUserProfileDto,
  UserParam,
} from '@shopifize/custom-nestjs';
import { User, UserRole } from '@shopifize/database';

const PaginationGetUsers = Pagination<null>();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // tcp

  @MessagePattern({ cmd: PING_PATTERN })
  ping() {
    return this.appService.ping();
  }

  @MessagePattern({ cmd: GET_USER_PATTERN })
  async getUser(email: string): Promise<ResponseType<User>> {
    try {
      const result = await this.appService.getUserByEmail(email);
      return generateResponse(result, true);
    } catch (e) {
      return generateResponse(null, false, e.message);
    }
  }

  @MessagePattern({ cmd: CREATE_USER_PATTERN })
  async createUser(user: CreateUserDto): Promise<ResponseType<null>> {
    try {
      const result = await this.appService.createUser(user);
      return generateResponse(result, true);
    } catch (e) {
      return generateResponse(null, false, e.message);
    }
  }

  @MessagePattern({ cmd: UPDATE_USER_PATTERN })
  async updateUser(query: UpdateQueryType<User>) {
    try {
      const result = await this.appService.updateUser(query);
      return generateResponse(result);
    } catch (e) {
      return generateResponse(null, false, e.message);
    }
  }

  // http
  @Get('ping')
  pingHttp() {
    return this.appService.ping();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('users')
  async getUsers(@PaginationGetUsers() pagination: PaginationDto<null>) {
    const result = await this.appService.getUsers(pagination);
    return generateResponse(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getUserSelfProfile(@UserParam() user: User) {
    const result = await this.appService.getUserProfile(user.id);
    return generateResponse(result);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('user/:id')
  async getUserById(@Param() params: { id: string }) {
    const result = await this.appService.getUserById(params.id);
    return generateResponse(result);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  updateUserProfile(
    @UserParam() user: User,
    @Body() profile: UpdateUserProfileDto,
  ) {
    this.appService.updateUserProfile(user, profile);
    return generateResponse(null);
  }

  @Get('roles')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getRoles() {
    const roles = this.appService.getRoles();
    return generateResponse(roles);
  }

  @Put('role/:id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateRole(@Param() params: { id: string }, @Body() role: RoleDto) {
    await this.appService.updateRole(params.id, role);
    return generateResponse(null);
  }
}
