/**
 * JwtStrategy is a NestJS provider that implements JWT authentication via Passport.
 *
 * - It uses the 'passport-jwt' strategy to automatically validate JWT tokens provided
 *   in the Authorization header as a Bearer token.
 * - The strategy is registered under the name 'jwt'.
 * - It relies on PrismaService to fetch the user from the database based on the user id ('sub')
 *   found in the verified JWT payload.
 */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { userSelectFields } from 'src/user/user.select';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    /**
     * The JwtStrategy constructor receives the PrismaService (for DB access)
     * and calls the parent PassportStrategy constructor to configure:
     * - How JWTs should be extracted from inbound HTTP requests (from the Bearer Authorization header)
     * - What secret key is used to verify the JWT's authenticity
     */
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || 'hkjhkhkkkkhkhkhk',
        });
    }

    /**
     * This method is called automatically by Passport when a request contains a valid JWT.
     * 
     * - 'payload' contains the decoded JWT payload.
     * - We use the 'sub' (subject) field from the payload as the user ID.
     * - Look up the user in the database; if found, remove the password before returning.
     * - If the user is not found (perhaps deleted or invalid token), return null.
     * 
     * Returning the user object makes it available on the request as 'req.user' in controllers/guards.
     */
    async validate(payload: { sub: string; email: string }) {
        const user = await this.prisma.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
            select: userSelectFields,
        });
        if (!user) {
            return null;
        }
        return user;
    }
}
