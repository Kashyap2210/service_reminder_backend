import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { IVendorSearchDto } from 'src/common/interfaces/dtos/vendor.dto.interface';

export class VendorSearchDto implements IVendorSearchDto {
  @ApiPropertyOptional({
    type: [Number],
    example: [1],
    description: 'Vendor id(s)',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  id?: number[];

  @ApiPropertyOptional({
    type: [String],
    example: ['ACME Service Center'],
    description: 'Name(s)',
  })
  @IsOptional()
  @IsString({ each: true })
  name?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['+1234567890'],
    description: 'Contact number(s)',
  })
  @IsOptional()
  @IsString({ each: true })
  contactNo?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['vendor@example.com'],
    description: 'Email(s)',
  })
  @IsOptional()
  @IsString({ each: true })
  email?: string[];

  @ApiPropertyOptional({
    type: [Number],
    example: [1],
    description: 'Recurring item id(s)',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  recurringItemId?: number[];

  @ApiPropertyOptional({
    type: [Number],
    example: [1],
    description: 'User id(s)',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  userId?: number[];
}
