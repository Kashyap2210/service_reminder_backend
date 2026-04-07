import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { NotificationStatus } from 'src/common/enums/notification-status.enum';
import { NotificationType } from 'src/common/enums/notification-type.enum';
import {
  NotificationCreateDto,
  NotificationPayloadDto,
} from './dtos/notification.create.dto';
import { NotificationSearchDto } from './dtos/notification.search.dto';
import { NotificationUpdateDto } from './dtos/notification.update.dto';
import { NotificationEntity } from './entities/notification.entity';

const BadRequestResponse = ApiBadRequestResponse({
  description: 'Validation failed',
  schema: {
    properties: {
      statusCode: { type: 'number', example: 400 },
      message: {
        type: 'object',
        properties: {
          key: { type: 'string', example: 'userId' },
          message: {
            type: 'string',
            example: 'User with id: 1 does not exist.',
          },
        },
      },
    },
  },
});

const NotificationEntityResponse = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(NotificationEntity) },
      {
        properties: {
          id: { type: 'number', example: 1 },
          userId: { type: 'number', example: 1 },
          recurringItemId: { type: 'number', example: 1 },
          appointmentId: { type: 'number', example: 1, nullable: true },
          type: {
            type: 'string',
            enum: Object.values(NotificationType),
            example: NotificationType.EMAIL_SERVICE_REMINDER,
          },
          status: {
            type: 'string',
            enum: Object.values(NotificationStatus),
            example: NotificationStatus.PENDING,
          },
          scheduledFor: { type: 'number', example: 1700000000000 },
          sentAt: { type: 'number', example: 1700000001000, nullable: true },
          retryCount: { type: 'number', example: 0 },
          lastError: { type: 'string', nullable: true },
          payload: { $ref: getSchemaPath(NotificationPayloadDto) },
          createdOn: { type: 'number', example: 1700000000000 },
          updatedOn: { type: 'number', example: 1700000000000 },
        },
      },
    ],
  },
};

export const CreateNotificationSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Create a notification',
      description: 'Creates a notification record for delivery scheduling.',
    }),
    ApiBody({
      type: NotificationCreateDto,
      description: 'Notification creation payload',
      examples: {
        example1: {
          summary: 'Email reminder',
          value: {
            userId: 1,
            recurringItemId: 1,
            appointmentId: null,
            type: NotificationType.EMAIL_SERVICE_REMINDER,
            status: NotificationStatus.PENDING,
            scheduledFor: 1700000000000,
            sentAt: null,
            retryCount: 0,
            lastError: null,
            payload: {
              subject: 'Service reminder',
              body: 'Your service is due.',
              recipientEmail: 'user@example.com',
              recipientName: 'Jane Doe',
            },
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'Returns the created notification entity',
      ...NotificationEntityResponse,
    }),
    BadRequestResponse,
  );

export const UpdateNotificationSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Update a notification',
      description: 'Updates a notification by id with the provided fields.',
    }),
    ApiBody({
      type: NotificationUpdateDto,
      description: 'Notification update payload',
      examples: {
        example1: {
          summary: 'Mark sent',
          value: {
            status: NotificationStatus.SENT,
            sentAt: 1700000002000,
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'Returns the updated notification entity',
      ...NotificationEntityResponse,
    }),
    BadRequestResponse,
  );

export const SearchNotificationsSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Search notifications',
      description: 'Search notifications by one or more filter fields.',
    }),
    ApiBody({
      type: NotificationSearchDto,
      description: 'Notification search filters',
      examples: {
        example1: {
          summary: 'Search by status',
          value: {
            status: [NotificationStatus.PENDING],
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'Returns a list of matching notification entities',
      schema: {
        type: 'array',
        items: NotificationEntityResponse.schema,
      },
    }),
  );

export const DeleteNotificationSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Delete a notification',
      description:
        'Deletes a notification by id. Returns true if deleted, false if not.',
    }),
    ApiOkResponse({
      description: 'Returns true if deleted, false if not',
      schema: {
        type: 'boolean',
        example: true,
      },
    }),
  );
