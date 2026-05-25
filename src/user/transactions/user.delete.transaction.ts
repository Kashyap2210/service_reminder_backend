import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EntityFilterDataHelper, EntityList } from 'service_reminder_common';
import { RegistryService } from 'src/shared/services/registry.service';
import { BaseTransaction } from 'src/shared/transactions/base.transaction';
import { DataSource, EntityManager } from 'typeorm';
import { UserService } from '../services/user.service';
import {
  IUserDeleteTransactionInputData,
  IUserDeleteTransactionOutputData,
} from './interfaces/user-delete-transaction.interface';

@Injectable()
export class UserDeleteTransaction extends BaseTransaction<
  IUserDeleteTransactionInputData,
  IUserDeleteTransactionOutputData
> {
  constructor(
    @Inject(DataSource) dataSource: DataSource,
    private readonly registryService: RegistryService,
  ) {
    super(dataSource);
  }

  get userService(): UserService {
    return this.registryService.get(EntityList.USER) as UserService;
  }

  protected async execute(
    data: IUserDeleteTransactionInputData,
    manager: EntityManager,
  ): Promise<IUserDeleteTransactionOutputData> {
    const { id, currentUser } = data;

    const searchResponse = await this.userService.searchV2(
      {
        include: {
          id: [id],
        },
        relations: [
          {
            name: EntityList.APPOINTMENT,
            // columnKeys: ['id']
          },
          {
            name: EntityList.NOTIFICATION,
            // columnKeys: ['id']
          },
          {
            name: EntityList.SERVICE,
            // columnKeys: ['id']
          },
          // {
          //   name: EntityList.VENDOR,
          //   //  columnKeys: ['id']
          // },
          {
            name: EntityList.RECURRING_ITEM,
            relations: [
              {
                name: EntityList.VENDOR_RECURRING_ITEM_MAPPING,
                relations: [
                  {
                    name: EntityList.VENDOR,
                  },
                ],
              },
            ],
          },
        ],
      },
      currentUser,
      manager,
    );

    const filterDataHelper = new EntityFilterDataHelper(searchResponse);
    filterDataHelper.populateRelationsFor([
      EntityList.VENDOR,
      EntityList.VENDOR_RECURRING_ITEM_MAPPING,
      EntityList.RECURRING_ITEM,
      EntityList.USER,
    ]);

    const user = filterDataHelper.entityModelsMap[EntityList.USER][0];
    console.log('user', user);

    if (!user) {
      throw new BadRequestException({
        key: 'id',
        message: `User with id ${id} not found`,
      });
    }

    await this.userService.sendUserDeleteNotification(user);

    const deletionConfig: Array<{ entity: EntityList; ids: number[] }> = [
      { entity: EntityList.SERVICE, ids: user.serviceIds },
      { entity: EntityList.NOTIFICATION, ids: user.notificationIds },
      { entity: EntityList.APPOINTMENT, ids: user.appointmentIds },
      {
        entity: EntityList.VENDOR_RECURRING_ITEM_MAPPING,
        ids: user.vendorRecurringItemMappingIds,
      },
      { entity: EntityList.VENDOR, ids: user.vendorIds },
      { entity: EntityList.RECURRING_ITEM, ids: user.recurringItemIds },
    ];

    console.log('deleteConfig', deletionConfig);

    await Promise.all(
      deletionConfig
        .filter(({ ids }) => ids.length)
        .map(({ entity, ids }) =>
          this.registryService
            .get(entity)
            .deleteByIdsBase(currentUser, ids, manager),
        ),
    );

    // throw new BadRequestException('Error');

    await this.userService.deleteByIdsBase(currentUser, [id], manager);

    return true;
  }
}
