import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { EnvVariable } from 'enum/evn-variable.enum';
import { User } from 'entity/user.entity';

export const typeOrmModuleAsyncOptions: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    type: configService.get<string>(EnvVariable.DataBaseType) as 'postgres',
    host: configService.get<string>(EnvVariable.DataBaseHost),
    port: configService.get<number>(EnvVariable.DataBasePort),
    username: configService.get<string>(EnvVariable.DataBaseUserName),
    password: configService.get<string>(EnvVariable.DataBasePassword),
    database: configService.get<string>(EnvVariable.DataBaseName),
    entities: [User],
    synchronize: true,
    // migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  }),
  inject: [ConfigService],
};
