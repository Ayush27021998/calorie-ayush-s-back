import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {UserService} from './user.service';
import {ValidationPipe} from '../../pipes/validation.pipe';
import {loginSchema, newUserSchema} from '../../schema/user.schema';
import {CreateUserDTO} from '../../dto/createUser.dto';
import ServiceResponse from '../../utils/ServiceResponse';
import LoginDTO from '../../dto/login.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/signUp')
    async createNewAccount(@Body(new ValidationPipe(newUserSchema)) user: CreateUserDTO): Promise<ServiceResponse>{
        return await this.userService.createUser(user, {access: 0});
    }

    @Post('login')
    async login(@Body(new ValidationPipe(loginSchema)) loginCredentials: LoginDTO): Promise<ServiceResponse> {
        return await this.userService.login(loginCredentials);
    }

    @Get('/:userName')
    @UseGuards(AuthenticationGuard, new RolesGuard([Access.USER, Access.MANAGER, Access.ADMIN]))
    async findById(@Param('userName')userName: string, @AuthDetails() authDetail: AuthDetail): Promise<ServiceResponse> {
        if (authDetail.currentUser.access === Access.USER) {
            userName = authDetail.currentUser.userName;
        }
        return await this.userService.findByUserName(userName);
    }

    @Post('/new')
    @UseGuards(AuthenticationGuard, new RolesGuard([Access.MANAGER, Access.ADMIN]))
    async createUser(@Body(new ValidationPipe(newUserSchema)) createUserDTO: CreateUserDTO,
                     @AuthDetails() authDetail: AuthDetail): Promise<ServiceResponse> {
        return await this.userService.createUser(createUserDTO, authDetail.currentUser);
    }

    @Post('/signUp')
    // @UsePipes(new JoiValidationPipe(newUserValidationSchema))
    async createAccount(@Body(new JoiValidationPipe(newUserSchema)) createUserDTO: CreateUserDTO): Promise<ServiceResponse> {
        return await this.userService.createUser(createUserDTO, {access: 0});
    }

    @Delete('/remove/:userName')
    @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.MANAGER, EAccess.ADMIN]))
    async removeUser(@Param('userName') userName: string, @AuthDetails() authDetail: AuthDetail): Promise<ServiceResponse> {
        return await this.userService.removeUser(userName, authDetail.currentUser);
    }

    @Put('/update')
    @UseGuards(AuthenticationGuard, new RolesGuard([EAccess.USER, EAccess.MANAGER, EAccess.ADMIN]))
    async updateUser(@Body(new ValidationPipe(updateUserSchema)) updateUserDTO: UpdateUserDTO,
                     @AuthDetails() authDetail: AuthDetail): Promise<ServiceResponse> {
        return await this.userService.updateUser(updateUserDTO, authDetail.currentUser);
    }
}
