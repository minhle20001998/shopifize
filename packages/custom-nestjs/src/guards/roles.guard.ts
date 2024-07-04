import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@shopifize/database';
import { User, isEmpty, isNil } from '@shopifize/helpers';
import { ROLES_KEY } from 'src/decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(
      ROLES_KEY,
      context.getHandler(),
    ) as UserRole[];

    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    if (isEmpty(roles) || isNil(roles)) {
      return true;
    }

    const isHasRole = this.checkRoles(
      roles,
      user.roles.map((role) => role.role),
    );

    return isHasRole;
  }

  checkRoles(roles: UserRole[], userRoles: UserRole[]): boolean {
    if (isEmpty(roles) || isNil(roles)) {
      return true;
    }

    let result = true;

    roles.forEach((role) => {
      if (!userRoles.includes(role)) {
        result = false;
      }
    });

    return result;
  }
}
