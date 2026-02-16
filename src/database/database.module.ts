import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * Global database module that provides TypeORM configuration
 * This module is global so it doesn't need to be imported in every feature module
 */
@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: DatabaseService,
    }),
  ],
  providers: [DatabaseService],
  exports: [TypeOrmModule, DatabaseService],
})
export class DatabaseModule {}
