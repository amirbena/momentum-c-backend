import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedExceptionText } from 'src/constants/constants';
import { TokenDto } from 'src/dto/request/users/tokenDto.dto';
import { PrivateKey } from 'src/private-keys/private-keys';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtService: JwtService, private privateKey: PrivateKey) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(UnauthorizedExceptionText);
    }
    try {
      const secret = await this.privateKey.getPrivateKey();
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret
        }
      ) as TokenDto;
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request.body['user'] = payload;
    } catch(error) {
      throw new UnauthorizedException(UnauthorizedExceptionText);
    }
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
