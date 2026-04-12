import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { CronJobStatus } from 'service_reminder_common';
import { CronJobCreateDto } from './dtos/cronjob.create.dto';
import { CronJobSearchDto } from './dtos/cronjob.search.dto';
import { CronJobUpdateDto } from './dtos/cronjob.update.dto';
import { CronJobEntity } from './entities/cronjob.entity';

const BadRequestResponse = ApiBadRequestResponse({
  description: 'Validation failed',
  schema: {
    properties: {
      statusCode: { type: 'number', example: 400 },
      message: {
        type: 'object',
        properties: {
          key: { type: 'string', example: 'id' },
          message: {
            type: 'string',
            example: 'Cron job with id: 1 does not exist.',
          },
        },
      },
    },
  },
});

const CronJobEntityResponse = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(CronJobEntity) },
      {
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'send-reminders' },
          cronExpression: { type: 'string', example: '0 9 * * *' },
          scheduledAt: { type: 'number', example: 1700000000000 },
          startedAt: { type: 'number', example: 1700000001000, nullable: true },
          completedAt: {
            type: 'number',
            example: 1700000002000,
            nullable: true,
          },
          status: {
            type: 'string',
            enum: Object.values(CronJobStatus),
            example: CronJobStatus.SCHEDULED,
          },
          error: {
            type: 'object',
            example: { message: 'failure detail' },
            nullable: true,
          },
          createdOn: { type: 'number', example: 1700000000000 },
          updatedOn: { type: 'number', example: 1700000000000 },
        },
      },
    ],
  },
};

export const CreateCronJobSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Create a cron job',
      description: 'Registers a new scheduled job record.',
    }),
    ApiBody({
      type: CronJobCreateDto,
      description: 'Cron job creation payload',
      examples: {
        example1: {
          summary: 'Scheduled job',
          value: {
            name: 'send-reminders',
            cronExpression: '0 9 * * *',
            scheduledAt: 1700000000000,
            startedAt: null,
            completedAt: null,
            status: CronJobStatus.SCHEDULED,
            error: null,
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'Returns the created cron job entity',
      ...CronJobEntityResponse,
    }),
    BadRequestResponse,
  );

export const UpdateCronJobSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Update a cron job',
      description: 'Updates a cron job by id with the provided fields.',
    }),
    ApiBody({
      type: CronJobUpdateDto,
      description: 'Cron job update payload',
      examples: {
        example1: {
          summary: 'Mark running',
          value: {
            status: CronJobStatus.RUNNING,
            startedAt: 1700000001000,
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'Returns the updated cron job entity',
      ...CronJobEntityResponse,
    }),
    BadRequestResponse,
  );

export const SearchCronJobsSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Search cron jobs',
      description: 'Search cron jobs by one or more filter fields.',
    }),
    ApiBody({
      type: CronJobSearchDto,
      description: 'Cron job search filters',
      examples: {
        example1: {
          summary: 'Search by status',
          value: {
            status: [CronJobStatus.SCHEDULED],
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'Returns a list of matching cron job entities',
      schema: {
        type: 'array',
        items: CronJobEntityResponse.schema,
      },
    }),
  );

export const DeleteCronJobSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Delete a cron job',
      description:
        'Deletes a cron job by id. Returns true if deleted, false if not.',
    }),
    ApiOkResponse({
      description: 'Returns true if deleted, false if not',
      schema: {
        type: 'boolean',
        example: true,
      },
    }),
  );
