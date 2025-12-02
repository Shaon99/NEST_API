import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { userSelectFields } from "./user.select";
import { DeleteUserDto, UpdateUserDto } from "./dto";
import * as argon from '@node-rs/argon2';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async getUserLists() {
        try {
            const users = await this.prisma.prisma.user.findMany({
                select: userSelectFields,
            });
            return { users };
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve user list.');
        }
    }

    async getUser(id: string) {
        // Validate input
        if (!id || typeof id !== 'string') {
            throw new NotFoundException('User not found.');
        }

        try {
            const user = await this.prisma.prisma.user.findUnique({
                where: { id },
                select: userSelectFields,
            });

            if (!user) {
                throw new NotFoundException('User not found.');
            }

            // Ensure validated response and HTTP 200 semantics
            return {
                statusCode: 200,
                message: "User retrieved successfully.",
                data: user
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve user.');
        }
    }

    /**
     * Updates user details:
     * - Updates name if provided.
     * - Updates password (hashed) if provided.
     * - Updates email if provided and unique.
     */
    async updateUser(id: string, dto: UpdateUserDto) {
        const user = await this.prisma.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found.');
        }

        const updateData: Record<string, any> = {};

        if (dto.name !== undefined) {
            updateData.name = dto.name;
        }

        if (dto.password !== undefined) {
            updateData.password = await argon.hash(dto.password);
        }

        if (dto.email !== undefined) {
            if (dto.email !== user.email) {
                const existing = await this.prisma.prisma.user.findUnique({
                    where: { email: dto.email },
                });
                if (existing && existing.id !== id) {
                    throw new ConflictException('Email is already in use by another user.');
                }
            }
            updateData.email = dto.email;
        }

        if (Object.keys(updateData).length === 0) {
            // No fields provided to update
            return await this.prisma.prisma.user.findUnique({
                where: { id },
                select: userSelectFields,
            });
        }

        try {
            const updatedUser = await this.prisma.prisma.user.update({
                where: { id },
                data: updateData,
                select: userSelectFields,
            });
            return updatedUser;
        } catch (error) {
            throw new InternalServerErrorException('Failed to update user.');
        }
    }

    async deleteUser(dto: DeleteUserDto) {
        // Ensure the input DTO is valid (should be done by ValidationPipe globally, but double-check here)
        if (!dto.userId || typeof dto.userId !== 'string') {
            throw new NotFoundException('Invalid user ID.');
        }

        try {
            await this.prisma.prisma.user.delete({
                where: { id: dto.userId },
            });
            // Explicitly returning JSON (object), HTTP 200 by default in service layer.
            return {
                status: 200,
                contentType: 'application/json',
                data: { message: 'User successfully deleted.' }
            };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('User not found.');
            }
            throw new InternalServerErrorException('Failed to delete user.');
        }
    }
}