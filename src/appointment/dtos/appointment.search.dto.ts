import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { AppointmentStatus } from 'src/common/enums/appointment-status.enum';
import { AppointmentType } from 'src/common/enums/appointment-type.enum';
import { IAppointmentSearchDto } from 'src/common/interfaces/dtos/appointment.dto.interface';

export class AppointmentSearchDto implements IAppointmentSearchDto {
  @ApiPropertyOptional({
    type: [Number],
    example: [1],
    description: 'ID of the appointment',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  id?: number[];

  @ApiPropertyOptional({
    type: [Number],
    example: [1700000000000],
    description: 'Appointment date(s) as epoch timestamp (bigint)',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  appointmentDate?: number[];

  @ApiPropertyOptional({
    type: [Number],
    example: [1],
    description: 'ID(s) of the recurring item linked to the appointment',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  recurringItemId?: number[];

  @ApiPropertyOptional({
    type: [Number],
    example: [1],
    description: 'ID(s) of the user who owns the appointment',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  userid?: number[];

  @ApiPropertyOptional({
    enum: AppointmentType,
    isArray: true,
    example: [AppointmentType.SERVICE],
    description: 'Type(s) of the appointment',
  })
  @IsOptional()
  @IsEnum(AppointmentType, { each: true })
  appointmentType?: AppointmentType[];

  @ApiPropertyOptional({
    type: [Number],
    example: [2],
    description: 'ID(s) of the vendor associated with the appointment',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  vendorId?: number[];

  @ApiPropertyOptional({
    enum: AppointmentStatus,
    isArray: true,
    example: [AppointmentStatus.BOOKED],
    description: 'Status(es) of the appointment',
  })
  @IsOptional()
  @IsEnum(AppointmentStatus, { each: true })
  appointmentStatus?: AppointmentStatus[];
}
