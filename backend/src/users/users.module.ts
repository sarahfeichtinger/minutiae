import { forwardRef, Module } from "@nestjs/common";
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtStrategy } from '../auth/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from './repositories/user.repository';
import { Door } from '../doors/entities/door.entity';
import { LogsModule } from "../logs/logs.module";
import { AccessRepository } from "../accesses/repositories/access.repository";
import { Access } from "../accesses/entities/access.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRepository, Door, Access, AccessRepository]),
    forwardRef(() => LogsModule),
  ],
  providers: [UsersService, JwtStrategy, ConfigService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
