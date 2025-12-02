import { IsEmail, IsNotEmpty, IsString, MinLength, ValidateIf } from "class-validator";

/**
 * How to use:
 * - Use this DTO when updating a user.
 * - All fields are optional, so you can send any combination (name, email, password)
 * - Fields you do NOT send will NOT be changed.
 * - Service checks for email duplicity & re-hashes password if new one is provided.
 * 
 * Example PATCH body:
 *   {
 *     "name": "Jane Doe",
 *     "email": "jane@example.com",
 *     "password": "newpassword"
 *   }
 */
export class UpdateUserDto {
    /**
     * Name is optional. If provided, must be a string.
     */
    @ValidateIf((o) => o.name !== undefined && o.name !== null)
    @IsString({ message: 'Name must be a string' })
    name?: string;

    /**
     * Email field can be updated sometimes, but it's optional.
     * If provided, must be a string and valid email.
     * The ability to update this field may be restricted per business logic.
     *
     * NOTE: Email uniqueness should not be checked if the provided email is
     * the same as the user's current email (i.e., user is not changing it).
     * Uniqueness validation happens in the service, not at the DTO level.
     */
    @ValidateIf((o) => o.email !== undefined && o.email !== null)
    @IsString({ message: 'Email must be a string' })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email?: string;

    /**
     * Password is optional and can be updated if provided.
     * If updating, it must be a string with at least 6 characters.
     * The service will automatically hash the new password if it's supplied.
     */
    @ValidateIf((o) => o.password !== undefined && o.password !== null)
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password?: string;
}


export class DeleteUserDto {
    @IsNotEmpty({ message: 'User ID is required' })
    @IsString({ message: 'User ID must be a string' })
    userId: string;
}