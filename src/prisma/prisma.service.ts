import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService is a NestJS provider that manages a single instance of
 * PrismaClient for interacting with the database using Prisma ORM.
 * 
 * - It implements OnModuleInit and OnModuleDestroy to ensure that the
 *   database connection is established when the NestJS module starts up
 *   and properly disconnected when the module is destroyed.
 * - The `prisma` property exposes the PrismaClient instance so that it can be
 *   used throughout your app for database operations.
 */
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    // Exposes a PrismaClient instance for performing DB queries.
    public prisma: PrismaClient;

    /**
     * Called once the module has been initialized.
     * Responsible for creating the PrismaClient instance and connecting to the database.
     */
    async onModuleInit() {
        this.prisma = new PrismaClient(); // Instantiate PrismaClient
        await this.prisma.$connect();     // Connect to the database
    }

    /**
     * Called before the application shuts down.
     * Responsible for disconnecting PrismaClient from the database to free resources.
     */
    async onModuleDestroy() {
        await this.prisma?.$disconnect(); // Gracefully disconnect
    }
}
