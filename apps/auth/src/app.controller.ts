import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ForgetPasswordDto,
  JwtAuthGuard,
  LoginDto,
  NewEmailDto,
  RefreshTokenDto,
  SignupDto,
  UpdatePasswordDto,
  UserParam,
} from '@shopifize/custom-nestjs';
import { Request, Response } from 'express';
import { Patch, Query, UseGuards } from '@nestjs/common/decorators';
import { generateResponse } from '@shopifize/helpers';
import { User } from '@shopifize/database';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  ping() {
    return this.appService.ping();
  }

  @Post('sign-up')
  async signup(@Body() data: SignupDto) {
    const result = await this.appService.signup(data);
    return generateResponse(result);
  }

  @Post('login')
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authToken = await this.appService.login(data);
    if (authToken) {
      response.cookie('access_token', authToken.accessToken);
    }
    return generateResponse(authToken);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('access_token', '', { expires: new Date(0) });

    return generateResponse(null, true);
  }

  @Post('refresh-token')
  async refreshToken(
    @Body() { refreshToken }: RefreshTokenDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const accessToken = request.cookies['access_token'];
    const authToken = await this.appService.refreshToken({
      accessToken,
      refreshToken,
    });
    if (authToken) {
      response.cookie('access_token', authToken.accessToken);
    }
    return generateResponse(authToken, true);
  }

  @Post('forget-password')
  async forgetPassword(@Body() { email }: ForgetPasswordDto) {
    await this.appService.forgetPassword(email);
    return generateResponse(null, true);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@UserParam() user: User) {
    await this.appService.forgetPassword(user.email);
    return generateResponse(null, true);
  }

  @Patch('reset-password')
  async resetPassword(@Body() { token, password }: UpdatePasswordDto) {
    await this.appService.resetPassword(token, password);
    return generateResponse(null, true);
  }

  @UseGuards(JwtAuthGuard)
  @Post('request-otp-email')
  async sendEmailResetOTP(@UserParam() user: User) {
    await this.appService.sendOTP(user.email, 'Change Email');
    return generateResponse(null, true);
  }

  @UseGuards(JwtAuthGuard)
  @Post('request-opt-new-email')
  async requestOtpNewEmail(@Body() { newEmail }: NewEmailDto) {
    await this.appService.sendOTP(newEmail, 'Verify new email');
    return generateResponse(null, true);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check-otp-email')
  async checkEmailResetOTP(
    @UserParam() user: User,
    @Query() query: { otp: string; email: string },
  ) {
    let result: boolean;
    if (query.email) {
      result = await this.appService.checkOTPAndEditEmail(
        user.email,
        query.email,
        query.otp,
      );
    } else {
      result = this.appService.checkIfOTPcorrect(user.email, query.otp);
    }
    if (!result) {
      return generateResponse(result, false, 'OTP wrong');
    }
    return generateResponse(result, true);
  }
}
