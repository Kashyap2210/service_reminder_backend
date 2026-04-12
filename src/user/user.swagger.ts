// user.swagger.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserCreateDto } from './dtos/user.create.dto';
import { UserSearchDto } from './dtos/user.search.dto';
import { UserUpdateDto } from './dtos/user.update.dto';
import { UserEntity } from './entities/user.entity';
import { UserRole } from 'service_reminder_common';

const BadRequestResponse = ApiBadRequestResponse({
  description: 'Validation failed',
  schema: {
    properties: {
      statusCode: { type: 'number', example: 400 },
      message: {
        type: 'object',
        properties: {
          key: { type: 'string', example: 'email' },
          message: {
            type: 'string',
            example: 'User with email: john.doe@example.com already exists.',
          },
        },
      },
    },
  },
});

const UserEntityResponse = {
  schema: {
    allOf: [
      { $ref: getSchemaPath(UserEntity) },
      {
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', example: 'john.doe@example.com' },
          contactNo: { type: 'string', example: '+1234567890' },
          role: {
            type: 'string',
            enum: Object.values(UserRole),
            example: UserRole.ADMIN,
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

export const CreateUserSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create a new user',
      description: 'Creates a new user with the provided details.',
    }),
    ApiBody({
      type: UserCreateDto,
      description: 'User creation payload',
      examples: {
        example1: {
          summary: 'Create an admin user',
          value: {
            name: 'John Doe',
            password: 'P@ssw0rd123',
            contactNo: '+1234567890',
            email: 'john.doe@example.com',
            role: UserRole.ADMIN,
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'Returns the created user entity',
      ...UserEntityResponse,
    }),
    BadRequestResponse,
  );

export const UpdateUserSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Update an existing user',
      description: 'Updates a user by id with the provided fields.',
    }),
    ApiBody({
      type: UserUpdateDto,
      description: 'User update payload',
      examples: {
        example1: {
          summary: 'Update user name and email',
          value: {
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'Returns the updated user entity',
      ...UserEntityResponse,
    }),
    BadRequestResponse,
  );

export const SearchUsersSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Search users',
      description: 'Search users by one or more filter fields.',
    }),
    ApiBody({
      type: UserSearchDto,
      description: 'User search filters',
      examples: {
        example1: {
          summary: 'Search by role',
          value: {
            role: [UserRole.ADMIN],
          },
        },
        example2: {
          summary: 'Search by email',
          value: {
            email: ['john.doe@example.com'],
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'Returns a list of matching user entities',
      schema: {
        type: 'array',
        items: UserEntityResponse.schema,
      },
    }),
  );

export const DeleteUserSwagger = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Delete a user',
      description:
        'Deletes a user by id. Returns true if deleted, false if not.',
    }),
    ApiOkResponse({
      description: 'Returns true if deleted, false if not',
      schema: {
        type: 'boolean',
        example: true,
      },
    }),
  );
