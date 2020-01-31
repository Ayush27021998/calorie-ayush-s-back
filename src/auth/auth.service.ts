import { Injectable } from '@nestjs/common';
import UserEntity from '../entities/user.entity';
import * as JWT from 'jsonwebtoken';
import EMessages from '../enums/Messages';
import ServiceResponse from '../utils/ServiceResponse';
import Messages from '../enums/Messages';

@Injectable()
export default class AuthService {

    private mySecret = 'topSecret';

    public async generateJWTToken(user: UserEntity) {
        const payload = {
            user_: user,
        };
        return JWT.sign(payload,
            this.mySecret,
            {});
    }

    public async validateJWTToken(jwtToken: string): Promise<ServiceResponse> {
        try {
            const decoded: any = JWT.verify(jwtToken, this.mySecret);
            const { user_ } = decoded;
            const { userName } = user_;
            const user = await UserEntity.findByUserName(userName);
            if (!user) {
                return ServiceResponse.error(Messages.INVALID_AUTHENTICATION_TOKEN);
            }
            return ServiceResponse.success(user);
        } catch (e) {
            return ServiceResponse.error(Messages.INVALID_AUTHENTICATION_TOKEN);
        }
    }
}
