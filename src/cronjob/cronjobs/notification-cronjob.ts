import { Injectable } from '@nestjs/common';
import {
  DateCodeUtils,
  EntityFilterDataHelper,
  EntityList,
  IEntityFilterSearchData,
  INotificationEntity,
  IRecurringItemSearchDto,
  IUserEntity,
  NotificationModel,
  OrderByDirection,
  RecurringItemModel,
  VendorModel,
} from 'service_reminder_common';
import { IServiceReminderTemplateData } from 'src/mail/templates/template-interfaces/service-reminder.interface';
import { NotificationService } from 'src/notification/services/notification.service';
import { RecurringItemService } from 'src/recurring-item/services/recurring-item.service';
import { RegistryService } from 'src/shared/services/registry.service';
import { VendorRecurringItemMappingService } from 'src/vendor/services/vendor-recurring-item-mapping.service';
import { VendorService } from 'src/vendor/services/vendor.service';
import { EntityManager } from 'typeorm';

@Injectable()
export class NotificationDBEntites {
  constructor(
    private readonly registryService: RegistryService,
    private readonly currentUser: IUserEntity,
    private readonly entityManager?: EntityManager,
  ) {}

  get recurringItemService(): RecurringItemService {
    return this.registryService.get(
      EntityList.RECURRING_ITEM,
    ) as RecurringItemService;
  }

  get vendorRecurringItemMappingService(): VendorRecurringItemMappingService {
    return this.registryService.get(
      EntityList.VENDOR_RECURRING_ITEM_MAPPING,
    ) as VendorRecurringItemMappingService;
  }

  get vendorService(): VendorService {
    return this.registryService.get(EntityList.VENDOR) as VendorService;
  }

  get notificationService(): NotificationService {
    return this.registryService.get(
      EntityList.NOTIFICATION,
    ) as NotificationService;
  }

  async prepareNotificationEntities() {
    // we will bring all the recurring items
    // we will bring all the service entities
    const userIncludeRelations: IEntityFilterSearchData<EntityList.USER> = {
      name: EntityList.USER,
    };

    const serviceIncludeRelations: IEntityFilterSearchData<EntityList.SERVICE> =
      {
        name: EntityList.SERVICE,
        orderBy: {
          serviceDate: OrderByDirection.DESC,
        },
      };

    const vendorIncludeRelations: IEntityFilterSearchData<EntityList.VENDOR> = {
      name: EntityList.VENDOR,
    };
    const vendorRecurringItemIncludeRelations: IEntityFilterSearchData<EntityList.VENDOR_RECURRING_ITEM_MAPPING> =
      {
        name: EntityList.VENDOR_RECURRING_ITEM_MAPPING,
        relations: [vendorIncludeRelations],
      };

    const recurringItemFilter: IRecurringItemSearchDto = {
      relations: [
        vendorRecurringItemIncludeRelations,
        serviceIncludeRelations,
        userIncludeRelations,
      ],
    };
    console.log('recurringItemFilter', recurringItemFilter);

    const baseSearchRes = await this.recurringItemService.searchV2(
      recurringItemFilter,
      this.currentUser,
      this.entityManager,
    );

    const baseSearchResConverted = new EntityFilterDataHelper(baseSearchRes);
    baseSearchResConverted.populateRelationsFor([
      EntityList.RECURRING_ITEM,
      EntityList.SERVICE,
      EntityList.VENDOR,
      EntityList.USER,
    ]);
    console.log(
      'baseSearchResConverted',
      baseSearchResConverted.entityModelsMap,
    );
    console.log(
      baseSearchResConverted.entityModelsMap[EntityList.RECURRING_ITEM],
    );
    console.log(
      baseSearchResConverted.entityModelsMap[EntityList.RECURRING_ITEM][0][
        EntityList.SERVICE
      ],
    );

    const recurringItemModels =
      baseSearchResConverted.entityModelsMap[EntityList.RECURRING_ITEM];

    const templateDataForNotification: (IServiceReminderTemplateData | null)[] =
      [];
    const notificationEntity: INotificationEntity[] = [];

    for (const item of recurringItemModels) {
      const templateData = this.prepareTemplateDataShapeForNotifications(item);
      console.log('templateData', templateData);
      if (!templateData) continue;

      templateDataForNotification.push(templateData);
      notificationEntity.push(
        NotificationModel.getNewNotificationEntity(this.currentUser, item, {
          subject: `${item.name} - Upcoming Service`,
          body: JSON.stringify(templateData),
          recipientEmail: item.user?.email ?? '',
          recipientName: item.user?.name ?? '',
        }),
      );
    }

    console.log('notificationEntity', notificationEntity);

    const notificationEntityInstances = await Promise.all(
      notificationEntity.map(async (entity) => {
        return this.notificationService.getInstanceBase(
          this.currentUser,
          entity,
          this.entityManager,
        );
      }),
    );
    console.log('notificationEntityInstances', notificationEntityInstances);

    const notificationEntitiesToBeSent =
      await this.notificationService.createBulkBase(
        this.currentUser,
        notificationEntityInstances,
        this.entityManager,
      );
    console.log('notificationEntitiesToBeSent', notificationEntitiesToBeSent);
  }

