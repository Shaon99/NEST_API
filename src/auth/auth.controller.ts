import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, SigninDto } from "./dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    //auth/signup  POST request
    @Post('signup')
    signup(@Body() dto: AuthDto) {
        return this.authService.signup(dto);
    }

    //auth/signin  POST request
    @Post('signin')
    signin(@Body() dto: SigninDto) {
        return this.authService.signin(dto);
    }
}