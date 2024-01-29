import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/services/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EnvVariable } from '../enum/evn-variable.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    const isPasswordInvalid = await bcrypt.compare(password, user.password);
    if (user && isPasswordInvalid) {
      return user;
    }
    throw new UnauthorizedException('User or password are incorrect');
  }

  async login(user: any) {
    const secret = this.configService.get(EnvVariable.JwtSecret);
    const token = this.jwtService.sign({ userId: user.id }, { secret: secret });
    return token;
  }
}
