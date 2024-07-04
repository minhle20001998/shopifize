import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Repository, User } from '@shopifize/database';
import { USER_REPOSITORY } from 'src/entities';
import { isNil } from '@shopifize/helpers';

export type JwtPayloadType = {
  sub: string;
  username: string;
  [key: string]: unknown;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayloadType) {
    const userId = payload.sub;
    const signedToken = payload.signed;
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { roles: true, profile: true },
    });
    if (isNil(user) || signedToken !== user.signed) {
      return false;
    }
    return user;
  }
}
