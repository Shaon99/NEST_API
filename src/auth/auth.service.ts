import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, SigninDto } from "./dto";
import * as argon from '@node-rs/argon2';

@Injectable({})
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
    ) { }

    //sign up method
    async signup(dto: AuthDto) {
        //generate the password hash
        const hash = await argon.hash(dto.password);

        //save the user in the database
        try {
            const user = await this.prisma.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hash,
                    name: dto.name,
                },
            });

            //remove password from response
            const { password, ...userWithoutPassword } = user;

            //return the user
            return userWithoutPassword;
        } catch (error) {
            // Handle Prisma unique constraint violation (duplicate email)
            if (error.code === 'P2002') {
                throw new ForbiddenException('Email already exists. Please use a different email address.');
            }
            // Re-throw other errors
            throw error;
        }
    }

    //sign in method
    async signin(dto: SigninDto) {
        // find the user by email
        const user = await this.prisma.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        // if user does not exist throw exception
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // compare password
        const pwMatches = await argon.verify(user.password, dto.password);

        // if password incorrect throw exception
        if (!pwMatches) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // send back the user with JWT token
        const token = await this.signToken(user.id, user.email);

        // return token along with user info (email and name)
        return {
            ...token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }

    /**
     * Generates a JWT access token for the authenticated user.
     * 
     * @param userId - The unique identifier of the user (will be set as the JWT subject claim 'sub').
     * @param email - The email of the user (added to the token payload).
     * @returns An object containing the signed JWT as 'access_token'.
     *
     * This method creates a payload containing the user's id and email,
     * signs it using the JWT service with a set secret and expiration,
     * and returns the resulting access token. The 'sub' (subject) claim is commonly used
     * to uniquely identify the principal that is the subject of the JWT.
     */
    async signToken(userId: string, email: string): Promise<{ access_token: string }> {
        // Create the payload to embed in the JWT.
        const payload = {
            sub: userId,   // 'sub' is standard claim for subject (user id)
            email,         // Include user email in the payload
        };

        // Sign the JWT asynchronously with the payload, setting expiry and secret
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '24h', // Token is valid for 24 hours
            secret: process.env.JWT_SECRET || 'hkjhkhkkkkhkhkhk',
        });

        // Return the access token in an object
        return {
            access_token: token,
        };
    }
}