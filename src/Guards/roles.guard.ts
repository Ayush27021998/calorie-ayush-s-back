import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import Messages from '../enums/Messages';
import Access from '../enums/accessEnum';

@Injectable()
class RolesGuard implements CanActivate {
    constructor(private readonly access: Access[]) {
    }

    public canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const index = this.access.indexOf(user.access);
        if (index !== -1) {
            return true;
        } else  {
            throw new HttpException(Messages.PERMISSION_DENIED, 403);
        }
    }
}

export default RolesGuard;
