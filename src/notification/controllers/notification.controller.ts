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
import {
  EntityList,
  INotificationEntity,
  IUserEntity,
} from 'service_reminder_common';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RegistryService } from 'src/shared/services/registry.service';
import { NotificationCreateDto } from '../dtos/notification.create.dto';
import { NotificationSearchDto } from '../dtos/notification.search.dto';
import { NotificationUpdateDto } from '../dtos/notification.update.dto';
import {
  CreateNotificationSwagger,
  DeleteNotificationSwagger,
  SearchNotificationsSwagger,
  UpdateNotificationSwagger,
} from '../notification.swagger';
import { NotificationService } from '../services/notification.service';

@ApiTags(EntityList.NOTIFICATION)
@Controller(EntityList.NOTIFICATION)
export class NotificationController {
  constructor(private readonly registryService: RegistryService) {}

  get notificationService(): NotificationService {
    return this.registryService.get(
      EntityList.NOTIFICATION,
    ) as NotificationService;
  }

  @Post()
  @CreateNotificationSwagger()
  @UseGuards(AuthGuard)
  async createNotification(
    @Body() dto: NotificationCreateDto,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<INotificationEntity> {
    return this.notificationService.createNotification(currentUser, dto);
  }

  @UpdateNotificationSwagger()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateNotification(
    @Param('id') id: string,
    @Body() dto: NotificationUpdateDto,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<INotificationEntity> {
    return this.notificationService.updateNotification(+id, currentUser, dto);
  }

  @SearchNotificationsSwagger()
  @UseGuards(AuthGuard)
  @Post('search')
  async searchNotifications(
    @Body() dto: NotificationSearchDto,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<INotificationEntity[]> {
    return this.notificationService.search(dto, currentUser);
  }

  @DeleteNotificationSwagger()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteNotification(
    @Param('id') id: string,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<boolean> {
    return this.notificationService.deleteNotification(+id, currentUser);
  }
}
