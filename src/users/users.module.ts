import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// import { UsersController } from './users.controller';
import { User } from '../entity/user.entity';
import { UsersService } from './services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [],
})
export class UsersModule {}
