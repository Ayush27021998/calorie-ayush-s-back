import { Injectable } from '@nestjs/common';
import {CreateUserDTO, EDefault} from '../../dto/createUser.dto';
import ServiceResponse from '../../utils/ServiceResponse';
import UserEntity from '../../entities/user.entity';
import Messages from '../../enums/Messages';
import Access from '../../enums/accessEnum';
import UserInterface from '../../interfaces/user.interface';
import LoginDTO from '../../dto/login.dto';
import AuthService from '../../auth/auth.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly authService: AuthService) {}
    async createUser(user: CreateUserDTO, role: { access: number }): Promise<ServiceResponse> {
        const fetchedUser: UserEntity = await UserEntity.findByUserName(user.userName);
        if (!fetchedUser){
            if (!fetchedUser.password) {
                return ServiceResponse.error(Messages.INVALID_CREDENTIALS);
            } else {
                if (role.access === Access.MANAGER || role.access === 0 || !user.access){
                    user.access = Access.USER;
                }
                const newUser: UserEntity = await UserEntity.create(user);
                if (user.calorie && user.calorie > 0) {
                    newUser.calorie = user.calorie
                } else {
                    newUser.calorie = EDefault.EXPECTED_CALORIE;
                }
                const data: UserInterface = await UserEntity.save(newUser);
                return ServiceResponse.success(data, Messages.SUCCESS, 1);
            }
        } else {
            return ServiceResponse.error(Messages.INVALID_CREDENTIALS + ` : userName \"${user.userName}\" already in use`);
        }
    }

    async login(loginCredentials: LoginDTO) {
        const {userName, password} = loginCredentials;
        const user: UserEntity = await UserEntity.findOne({
            where: {userName},
        });
        if ( !user || !loginCredentials.password) {
            return ServiceResponse.error(Messages.INVALID_CREDENTIALS);
        }
        const data: UserInterface = await UserEntity.findByUserName(userName);
        if (await bcrypt.compare(password, user.password)) {
            return ServiceResponse.success(
                {
                    jwttoken: await this.authService.generateJWTToken(user),
                    user: data,
                }, Messages.SUCCESS, 1);
        } else {
            return ServiceResponse.error(Messages.INVALID_CREDENTIALS);
        }
    }
}
