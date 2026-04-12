import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { IRecurringItemSearchDto, ServicePeriodUnit } from 'service_reminder_common';

export class RecurringItemSearchDto implements IRecurringItemSearchDto {
  @ApiPropertyOptional({
    type: [Number],
    example: [1],
    description: 'Recurring item id(s)',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  id?: number[];

  @ApiPropertyOptional({
    type: [String],
    example: ['Annual vehicle service'],
    description: 'Name(s) to match',
  })
  @IsOptional()
  @IsString({ each: true })
  name?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['vehicle'],
    description: 'Type label(s)',
  })
  @IsOptional()
  @IsString({ each: true })
  type?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['ACME Motors'],
    description: 'Company name(s)',
  })
  @IsOptional()
  @IsString({ each: true })
  companyName?: string[];

  @ApiPropertyOptional({
    type: [Number],
    example: [1],
    description: 'Vendor id(s)',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  vendorId?: number[];

  @ApiPropertyOptional({
    type: [Number],
    example: [6],
    description: 'Service period value(s)',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  servicePeriod?: number[];

  @ApiPropertyOptional({
    enum: ServicePeriodUnit,
    isArray: true,
    example: [ServicePeriodUnit.MONTHS],
    description: 'Service period unit(s)',
  })
  @IsOptional()
  @IsEnum(ServicePeriodUnit, { each: true })
  servicePeriodUnit?: ServicePeriodUnit[];

  @ApiPropertyOptional({
    type: [String],
    example: ['123 Main St'],
    description: 'Service place address(es)',
  })
  @IsOptional()
  @IsString({ each: true })
  servicePlaceAddress?: string[];

  @ApiPropertyOptional({
    type: [Number],
    example: [1],
    description: 'Owning user id(s)',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  userId?: number[];
}
