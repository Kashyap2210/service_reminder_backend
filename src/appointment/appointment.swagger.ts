import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { AppointmentCreateDto } from './dtos/appointment.create.dto';
import { AppointmentSearchDto } from './dtos/appointment.search.dto';
import { AppointmentUpdateDto } from './dtos/appointment.update.dto';
import { AppointmentEntity } from './entities/appointment.entity';
import { AppointmentStatus, AppointmentType } from 'service_reminder_common';

const BadRequestResponse = ApiBadRequestResponse({
  description: 'Validation failed',
  schema: {
    properties: {
      statusCode: { type: 'number', example: 400 },
      message: {
        type: 'object',
        properties: {
          key: { type: 'string', example: 'appointmentDate' },
          message: {
            type: 'string',
            example:
              'An appointment for recurring item ID: 1 on date: 20260401 already exists.',
          },
        },
      },
    },
  },
});

const AppointmentEntityResponse = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(AppointmentEntity) },
      {
        properties: {
          id: { type: 'number', example: 1 },
          appointmentDate: { type: 'number', example: 20260401 },
          recurringItemId: { type: 'number', example: 1 },
          userId: { type: 'number', example: 1 },
          appointmentType: {
            type: 'string',
            enum: Object.values(AppointmentType),
            example: AppointmentType.SERVICE,
          },
          vendorId: { type: 'number', example: 2, nullable: true },
          appointmentStatus: {
            type: 'string',
            enum: Object.values(AppointmentStatus),
            example: AppointmentStatus.BOOKED,
          },
          checkPoints: {
            type: 'string',
            example: 'Oil change, Tyre rotation',
            nullable: true,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-01T00:00:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-01T00:00:00.000Z',
          },
        },
      },
    ],
  },
};

export const CreateAppointmentSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Create a new appointment',
      description: 'Creates a new appointment with the provided details.',
    }),
    ApiBody({
      type: AppointmentCreateDto,
      description: 'Appointment creation payload',
      examples: {
        example1: {
          summary: 'Create a service appointment',
          value: {
            appointmentDate: 20260401,
            recurringItemId: 1,
            userId: 1,
            appointmentType: AppointmentType.SERVICE,
            vendorId: 2,
            appointmentStatus: AppointmentStatus.BOOKED,
            checkPoints: 'Oil change, Tyre rotation',
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'Returns the created appointment entity',
      ...AppointmentEntityResponse,
    }),
    BadRequestResponse,
  );

export const UpdateAppointmentSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Update an existing appointment',
      description: 'Updates an appointment by id with the provided fields.',
    }),
    ApiBody({
      type: AppointmentUpdateDto,
      description: 'Appointment update payload',
      examples: {
        example1: {
          summary: 'Update appointment status',
          value: {
            appointmentStatus: AppointmentStatus.BOOKED,
          },
        },
        example2: {
          summary: 'Update appointment date and checkpoints',
          value: {
            appointmentDate: 1700000099999,
            checkPoints: 'Oil change, Brake inspection',
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'Returns the updated appointment entity',
      ...AppointmentEntityResponse,
    }),
    BadRequestResponse,
  );

export const SearchAppointmentsSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Search appointments',
      description: 'Search appointments by one or more filter fields.',
    }),
    ApiBody({
      type: AppointmentSearchDto,
      description: 'Appointment search filters',
      examples: {
        example1: {
          summary: 'Search by status',
          value: {
            appointmentStatus: [AppointmentStatus.BOOKED],
          },
        },
        example2: {
          summary: 'Search by user and type',
          value: {
            userId: [1],
            appointmentType: [AppointmentType.SERVICE],
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'Returns a list of matching appointment entities',
      schema: {
        type: 'array',
        items: AppointmentEntityResponse.schema,
      },
    }),
  );

export const DeleteAppointmentSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Delete an appointment',
      description:
        'Deletes an appointment by id. Returns true if deleted, false if not.',
    }),
    ApiOkResponse({
      description: 'Returns true if deleted, false if not',
      schema: {
        type: 'boolean',
        example: true,
      },
    }),
  );
