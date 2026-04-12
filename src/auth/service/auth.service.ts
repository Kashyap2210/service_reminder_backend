import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ILoginDto, ILoginResponse } from 'service_reminder_common';
import { UserService } from 'src/user/services/user.service';
import { EntityManager } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    dto: ILoginDto,
    entityManager?: EntityManager,
  ): Promise<ILoginResponse> {
    // console.log('loginDto', dto);
    const [user] = await this.userService.search(
      {
        name: [dto.name],
      },
      undefined,
      entityManager,
    );

    if (!user) {
      throw new NotFoundException({
        key: 'name',
        message: `User with name '${dto.name}' not found. Please try again.`,
      });
    }

    // console.log('user', user);
    if (user) {
      const hashedPassword = await bcrypt.compare(dto.password, user.password);

      if (!hashedPassword) {
        throw new BadRequestException({
          key: 'password',
          message: 'Invalid password.',
        });
      }

      const payload = { userId: user.id, name: user.name };
      const accessToken = await this.jwtService.signAsync(payload);

      return {
        currentUser: user,
        accessToken,
      };
    }

    return {
      accessToken: '', // or omit this property
    };
  }
}
