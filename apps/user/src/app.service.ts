import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  ROLE_REPOSITORY,
  CreateUserDto,
  UpdateUserProfileDto,
  PROFILE_REPOSITORY,
  RoleDto,
  PaginationDto,
} from '@shopifize/custom-nestjs';
import { Repository, User, Role, UserRole, Profile } from '@shopifize/database';
import {
  EMAIL_DUPLICATED,
  generateRandomString,
  hideEmail,
  ShopifizedError,
  UpdateQueryType,
} from '@shopifize/helpers';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AppService {
  private saltRounds: number;

  constructor(
    @Inject(USER_REPOSITORY)
    private UserDatabase: Repository<User>,
    @Inject(PROFILE_REPOSITORY)
    private ProfileDatabase: Repository<Profile>,
    @Inject(ROLE_REPOSITORY)
    private RoleDatabase: Repository<Role>,
  ) {
    this.saltRounds = 10;
  }

  ping(): string {
    return 'pong user';
  }

  async createUser(data: CreateUserDto): Promise<null> {
    try {
      const { password, email } = data;
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);

      const userInstance = this.UserDatabase.create({
        email,
        password: hashedPassword,
        signed: generateRandomString(8),
      });
      await this.UserDatabase.save(userInstance);

      const roleInstance = this.RoleDatabase.create({
        role: UserRole.CUSTOMER,
      });
      roleInstance.user = userInstance;
      await this.RoleDatabase.save(roleInstance);

      return null;
    } catch (e) {
      if (e.code === '23505') {
        throw Error(EMAIL_DUPLICATED);
      }
      throw e;
    }
  }

  async getUsers(pagination: PaginationDto<null>) {
    const [users, count] = await this.UserDatabase.findAndCount({
      relations: { roles: true },
      select: { email: true, id: true, roles: true },
      take: pagination.limit,
      skip: pagination.skip,
    });

    return {
      data: users,
      total: count,
      skip: pagination.skip,
      limit: pagination.limit,
    };
  }

  async getUserByEmail(email: string): Promise<User> {
    //find user from database
    const user = await this.UserDatabase.findOne({ where: { email: email } });
    // if user not exist
    if (!user) {
      return null;
    }

    return user;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.UserDatabase.findOne({
      where: { id: id },
      relations: { roles: true },
    });
    // if user not exist
    if (!user) {
      return null;
    }

    return user;
  }

  async getUserProfile(
    id: string,
  ): Promise<Profile & { email: User['email'] }> {
    const profile = await this.ProfileDatabase.findOne({
      where: { user: { id: id } },
      relations: { user: true },
    });
    // if user not exist
    if (!profile) {
      return null;
    }
    const email = profile.user.email;
    delete profile.user;
    return { ...profile, email: hideEmail(email) };
  }

  async updateUser(query: UpdateQueryType<User>): Promise<null> {
    const user = await this.UserDatabase.findOne({ where: query.where });
    if (user) {
      if (query.update.password) {
        query.update.password = await bcrypt.hash(
          query.update.password,
          this.saltRounds,
        );
        query.update.signed = generateRandomString(8);
      }
      this.UserDatabase.save({
        ...user,
        ...query.update,
      });
      return null;
    }
    throw Error('User not found');
  }

  async updateUserProfile(
    user: User,
    profile: UpdateUserProfileDto,
  ): Promise<void> {
    const foundUser = await this.UserDatabase.findOne({
      where: { id: user.id },
      relations: { profile: true },
    });

    if (!foundUser) {
      throw new ShopifizedError('User not found');
    }

    const create = async () => {
      const profileInstance = this.ProfileDatabase.create({
        ...profile,
        profilePicture: '',
      });

      await this.ProfileDatabase.save(profileInstance);

      await this.UserDatabase.save({
        ...foundUser,
        profile: profileInstance,
      });
    };
    const update = async (profileId: string) => {
      const foundProfile = await this.ProfileDatabase.findOne({
        where: { id: profileId },
      });

      await this.ProfileDatabase.save({ ...foundProfile, ...profile });
    };
    if (foundUser.profile) {
      update(foundUser.profile.id);
    } else {
      create();
    }
  }

  async updateRole(userId: string, roleDto: RoleDto) {
    const foundUser = await this.UserDatabase.findOne({
      where: { id: userId },
      relations: { roles: true },
    });
    //Remove Roles
    await this.RoleDatabase.createQueryBuilder()
      .delete()
      .from(Role)
      .where('userId= :id', { id: userId })
      .execute();

    // const roleInstance = this.RoleDatabase.create({
    //   role: UserRole.ADMIN,
    //   user: foundUser,
    // });
    const roleInstances = roleDto.role.map((role) => {
      return this.RoleDatabase.create({
        role,
        user: foundUser,
      });
    });
    await this.RoleDatabase.save(roleInstances);
  }

  getRoles() {
    return Object.values(UserRole);
  }
}
