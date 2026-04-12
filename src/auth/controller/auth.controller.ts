import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../service/auth.service';
import { ILoginResponse } from 'service_reminder_common';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({
    type: LoginDto,
    description: 'Login a user with dto ILoginDto',
  })
  @ApiOkResponse({
    description: 'Get signed JWT token.',
  })
  login(@Body() dto: LoginDto): Promise<ILoginResponse> {
    return this.authService.signIn(dto);
  }

  @ApiOkResponse({
    description: 'Get user from the request.',
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
