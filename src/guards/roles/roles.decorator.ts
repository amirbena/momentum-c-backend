import { SetMetadata } from '@nestjs/common';
import { AccessLayer } from 'src/constants/constants';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AccessLayer[]) => SetMetadata(ROLES_KEY, roles);