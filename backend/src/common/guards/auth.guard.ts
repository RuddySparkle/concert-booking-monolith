import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { MockDB } from '../../db/mock-db';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const userId = request.headers['user-id'];

        if (!userId) {
            throw new UnauthorizedException('Missing user-id header for authentication');
        }

        const user = MockDB.users.find(u => u.id === userId);
        if (!user) {
            throw new UnauthorizedException('Invalid User ID');
        }

        request.user = user;
        return true;
    }
}
