import { IsEmail, IsNotEmpty } from 'class-validator';

class CreateUserDTO {

    name: string;

    userName: string;

    password: string;

    access?: number;
    calorie?: number;
}

enum EDefault {
    EXPECTED_CALORIE = 2000,
}

export {
    CreateUserDTO,
    EDefault,
};
