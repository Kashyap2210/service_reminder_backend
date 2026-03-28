import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from 'src/common/enums/user.role.enum';
import { IUserSearchDto } from 'src/common/interfaces/dtos/user.dto.interface';

export class UserSearchDto implements IUserSearchDto {
  @ApiPropertyOptional({
    type: [String],
    example: ['John Doe'],
    description: 'Full name of the user',
  })
  @IsOptional()
  @IsString({ each: true })
  name?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['+1234567890'],
    description: 'Contact number of the user',
  })
  @IsOptional()
  @IsString({ each: true })
  contactNo?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['john.doe@example.com'],
    description: 'Email of the user',
  })
  @IsOptional()
  @IsEmail({}, { each: true })
  email?: string[];

  @ApiPropertyOptional({
    enum: UserRole,
    isArray: true,
    example: [UserRole.ADMIN],
    description: 'Role of the user',
  })
  @IsOptional()
  @IsEnum(UserRole, { each: true })
  role?: UserRole[];

  @ApiPropertyOptional({
    type: [Number],
    example: [1],
    description: 'ID of the user',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  id?: number[];
}
