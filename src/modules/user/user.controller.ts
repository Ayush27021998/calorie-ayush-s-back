import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import {UserService} from './user.service';
import {ValidationPipe} from '../../pipes/validation.pipe';
import {loginSchema, newUserSchema, updateUserSchema} from '../../schema/user.schema';
import {CreateUserDTO} from '../../dto/createUser.dto';
import ServiceResponse from '../../utils/ServiceResponse';
import LoginDTO from '../../dto/login.dto';
import AuthenticationGuard from '../../Guards/auth.guard';
import Access from '../../enums/accessEnum';
import RolesGuard from '../../Guards/roles.guard';
import {AuthDetails} from '../../utils/authDetails.decorator';
import AuthDetail from '../../interfaces/authDetails.interface';

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

    // @Get('/:userName')
    // @UseGuards(AuthenticationGuard, new RolesGuard([Access.USER, Access.MANAGER, Access.ADMIN]))
    // async findById(@Param('userName')userName: string, @AuthDetails() authDetail: AuthDetail): Promise<ServiceResponse> {
    //     if (authDetail.currentUser.access === Access.USER) {
    //         userName = authDetail.currentUser.userName;
    //     }
    //     return await this.userService.findByUserName(userName);
    // }
    //
    // @Post('/new')
    // @UseGuards(AuthenticationGuard, new RolesGuard([Access.MANAGER, Access.ADMIN]))
    // async createUser(@Body(new ValidationPipe(newUserSchema)) createUserDTO: CreateUserDTO,
    //                  @AuthDetails() authDetail: AuthDetail): Promise<ServiceResponse> {
    //     return await this.userService.createUser(createUserDTO, authDetail.currentUser);
    // }
    //
    //
    // @Delete('/remove/:userName')
    // @UseGuards(AuthenticationGuard, new RolesGuard([Access.MANAGER, Access.ADMIN]))
    // async removeUser(@Param('userName') userName: string, @AuthDetails() authDetail: AuthDetail): Promise<ServiceResponse> {
    //     return await this.userService.removeUser(userName, authDetail.currentUser);
    // }
    //
    // @Put('/update')
    // @UseGuards(AuthenticationGuard, new RolesGuard([Access.USER, Access.MANAGER, Access.ADMIN]))
    // async updateUser(@Body(new ValidationPipe(updateUserSchema)) updateUserDTO: UpdateUserDTO,
    //                  @AuthDetails() authDetail: AuthDetail): Promise<ServiceResponse> {
    //     return await this.userService.updateUser(updateUserDTO, authDetail.currentUser);
    // }
}
