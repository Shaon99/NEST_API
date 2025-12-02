/**
 * User select fields - excludes password for security
 * Use this constant when querying users to ensure password is never returned
 */
export const userSelectFields = {
    id: true,
    email: true,
    name: true,
    createdAt: true,
    updatedAt: true,
} as const;

