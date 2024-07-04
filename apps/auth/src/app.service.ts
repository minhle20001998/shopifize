import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import {
  JwtPayloadType,
  JwtService,
  LoginDto,
  SignupDto,
  MailService,
  getMessage,
  USER_REPOSITORY,
} from '@shopifize/custom-nestjs';
import { Repository, User } from '@shopifize/database';
import {
  CREATE_USER_PATTERN,
  EMAIL_DUPLICATED,
  generateOTP,
  generateUpdateQuery,
  GET_USER_PATTERN,
  LOGIN_FAILED,
  ShopifizedError,
  UPDATE_USER_PATTERN,
} from '@shopifize/helpers';
import * as bcrypt from 'bcrypt';
import { ClientProxy } from '@nestjs/microservices';
import { TokenType } from './helpers';
import { randomUUID } from 'crypto';
@Injectable()
export class AppService implements OnApplicationBootstrap {
  @Inject('USER_SERVICE') private readonly userClient: ClientProxy;
  private refreshTokenSign: typeof this.jwtService.sign;
  private refreshTokenVerify: typeof this.jwtService.verify;
  // TODO: use redis instead
  private resetPasswordStore: Map<string, string>;
  private otpStore: Map<string, string>;
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    @Inject(USER_REPOSITORY)
    private UserDatabase: Repository<User>,
  ) {
    this.refreshTokenSign = (payload) => {
      return this.jwtService.sign(payload, {
        expiresIn: '7d',
        secret: process.env.REFRESH_JWT_SECRET,
      });
    };

    this.refreshTokenVerify = (token) => {
      return this.jwtService.verify(token, {
        secret: process.env.REFRESH_JWT_SECRET,
      });
    };

    this.resetPasswordStore = new Map();
    this.otpStore = new Map();
  }

  async onApplicationBootstrap() {
    try {
      await this.userClient.connect();
    } catch (e) {
      console.log(e);
    }
  }

  ping(): string {
    return 'pong auth';
  }

  async signup(data: SignupDto): Promise<null> {
    const result = await getMessage<null>(
      this.userClient.send({ cmd: CREATE_USER_PATTERN }, data),
    );

    if (result.error) {
      throw new ShopifizedError(result.error.message);
    }

    return result.data;
  }

  async login(data: LoginDto): Promise<TokenType> {
    //find user from database
    const { data: user } = await getMessage<User>(
      this.userClient.send({ cmd: GET_USER_PATTERN }, data.email),
    );

    const { password } = data;

    // if user not exist
    if (!user) {
      throw new ShopifizedError(LOGIN_FAILED);
    }
    const userPassword = user.password;
    const isPasswordCorrect = await bcrypt.compare(password, userPassword);
    // if password matched
    if (isPasswordCorrect) {
      const payload: JwtPayloadType = {
        sub: user.id.toString(),
        username: user.profile?.username,
        signed: user.signed,
      };

      return {
        accessToken: this.jwtService.sign(payload),
        refreshToken: this.refreshTokenSign(payload),
      };
    }
    // if password is not matched
    else {
      throw new ShopifizedError(LOGIN_FAILED);
    }
  }

  async refreshToken(data: TokenType): Promise<TokenType> {
    try {
      const { refreshToken, accessToken } = data;

      // if access token not provided -> return error
      if (!accessToken) {
        throw new ShopifizedError('Invalid access token');
      }

      const refreshTokenPayload =
        this.refreshTokenVerify<JwtPayloadType>(refreshToken);

      const accessTokenPayload = this.jwtService.verify<JwtPayloadType>(
        accessToken,
        { ignoreExpiration: true },
      );

      const userIdFromRT = refreshTokenPayload.sub;
      const userIdFromAT = accessTokenPayload.sub;

      // compare userid from both rt and at, if not equal -> return error
      if (userIdFromRT !== userIdFromAT) {
        throw new ShopifizedError('Invalid access token');
      }

      const user = await this.UserDatabase.findOne({
        where: { id: userIdFromRT },
      });

      if (!user) {
        throw new ShopifizedError('No user found');
      }

      const isSameSigned = user.signed === accessTokenPayload.signed;

      // Check if refresh token has expired signed token
      if (!isSameSigned) {
        throw new ShopifizedError('Invalid access token');
      }

      // remove old iat and exp
      delete accessTokenPayload.iat;
      delete accessTokenPayload.exp;

      // sign new pair of keys for user
      return {
        accessToken: this.jwtService.sign(accessTokenPayload),
        refreshToken: this.refreshTokenSign(accessTokenPayload),
      };
    } catch (e) {
      throw new ShopifizedError(e.message);
    }
  }

  async forgetPassword(email: string): Promise<void> {
    if (this.checkIfEmailExistInStore(email)) {
      return;
    }
    const token = randomUUID();
    const isEmailExist = await getMessage<User>(
      this.userClient.send({ cmd: GET_USER_PATTERN }, email),
    );
    if (isEmailExist) {
      // TODO: redis to handle this
      this.resetPasswordStore.set(token, email);
      this.mailService.sendPasswordReset(email, token);
    }
    return;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // TODO: redis to handle this
    const email = this.resetPasswordStore.get(token);
    if (email) {
      const result = await getMessage<User>(
        this.userClient.send(
          { cmd: UPDATE_USER_PATTERN },
          generateUpdateQuery<User>(
            { email: email },
            { password: newPassword },
          ),
        ),
      );

      if (result.error) {
        throw new ShopifizedError(result.error.message);
      }

      this.resetPasswordStore.delete(token);
      return;
    } else {
      throw new ShopifizedError('Reset password token is expired');
    }
  }

  // TODO: redis to handle this
  async sendOTP(email: string, purpose: string): Promise<void> {
    if (this.otpStore.has(email)) {
      return;
    }
    const otp = generateOTP();
    this.otpStore.set(email, otp.toString());
    this.mailService.sendOTP(email, otp.toString(), purpose);
    return;
  }

  checkIfOTPcorrect(email: string, otp: string) {
    const otpInStore = this.otpStore.get(email);
    if (!otpInStore) {
      throw new ShopifizedError('OTP is wrong 1 ');
    }
    if (otpInStore !== otp) {
      this.otpStore.delete(email);
      return false;
    }

    return true;
  }
  async checkOTPAndEditEmail(email: string, newEmail: string, otp: string) {
    const isOtpRight = this.checkIfOTPcorrect(newEmail, otp);
    if (isOtpRight) {
      const user = await this.UserDatabase.findOne({ where: { email: email } });
      const isNewEmailExist = !!(await this.UserDatabase.findOne({
        where: { email: newEmail },
      }));

      if (isNewEmailExist) {
        throw new ShopifizedError(EMAIL_DUPLICATED);
      } else {
        user.email = newEmail;
        await this.UserDatabase.save(user);
      }
      return true;
    } else {
      throw new ShopifizedError('OTP is wrong 2 ');
    }
  }

  checkIfEmailExistInStore(email: string) {
    return Array.from(this.resetPasswordStore.values()).includes(email);
  }
}
