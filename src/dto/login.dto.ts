import { IsEmail, IsNotEmpty } from 'class-validator';

class LoginDTO {

    userName: string;

    @IsNotEmpty()
    password: string;
}
export default LoginDTO;
