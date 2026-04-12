import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { VendorCreateDto } from './dtos/vendor.create.dto';
import { VendorSearchDto } from './dtos/vendor.search.dto';
import { VendorUpdateDto } from './dtos/vendor.update.dto';
import { VendorEntity } from './entities/vendor.entity';

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

const VendorEntityResponse = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(VendorEntity) },
      {
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'ACME Service Center' },
          contactNo: { type: 'string', example: '+1234567890' },
          email: {
            type: 'string',
            example: 'vendor@example.com',
            nullable: true,
          },
          recurringItemId: { type: 'number', example: 1 },
          userId: { type: 'number', example: 1 },
          createdOn: { type: 'number', example: 1700000000000 },
          updatedOn: { type: 'number', example: 1700000000000 },
        },
      },
    ],
  },
};

export const CreateVendorSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Create a vendor',
      description: 'Creates a vendor linked to a user and recurring item.',
    }),
    ApiBody({
      type: VendorCreateDto,
      description: 'Vendor creation payload',
      examples: {
        example1: {
          summary: 'Create a vendor',
          value: {
            name: 'ACME Service Center',
            contactNo: '+1234567890',
            email: 'vendor@example.com',
            recurringItemId: 1,
            userId: 1,
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'Returns the created vendor entity',
      ...VendorEntityResponse,
    }),
    BadRequestResponse,
  );

export const UpdateVendorSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Update a vendor',
      description: 'Updates a vendor by id with the provided fields.',
    }),
    ApiBody({
      type: VendorUpdateDto,
      description: 'Vendor update payload',
      examples: {
        example1: {
          summary: 'Update contact',
          value: {
            contactNo: '+1987654321',
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'Returns the updated vendor entity',
      ...VendorEntityResponse,
    }),
    BadRequestResponse,
  );

export const SearchVendorsSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Search vendors',
      description: 'Search vendors by one or more filter fields.',
    }),
    ApiBody({
      type: VendorSearchDto,
      description: 'Vendor search filters',
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
      description: 'Returns a list of matching vendor entities',
      schema: {
        type: 'array',
        items: VendorEntityResponse.schema,
      },
    }),
  );

export const DeleteVendorSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Delete a vendor',
      description:
        'Deletes a vendor by id. Returns true if deleted, false if not.',
    }),
    ApiOkResponse({
      description: 'Returns true if deleted, false if not',
      schema: {
        type: 'boolean',
        example: true,
      },
    }),
  );
