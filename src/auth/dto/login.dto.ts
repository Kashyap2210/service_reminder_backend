import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    type: String,
    name: 'name',
    example: 'Tony Stark',
    description: 'name of user',
  })
  name: string;

  @ApiProperty({
    type: String,
    name: 'password',
    example: 'tonyStark',
    description: 'password of user',
  })
  password: string;
}
