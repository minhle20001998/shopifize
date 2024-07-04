import {
  Body,
  Controller,
  Get,
  Inject,
  OnApplicationBootstrap,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto, JwtAuthGuard, Roles } from '@shopifize/custom-nestjs';
import { UserRole } from '@shopifize/database';
import { CREATE_USER_PATTERN, PING_PATTERN } from '@shopifize/helpers';
import { Observable } from 'rxjs';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('user')
export class UserController implements OnApplicationBootstrap {
  @Inject('USER_SERVICE') private readonly userClient: ClientProxy;

  async onApplicationBootstrap() {
    await this.userClient.connect();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('ping')
  ping(): Observable<string> {
    const result = this.userClient.send({ cmd: PING_PATTERN }, '');
    result.subscribe();
    return result;
  }

  @Post()
  createUser(@Body() user: CreateUserDto): Observable<string> {
    const result = this.userClient.send({ cmd: CREATE_USER_PATTERN }, user);
    return result;
  }
}
