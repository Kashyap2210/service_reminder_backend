import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { ServicePeriodUnit } from 'src/common/enums/service-period-unit.enum';
import { RecurringItemCreateDto } from './dtos/recurring-item.create.dto';
import { RecurringItemSearchDto } from './dtos/recurring-item.search.dto';
import { RecurringItemUpdateDto } from './dtos/recurring-item.update.dto';
import { RecurringItemEntity } from './entities/recurring-item.entity';

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

const RecurringItemEntityResponse = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(RecurringItemEntity) },
      {
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Annual vehicle service' },
          type: { type: 'string', example: 'vehicle' },
          companyName: {
            type: 'string',
            example: 'ACME Motors',
            nullable: true,
          },
          vendorId: { type: 'number', example: 2, nullable: true },
          servicePeriod: { type: 'number', example: 6 },
          servicePeriodUnit: {
            type: 'string',
            enum: Object.values(ServicePeriodUnit),
            example: ServicePeriodUnit.MONTHS,
          },
          servicePlaceAddress: {
            type: 'string',
            example: '123 Main St',
            nullable: true,
          },
          userId: { type: 'number', example: 1 },
          createdOn: { type: 'number', example: 1700000000000 },
          updatedOn: { type: 'number', example: 1700000000000 },
        },
      },
    ],
  },
};

export const CreateRecurringItemSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Create a recurring item',
      description: 'Creates a new recurring item for a user.',
    }),
    ApiBody({
      type: RecurringItemCreateDto,
      description: 'Recurring item creation payload',
      examples: {
        example1: {
          summary: 'Create a recurring service item',
          value: {
            name: 'Annual vehicle service',
            type: 'vehicle',
            companyName: 'ACME Motors',
            // vendorId: 2,
            servicePeriod: 6,
            servicePeriodUnit: ServicePeriodUnit.MONTHS,
            servicePlaceAddress: '123 Main St',
            userId: 1,
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'Returns the created recurring item entity',
      ...RecurringItemEntityResponse,
    }),
    BadRequestResponse,
  );

export const UpdateRecurringItemSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Update a recurring item',
      description: 'Updates a recurring item by id with the provided fields.',
    }),
    ApiBody({
      type: RecurringItemUpdateDto,
      description: 'Recurring item update payload',
      examples: {
        example1: {
          summary: 'Update service period',
          value: {
            servicePeriod: 12,
            servicePeriodUnit: ServicePeriodUnit.MONTHS,
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'Returns the updated recurring item entity',
      ...RecurringItemEntityResponse,
    }),
    BadRequestResponse,
  );

export const SearchRecurringItemsSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Search recurring items',
      description: 'Search recurring items by one or more filter fields.',
    }),
    ApiBody({
      type: RecurringItemSearchDto,
      description: 'Recurring item search filters',
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
      description: 'Returns a list of matching recurring item entities',
      schema: {
        type: 'array',
        items: RecurringItemEntityResponse.schema,
      },
    }),
  );

export const DeleteRecurringItemSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Delete a recurring item',
      description:
        'Deletes a recurring item by id. Returns true if deleted, false if not.',
    }),
    ApiOkResponse({
      description: 'Returns true if deleted, false if not',
      schema: {
        type: 'boolean',
        example: true,
      },
    }),
  );
