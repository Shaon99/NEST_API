import {
    Controller,
    Delete,
    Get,
    Param,
    Put,
    UseGuards,
    Body,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';
import { DeleteUserDto } from './dto/user.dto';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('lists')
    async getLists() {
        return await this.userService.getUserLists();
    }

    @Get(':id')
    async getUser(@Param('id') id: string) {
        return await this.userService.getUser(id);
    }

    @Put(':id')
    async updateUser(
        @Param('id') id: string,
        @Body() dto: UpdateUserDto,
    ) {
        return await this.userService.updateUser(id, dto);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        await this.userService.deleteUser({ userId: id });
        return { message: 'User successfully deleted.' };
    }
}