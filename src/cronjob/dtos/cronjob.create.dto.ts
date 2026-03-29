import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { CronJobStatus } from 'src/common/enums/cronjob-status.enum';
import { ICronJobCreateDto } from 'src/common/interfaces/dtos/cronjob.dto.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { IDtoValidationError } from 'src/common/types/dto-validation-error.interface';
import { Nullable } from 'src/common/types/types.generic';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';
import { RegistryService } from 'src/shared/services/registry.service';

export class CronJobCreateDto implements ICronJobCreateDto {
  @ApiProperty({
    type: String,
    example: 'send-reminders',
    description: 'Human-readable name for the cron job',
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    type: String,
    example: '0 9 * * *',
    description: 'Cron expression',
  })
  @IsString()
  @MaxLength(50)
  cronExpression: string;

  @ApiProperty({
    type: Number,
    example: 1700000000000,
    description: 'Scheduled run time as epoch timestamp (bigint)',
  })
  @IsNumber()
  scheduledAt: number;

  @ApiPropertyOptional({
    type: Number,
    example: 1700000001000,
    description: 'When the job started (epoch), optional',
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  startedAt: Nullable<number>;

  @ApiPropertyOptional({
    type: Number,
    example: 1700000002000,
    description: 'When the job completed (epoch), optional',
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  completedAt: Nullable<number>;

  @ApiProperty({
    example: CronJobStatus.SCHEDULED,
    enum: CronJobStatus,
    description: 'Current job status',
  })
  @IsEnum(CronJobStatus)
  status: CronJobStatus;

  @ApiPropertyOptional({
    type: Object,
    example: { message: 'failure detail' },
    description: 'Structured error payload when status is failed (optional)',
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((o) => o.error !== null && o.error !== undefined)
  @IsObject()
  error: Nullable<Record<string, any>>;

  registryService: RegistryService;

  async validate(
    currentUser: IUserEntity,
    registryService: RegistryService,
    existingEntity?: EntityType<EntityList.CRONJOB>,
  ): Promise<IDtoValidationError[] | null> {
    this.registryService = registryService;
    return null;
  }

  toCreateDto(): ICronJobCreateDto {
    return {
      name: this.name,
      cronExpression: this.cronExpression,
      scheduledAt: this.scheduledAt,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      status: this.status,
      error: this.error,
    };
  }
}
