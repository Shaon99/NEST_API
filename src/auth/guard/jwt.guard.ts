/**
 * JwtGuard protects routes using JWT authentication.
 * 
 * WHY USE:
 * - It ensures that only requests with a valid JWT (JSON Web Token) can access certain endpoints.
 * - It acts as a NestJS Guard, intercepting incoming HTTP requests and validating the JWT,
 *   thereby securing routes that require authentication.
 * - By using Passport's 'jwt' strategy (see how JwtStrategy is implemented in strategy/jwt.strategy.ts),
 *   it centralizes token verification, user validation, and error handling for authentication.
 * 
 * EXPLANATION:
 * - Extends `AuthGuard('jwt')` from @nestjs/passport to enable JWT-based authentication.
 * - The @Injectable() decorator makes this guard injectable and usable in controllers via the @UseGuards(JwtGuard) decorator.
 * - If a request is made to a protected route, JwtGuard checks for a valid Authorization header
 *   containing a Bearer token; if valid, attaches the corresponding user to the request.
 *   Otherwise, the request is denied with an unauthorized error.
 */

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') { }
