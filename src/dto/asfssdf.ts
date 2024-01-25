// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor(
//     private readonly configService: ConfigService,
//     private readonly rabbitMqRequester: RabbitMqRequester,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         (request: Request) => {
//           return request?.cookies?.Session;
//         },
//       ]),
//       secretOrKey: configService.get<string>(EnvVariable.JwtSecret),
//       passReqToCallback: true,
//     });
//   }
//
//   async validate(request: Request, { userId }: TokenPayload) {
//     if (!userId) {
//       throw new BadRequestException();
//     }
//
//     try {
//       const user = await this.rabbitMqRequester.request<
//         AuthGetUserById.Payload,
//         UsersEntity
//       >({
//         exchange: RmqExchange.Auth,
//         routingKey: AuthGetUserById.routingKey,
//         payload: { id: userId },
//       });
//
//       if (!user) {
//         console.log(user);
//         throw new UnauthorizedException();
//       }
//
//       return { ...request.user, user };
//     } catch (e) {
//       throw new InternalServerErrorException();
//     }
//   }
// }
//
// import { ConfigService } from '@nestjs/config';
// import { JwtModuleAsyncOptions } from '@nestjs/jwt';
// import { EnvVariable } from 'enum/evn-variable.enum';
//
// export const jwtModuleAsyncOptions: JwtModuleAsyncOptions = {
//   useFactory: (configService: ConfigService) => ({
//     secret: configService.get<string>(EnvVariable.JwtSecret),
//     signOptions: {
//       expiresIn: `${configService.get<number>(EnvVariable.JwtExpiration)} days`,
//     },
//   }),
//   inject: [ConfigService],
// };
//
// import { AuthGuard } from '@nestjs/passport';
//
// export default class JwtAuthGuard extends AuthGuard('jwt') {}
