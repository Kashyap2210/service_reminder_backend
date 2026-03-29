import { BadRequestException, Injectable } from '@nestjs/common';
import { INotificationEntity } from 'src/common/interfaces/entities/notification.entity.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { EntityList, EntityType } from 'src/common/utils/entity.utils';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { BaseService } from 'src/shared/services/base.service';
import { EntityManager } from 'typeorm';
import { NotificationCreateDto } from '../dtos/notification.create.dto';
import { NotificationUpdateDto } from '../dtos/notification.update.dto';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationCreateTransaction } from '../transactions/notification.create.transaction';
import { NotificationUpdateTransaction } from '../transactions/notification.update.transaction';
import { INotificationCreateTransactionInputData } from '../transactions/interfaces/notification-create-transaction.interface';
import { INotificationUpdateTransactionInputData } from '../transactions/interfaces/notification-update-transaction.interface';

@Injectable()
export class NotificationService extends BaseService<EntityList.NOTIFICATION> {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationCreateTransaction: NotificationCreateTransaction,
    private readonly notificationUpdateTransaction: NotificationUpdateTransaction,
  ) {
    super(EntityList.NOTIFICATION);
  }

  getRepository(
    entityManager?: EntityManager,
  ): EntityManagerBaseService<EntityList.NOTIFICATION> {
    return this.notificationRepository;
  }

  async createNotification(
    currentUser: IUserEntity,
    dto: NotificationCreateDto,
    entityManager?: EntityManager,
  ): Promise<EntityType<EntityList.NOTIFICATION>> {
    const validationResult = await dto.validate(
      currentUser,
      this.registryService,
    );
    if (validationResult) {
      const errors = validationResult;
      throw new BadRequestException(errors[0]);
    }

    const data: INotificationCreateTransactionInputData = {
      dto: dto.toCreateDto(),
      currentUser,
    };

    return this.notificationCreateTransaction.run(data);
  }

  async updateNotification(
    id: number,
    currentUser: IUserEntity,
    dto: NotificationUpdateDto,
    entityManager?: EntityManager,
  ): Promise<EntityType<EntityList.NOTIFICATION>> {
    let existing: INotificationEntity | null = null;
    const validationResult = await dto.validate(
      currentUser,
      this.registryService,
      id,
    );
    if (validationResult) {
      if (Array.isArray(validationResult)) {
        const errors = validationResult;
        throw new BadRequestException(errors[0]);
      } else if (typeof validationResult === 'object') {
        existing = validationResult;
      }
    }

    const data: INotificationUpdateTransactionInputData = {
      id,
      dto: dto.toUpdateDto(),
      currentUser,
      existingEntity: existing!,
    };

    return this.notificationUpdateTransaction.run(data);
  }

  async deleteNotification(
    id: number,
    currentUser: IUserEntity,
    entityManager?: EntityManager,
  ): Promise<boolean> {
    return this.notificationRepository.deleteById(id, entityManager);
  }
}
