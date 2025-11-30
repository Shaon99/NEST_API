import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to extract the current authenticated user from the request object.
 * 
 * Usage in controller handler:
 *   @GetUser() // returns the full user object
 *   @GetUser('email') // returns only the email property of the user
 *
 * Why use this?
 * - It encapsulates the logic of extracting the user (populated by Passport's JwtStrategy)
 *   so you don't repeat this code in every controller method.
 * - It increases code clarity and type safety.
 * - It enables property-level extraction (e.g., just one field, for convenience and security)
 *   by passing a string argument.
 *
 * Example:
 *   @Get('me')
 *   getMe(@GetUser() user) { ... }
 *
 *   @Get('me/email')
 *   getEmail(@GetUser('email') email) { ... }
 */
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // If a property key is passed, return just that field from the user object
    if (data) {
      return request.user?.[data];
    }
    // Otherwise, return the whole user object attached by the auth guard
    return request.user;
  },
);
