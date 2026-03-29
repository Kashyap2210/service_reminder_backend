import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IRecurringItemEntity } from 'src/common/interfaces/entities/recurring-item.entity.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { EntityList } from 'src/common/utils/entity.utils';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RegistryService } from 'src/shared/services/registry.service';
import { RecurringItemCreateDto } from '../dtos/recurring-item.create.dto';
import { RecurringItemSearchDto } from '../dtos/recurring-item.search.dto';
import { RecurringItemUpdateDto } from '../dtos/recurring-item.update.dto';
import { RecurringItemService } from '../services/recurring-item.service';
import {
  CreateRecurringItemSwagger,
  DeleteRecurringItemSwagger,
  SearchRecurringItemsSwagger,
  UpdateRecurringItemSwagger,
} from '../recurring-item.swagger';

@ApiTags(EntityList.RECURRING_ITEM)
@Controller(EntityList.RECURRING_ITEM)
export class RecurringItemController {
  constructor(private readonly registryService: RegistryService) {}

  get recurringItemService(): RecurringItemService {
    return this.registryService.get(
      EntityList.RECURRING_ITEM,
    ) as RecurringItemService;
  }

  @Post()
  @CreateRecurringItemSwagger()
  @UseGuards(AuthGuard)
  async createRecurringItem(
    @Body() dto: RecurringItemCreateDto,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<IRecurringItemEntity> {
    return this.recurringItemService.createRecurringItem(currentUser, dto);
  }

  @UpdateRecurringItemSwagger()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateRecurringItem(
    @Param('id') id: string,
    @Body() dto: RecurringItemUpdateDto,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<IRecurringItemEntity> {
    return this.recurringItemService.updateRecurringItem(+id, currentUser, dto);
  }

  @SearchRecurringItemsSwagger()
  @UseGuards(AuthGuard)
  @Post('search')
  async searchRecurringItems(
    @Body() dto: RecurringItemSearchDto,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<IRecurringItemEntity[]> {
    return this.recurringItemService.search(dto, currentUser);
  }

  @DeleteRecurringItemSwagger()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteRecurringItem(
    @Param('id') id: string,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<boolean> {
    return this.recurringItemService.deleteRecurringItem(+id, currentUser);
  }
}
