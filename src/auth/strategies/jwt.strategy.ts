import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVariable } from '../../enum/evn-variable.enum';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return (request as any)?.cookies?.Session;
        },
      ]),
      secretOrKey: configService.get<string>(EnvVariable.JwtSecret),
    });
  }

  async validate(request: Request) {
    const userId = (request as any).userId;
    if (!userId) {
      throw new BadRequestException();
    }

    console.log(userId);

    try {
      const user = await this.userService.findOneId(userId);

      if (!user) {
        console.log(user);
        throw new UnauthorizedException();
      }

      return user;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
