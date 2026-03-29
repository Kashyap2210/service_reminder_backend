import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CronJobStatus } from 'src/common/enums/cronjob-status.enum';
import { ICronJobSearchDto } from 'src/common/interfaces/dtos/cronjob.dto.interface';

export class CronJobSearchDto implements ICronJobSearchDto {
  @ApiPropertyOptional({
    type: [Number],
    example: [1],
    description: 'Cron job id(s)',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  id?: number[];

  @ApiPropertyOptional({
    type: [String],
    example: ['send-reminders'],
    description: 'Name(s)',
  })
  @IsOptional()
  @IsString({ each: true })
  name?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['0 9 * * *'],
    description: 'Cron expression(s)',
  })
  @IsOptional()
  @IsString({ each: true })
  cronExpression?: string[];

  @ApiPropertyOptional({
    type: [Number],
    example: [1700000000000],
    description: 'Scheduled time(s) as epoch',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  scheduledAt?: number[];

  @ApiPropertyOptional({
    type: [Number],
    example: [1700000001000],
    description: 'Started time(s) as epoch',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  startedAt?: number[];

  @ApiPropertyOptional({
    type: [Number],
    example: [1700000002000],
    description: 'Completed time(s) as epoch',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  completedAt?: number[];

  @ApiPropertyOptional({
    enum: CronJobStatus,
    isArray: true,
    example: [CronJobStatus.SCHEDULED],
    description: 'Status(es)',
  })
  @IsOptional()
  @IsEnum(CronJobStatus, { each: true })
  status?: CronJobStatus[];
}
