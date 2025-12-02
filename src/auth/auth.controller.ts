import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, SigninDto } from "./dto";
import { JwtGuard } from "./guard/jwt.guard";
import { GetUser } from "./decorator/get-user.decorator";

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

    //auth/me  GET request - Get authenticated user
    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@GetUser() user: any) {
        return user;
    }
}