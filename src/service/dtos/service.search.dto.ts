import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { AppointmentType, IServiceSearchDto, ServiceStatus } from 'service_reminder_common';

export class ServiceSearchDto implements IServiceSearchDto {
  @ApiPropertyOptional({
    type: [Number],
    example: [1],
    description: 'Service id(s)',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  id?: number[];

  @ApiPropertyOptional({
    type: [Number],
    example: [1700000000000],
    description: 'Service date(s) as epoch timestamp',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  serviceDate?: number[];

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
    description: 'Appointment id(s)',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  appointmentId?: number[];

  @ApiPropertyOptional({
    type: [Number],
    example: [1],
    description: 'User id(s)',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  userId?: number[];

  @ApiPropertyOptional({
    enum: AppointmentType,
    isArray: true,
    example: [AppointmentType.SERVICE],
    description: 'Service type(s)',
  })
  @IsOptional()
  @IsEnum(AppointmentType, { each: true })
  serviceType?: AppointmentType[];

  @ApiPropertyOptional({
    enum: ServiceStatus,
    isArray: true,
    example: [ServiceStatus.SERVICE_STARTED],
    description: 'Service status(es)',
  })
  @IsOptional()
  @IsEnum(ServiceStatus, { each: true })
  serviceStatus?: ServiceStatus[];

  @ApiPropertyOptional({
    type: [Number],
    example: [2],
    description: 'Vendor id(s)',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  vendorId?: number[];

  @ApiPropertyOptional({
    type: [Number],
    example: [199.99],
    description: 'Service estimate(s)',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  serviceEstimate?: number[];

  @ApiPropertyOptional({
    type: [Number],
    example: [189.5],
    description: 'Service amount(s)',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  serviceAmount?: number[];

  @ApiPropertyOptional({
    type: [String],
    example: ['https://example.com/invoice.pdf'],
    description: 'Invoice document reference(s)',
  })
  @IsOptional()
  @IsString({ each: true })
  invoiceDocument?: string[];
}
