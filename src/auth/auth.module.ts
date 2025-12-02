import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';

/**
 * The AuthModule sets up the authentication system for the application.
 * 
 * - `PassportModule`: Provides strategies for authentication (here for JWT).
 * - `JwtModule`: Configures JWT signing with a secret 
 *   (`process.env.JWT_SECRET` or default if not provided) and 
 *   token expiry (`24h`, i.e., 24 hours).
 * - `controllers`: Registers the `AuthController` to handle auth routes (signup/signin).
 * - `providers`: Injects `AuthService` for business logic and `JwtStrategy` for passport JWT validation.
 *
 * This module groups together all pieces that implement authentication in this app.
 */
@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            // The secret key to sign/validate JWTs, loaded from env or set to a default if env missing.
            secret: process.env.JWT_SECRET || 'hkjhkhkkkkhkhkhk',
            // Each JWT will expire after 24 hours for security.
            signOptions: { expiresIn: '24h' },
        }),
    ],
    controllers: [AuthController], // Handles HTTP routes for authentication (signup, signin).
    providers: [
        AuthService, // Provides core logic for signing up, signing in, token issuance.
        JwtStrategy  // Enables JWT-based route protection for NestJS Passport guards.
    ],
})
export class AuthModule { }