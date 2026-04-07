import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { NotificationStatus } from 'src/common/enums/notification-status.enum';
import { NotificationType } from 'src/common/enums/notification-type.enum';
import { INotificationSearchDto } from 'src/common/interfaces/dtos/notification.dto.interface';

export class NotificationSearchDto implements INotificationSearchDto {
  @ApiPropertyOptional({ type: [Number], example: [1] })
  @IsOptional()
  @IsNumber({}, { each: true })
  id?: number[];

  @ApiPropertyOptional({ type: [Number], example: [1] })
  @IsOptional()
  @IsNumber({}, { each: true })
  userId?: number[];

  @ApiPropertyOptional({ type: [Number], example: [1] })
  @IsOptional()
  @IsNumber({}, { each: true })
  recurringItemId?: number[];

  @ApiPropertyOptional({ type: [Number], example: [1] })
  @IsOptional()
  @IsNumber({}, { each: true })
  appointmentId?: number[];

  @ApiPropertyOptional({
    enum: NotificationType,
    isArray: true,
    example: [NotificationType.EMAIL_SERVICE_REMINDER],
  })
  @IsOptional()
  @IsEnum(NotificationType, { each: true })
  type?: NotificationType[];

  @ApiPropertyOptional({
    enum: NotificationStatus,
    isArray: true,
    example: [NotificationStatus.PENDING],
  })
  @IsOptional()
  @IsEnum(NotificationStatus, { each: true })
  status?: NotificationStatus[];

  @ApiPropertyOptional({ type: [Number], example: [1700000000000] })
  @IsOptional()
  @IsNumber({}, { each: true })
  scheduledFor?: number[];

  @ApiPropertyOptional({ type: [Number], example: [1700000001000] })
  @IsOptional()
  @IsNumber({}, { each: true })
  sentAt?: number[];

  @ApiPropertyOptional({ type: [Number], example: [0] })
  @IsOptional()
  @IsNumber({}, { each: true })
  retryCount?: number[];

  @ApiPropertyOptional({ type: [String], example: ['timeout'] })
  @IsOptional()
  @IsString({ each: true })
  lastError?: string[];
}
