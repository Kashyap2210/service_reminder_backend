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
import { EntityFilterDataHelper } from 'src/common/helpers/entity-filter-data.helper';
import {
  ICronJobCreateDto,
  ICronJobSearchDto,
} from 'src/common/interfaces/dtos/cronjob.dto.interface';
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

  validationData: EntityFilterDataHelper;

  async validate(
    currentUser: IUserEntity,
    registryService: RegistryService,
    existingEntity?: EntityType<EntityList.CRONJOB>,
  ): Promise<IDtoValidationError[] | null> {
    const errors: IDtoValidationError[] = [];
    this.registryService = registryService;

    this.validationData = await this.fetchDataForCombineValidation(currentUser);

    const cronExpressionValidationResult = await this.validateCronExpression();
    if (cronExpressionValidationResult)
      errors.push(...cronExpressionValidationResult);

    const nameValidationResult = await this.validateName(existingEntity);
    if (nameValidationResult) errors.push(...nameValidationResult);

    return errors.length > 0 ? errors : null;
  }

  async validateName(existingEntity?: EntityType<EntityList.CRONJOB>) {
    const errors: IDtoValidationError[] = [];

    const existingCronJob = this.validationData.getEntityFromList(
      EntityList.CRONJOB,
    );

    if (existingCronJob && existingCronJob.length > 0) {
      if (!existingEntity || existingEntity.id !== existingCronJob[0].id) {
        errors.push({
          key: 'name',
          message: `Cron job with name: ${this.name} already exists. Please try again with a different name.`,
        });
      }
    }

    return errors.length > 0 ? errors : null;
  }

  async validateCronExpression() {
    const errors: IDtoValidationError[] = [];

    const fields = this.cronExpression?.trim().split(/\s+/) ?? [];
    if (fields.length !== 5) {
      errors.push({
        key: 'cronExpression',
        message:
          'Invalid cron expression. Please use a valid 5-field cron format (minute hour day-of-month month day-of-week).',
      });
      return errors;
    }

    const [minute, hour, dayOfMonth, month, dayOfWeek] = fields;

    const isValid =
      this.isValidCronField(minute, 0, 59) &&
      this.isValidCronField(hour, 0, 23) &&
      this.isValidCronField(dayOfMonth, 1, 31) &&
      this.isValidCronField(month, 1, 12) &&
      this.isValidCronField(dayOfWeek, 0, 7);

    if (!isValid) {
      errors.push({
        key: 'cronExpression',
        message:
          'Invalid cron expression. Please provide a valid expression with supported ranges and syntax.',
      });
    }

    return errors.length > 0 ? errors : null;
  }

  async fetchDataForCombineValidation(
    currentUser: IUserEntity,
  ): Promise<EntityFilterDataHelper> {
    const filter: ICronJobSearchDto = {
      name: [this.name],
    };

    return new EntityFilterDataHelper(
      await this.registryService
        .get(EntityList.CRONJOB)
        .searchV2(filter, currentUser),
    );
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

  private isValidCronField(value: string, min: number, max: number): boolean {
    const segments = value.split(',');
    if (segments.length === 0) return false;

    return segments.every((segment) => {
      const trimmedSegment = segment.trim();
      if (!trimmedSegment) return false;

      const [basePart, stepPart] = trimmedSegment.split('/');
      if (stepPart !== undefined) {
        if (!/^\d+$/.test(stepPart)) return false;
        const step = Number(stepPart);
        if (step <= 0) return false;
      }

      if (basePart === '*') return true;

      if (/^\d+$/.test(basePart)) {
        const n = Number(basePart);
        return n >= min && n <= max;
      }

      if (/^\d+-\d+$/.test(basePart)) {
        const [start, end] = basePart.split('-').map(Number);
        return start >= min && end <= max && start <= end;
      }

      return false;
    });
  }
}
