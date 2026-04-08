import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { AppointmentType } from 'src/common/enums/appointment-type.enum';
import { ServiceStatus } from 'src/common/enums/service-status.enum';
import { ServiceCreateDto } from './dtos/service.create.dto';
import { ServiceSearchDto } from './dtos/service.search.dto';
import { ServiceUpdateDto } from './dtos/service.update.dto';
import { ServiceEntity } from './entities/service.entity';

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

const ServiceEntityResponse = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(ServiceEntity) },
      {
        properties: {
          id: { type: 'number', example: 1 },
          serviceDate: { type: 'number', example: 20260604 },
          recurringItemId: { type: 'number', example: 1 },
          appointmentId: { type: 'number', example: 1, nullable: true },
          userId: { type: 'number', example: 1 },
          serviceType: {
            type: 'string',
            enum: Object.values(AppointmentType),
            example: AppointmentType.SERVICE,
          },
          serviceStatus: {
            type: 'string',
            enum: Object.values(ServiceStatus),
            example: ServiceStatus.SERVICE_STARTED,
          },
          vendorId: { type: 'number', example: 2, nullable: true },
          serviceEstimate: { type: 'number', example: 199.99, nullable: true },
          serviceAmount: { type: 'number', example: 189.5, nullable: true },
          invoiceDocument: {
            type: 'string',
            example: 'https://example.com/invoice.pdf',
            nullable: true,
          },
          createdOn: { type: 'number', example: 1700000000000 },
          updatedOn: { type: 'number', example: 1700000000000 },
        },
      },
    ],
  },
};

export const CreateServiceSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Create a service record',
      description: 'Creates a new service linked to user and recurring item.',
    }),
    ApiBody({
      type: ServiceCreateDto,
      description: 'Service creation payload',
      examples: {
        example1: {
          summary: 'Create a service',
          value: {
            serviceDate: 20260604,
            recurringItemId: 1,
            appointmentId: null,
            userId: 1,
            serviceType: AppointmentType.SERVICE,
            serviceStatus: ServiceStatus.SERVICE_STARTED,
            vendorId: 2,
            serviceEstimate: 199.99,
            serviceAmount: null,
            invoiceDocument: null,
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'Returns the created service entity',
      ...ServiceEntityResponse,
    }),
    BadRequestResponse,
  );

export const UpdateServiceSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Update a service',
      description: 'Updates a service by id with the provided fields.',
    }),
    ApiBody({
      type: ServiceUpdateDto,
      description: 'Service update payload',
      examples: {
        example1: {
          summary: 'Mark service completed',
          value: {
            serviceStatus: ServiceStatus.COMPLETED,
            serviceAmount: 189.5,
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'Returns the updated service entity',
      ...ServiceEntityResponse,
    }),
    BadRequestResponse,
  );

export const SearchServicesSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Search services',
      description: 'Search services by one or more filter fields.',
    }),
    ApiBody({
      type: ServiceSearchDto,
      description: 'Service search filters',
      examples: {
        example1: {
          summary: 'Search by user',
          value: {
            userId: [1],
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'Returns a list of matching service entities',
      schema: {
        type: 'array',
        items: ServiceEntityResponse.schema,
      },
    }),
  );

export const DeleteServiceSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Delete a service',
      description:
        'Deletes a service by id. Returns true if deleted, false if not.',
    }),
    ApiOkResponse({
      description: 'Returns true if deleted, false if not',
      schema: {
        type: 'boolean',
        example: true,
      },
    }),
  );
