import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  EntityType,
  IEntityFilterData,
  ISearchV2Response,
  IUserEntity,
} from 'service_reminder_common';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { EntitySearchDto } from 'src/shared/dtos/entity-search.dto';
import { RegistryService } from 'src/shared/services/registry.service';
import {
  EntitySearchRequestExample,
  EntitySearchResponseExample,
} from '../swagger/entity-search.examples';

@ApiTags('global-search')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('entity')
export class EntityController {
  constructor(private readonly registryService: RegistryService) {}

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generic entity search' })
  @ApiBody({
    description:
      'Primary entity name + optional filter/projection/relation config',
    examples: {
      recurringItemWithUser: {
        summary: 'Fetch recurring items with related user',
        value: EntitySearchRequestExample,
      },
    },
  })
  @ApiOkResponse({
    description:
      'Keys are EntityList values, values are arrays of that entity records',
    examples: {
      recurringItemWithUser: {
        summary: 'Recurring items with side-loaded user',
        value: EntitySearchResponseExample,
      },
    },
  })
  async search(
    @Body() dto: EntitySearchDto,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<ISearchV2Response> {
    const service = this.registryService.get(dto.name);

    if (!service) {
      throw new BadRequestException({
        key: 'name',
        message: `No service registered for entity "${dto.name}". Ensure the value is a valid EntityList member.`,
      });
    }

    const filter = dto.filter as IEntityFilterData<EntityType<typeof dto.name>>;
    return service.searchV2(filter, currentUser);
  }
}