  prepareTemplateDataShapeForNotifications(
    item: RecurringItemModel,
  ): IServiceReminderTemplateData | null {
    console.log('item', item);
    const services = item[EntityList.SERVICE];
    console.log('services', services);
    const latestService = services?.sort(
      (a, b) => Number(b.serviceDate) - Number(a.serviceDate),
    )[0];
    console.log('latestService', latestService);

    if (!latestService || !latestService.serviceDate) {
      return null;
    }

    const nextDueDate = new DateCodeUtils(latestService.serviceDate).addMonths(
      item.servicePeriod,
    );

    const daysUntilDue = DateCodeUtils.daysDiff(nextDueDate);

    const vendors =
      item[EntityList.VENDOR_RECURRING_ITEM_MAPPING]
        ?.map((mapping) => mapping[EntityList.VENDOR])
        .filter((v): v is VendorModel => v !== undefined) ?? [];

    const lastVendor = latestService[EntityList.VENDOR];

    return {
      recipientName: item[EntityList.USER]?.name ?? 'User',
      recurringItemName: item.name,
      daysUntilDue,
      nextDueDate,

      vendors: vendors.map((vendor) => ({
        name: vendor.name,
        contactNo: vendor.contactNo,
        email: vendor.email,
      })),

      lastServiceDate: latestService.serviceDate,
      lastServiceVendorName: lastVendor?.name ?? 'Unknown',
      lastServiceAmount: latestService.serviceAmount,
    };
  }

  // prepareTemplateDataShapeForNotifications(
  //   item: RecurringItemModel,
  // ): IServiceReminderTemplateData | null {
  //   const latestService = item.latestService;

  //   // Guard: no service → no notification
  //   if (!latestService || !latestService.serviceDate) {
  //     return null;
  //   }

  //   const nextDueDate = new DateCodeUtils(latestService.serviceDate).addMonths(
  //     item.servicePeriod,
  //   );

  //   const daysUntilDue = DateCodeUtils.daysDiff(nextDueDate);

  //   const lastVendor = item.vendors?.find(
  //     (vendor) => vendor.id === latestService.vendorId,
  //   );

  //   return {
  //     recipientName: item.user?.name ?? 'User',
  //     recurringItemName: item.name,
  //     daysUntilDue,
  //     nextDueDate,

  //     vendors:
  //       item.vendors?.map((vendor) => ({
  //         name: vendor.name,
  //         contactNo: vendor.contactNo,
  //         email: vendor.email,
  //       })) ?? [],

  //     lastServiceDate: latestService.serviceDate,
  //     lastServiceVendorName: lastVendor?.name ?? 'Unknown',
  //     lastServiceAmount: latestService.serviceAmount,
  //   };
  // }
}

// group services by recurringItemId
// here all the service models are sorted in descending order for the serviceDate
// as they are called by default from db in that way
// const serviceModels = baseSearchResConverted.getEntityFromList(
//   EntityList.SERVICE,
// );

// const serviceModelsGroupByRecurringItemId = groupBy(
//   serviceModels,
//   'recurringItemId',
// );

// const recurringItemModels = baseSearchResConverted.getEntityFromList(
//   EntityList.RECURRING_ITEM,
// );

// // loop over all the recurring items and store services on them
// for (const item of recurringItemModels) {
//   item.services = serviceModelsGroupByRecurringItemId.get(`${item.id}`);
// }

// // now at this point i have all the recurringItemModels with their services populated
// // there is a method on the recurringItemModel that is a getter latestService
// // it will give us the latest service that can be used in the notification

// // now we want all the vendors from the recurringItems
// // we can achieve that by bringing all the vendor-recurringItemId mappings
// // then we will bring all the vendor from that for each recurring item ids

// const userEntityInclude: IEntityFilterSearchData<EntityList.USER> = {
//   name: EntityList.USER,
//   include: {
//     id: RecurringItemModel.getRecurringItemUserIds(recurringItemModels),
//   },
// };

// const vendorRecurringItemMappingsSearchRes =
//   await this.vendorRecurringItemMappingService.searchV2(
//     {
//       recurringItemId:
//         RecurringItemModel.getRecurringItemIds(recurringItemModels),
//       columnKeys: ['vendorId', 'recurringItemId'],
//       entities: [userEntityInclude],
//     },
//     this.currentUser,
//     this.entityManager,
//   );

// const userModels = new EntityFilterDataHelper(
//   vendorRecurringItemMappingsSearchRes,
// ).getEntityFromList(EntityList.USER);

// const vendorModels = await this.vendorService.searchV2(
//   {
//     id: [
//       ...new Set([
//         ...VendorRecurringItemMappingModel.vendorIds(
//           vendorRecurringItemMappingsSearchRes[
//             EntityList.VENDOR_RECURRING_ITEM_MAPPING
//           ] ?? [],
//         ),
//         ...serviceModels.map((model) => model.vendorId),
//       ]),
//     ],
//   },
//   this.currentUser,
//   this.entityManager,
// );

// RecurringItemModel.populateRelations(
//   recurringItemModels,
//   userModels,
//   serviceModels,
//   vendorModels[EntityList.VENDOR] ?? [],
//   vendorRecurringItemMappingsSearchRes[
//     EntityList.VENDOR_RECURRING_ITEM_MAPPING
//   ] ?? [],
// );

// const templateDataForNotification: (IServiceReminderTemplateData | null)[] =
//   [];

// const notificationEntity: INotificationEntity[] = [];

// for (const item of recurringItemModels) {
//   const templateData = this.prepareTemplateDataShapeForNotifications(item);
//   if (!templateData) continue;

//   templateDataForNotification.push(templateData);
//   notificationEntity.push(
//     NotificationModel.getNewNotificationEntity(item, {
//       subject: `${item.name} - Upcoming Service`,
//       body: JSON.stringify(templateData),
//       recipientEmail: item.user?.email ?? '',
//       recipientName: item.user?.name ?? '',
//     }),
//   );
// }

// const notificationEntityInstances = await Promise.all(
//   notificationEntity.map(async (entity) => {
//     return this.notificationService.getInstanceBase(
//       this.currentUser,
//       entity,
//       this.entityManager,
//     );
//   }),
// );
// await this.notificationService.createBulkBase(
//   this.currentUser,
//   notificationEntityInstances,
//   this.entityManager,
// );
