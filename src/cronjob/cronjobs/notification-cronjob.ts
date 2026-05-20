import { Injectable } from '@nestjs/common';
import {
  AppointmentType,
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
  ServicePeriodUnit,
  VendorModel,
} from 'service_reminder_common';
import { IServiceReminderTemplateData } from 'src/mail/templates/template-interfaces/service-reminder.interface';
import { NotificationService } from 'src/notification/services/notification.service';
import { RecurringItemService } from 'src/recurring-item/services/recurring-item.service';
import { EnvVariablesConfig } from 'src/shared/services/env-variables-config.service';
import { RegistryService } from 'src/shared/services/registry.service';
import { UserService } from 'src/user/services/user.service';
import { VendorRecurringItemMappingService } from 'src/vendor/services/vendor-recurring-item-mapping.service';
import { VendorService } from 'src/vendor/services/vendor.service';
import { EntityManager } from 'typeorm';

@Injectable()
export class NotificationDBEntites {
  private currentUser: IUserEntity;
  constructor(
    private readonly registryService: RegistryService,
    private readonly envVariablesConfig: EnvVariablesConfig,
    private readonly entityManager?: EntityManager,
  ) { }

  async getSystemUser() {
    return await this.userService.getSystemUser();
  }

  get recurringItemService(): RecurringItemService {
    return this.registryService.get(
      EntityList.RECURRING_ITEM,
    ) as RecurringItemService;
  }

  get userService(): UserService {
    return this.registryService.get(EntityList.USER) as UserService;
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
    this.currentUser = await this.getSystemUser();
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
      include: {
        serviceType: [AppointmentType.SERVICE],
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
    // console.log('recurringItemFilter', recurringItemFilter);

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
    // console.log(
    //   'baseSearchResConverted',
    //   baseSearchResConverted.entityModelsMap,
    // );
    // console.log(
    //   baseSearchResConverted.entityModelsMap[EntityList.RECURRING_ITEM],
    // );
    // console.log(
    //   baseSearchResConverted.entityModelsMap[EntityList.RECURRING_ITEM][0][
    //     EntityList.SERVICE
    //   ],
    // );

    const recurringItemModels =
      baseSearchResConverted.entityModelsMap[EntityList.RECURRING_ITEM];

    const templateDataForNotification: (IServiceReminderTemplateData | null)[] =
      [];
    const notificationEntity: INotificationEntity[] = [];

    const itemsDue = this.filterItemsDueWithinWindow(recurringItemModels);
    // console.log('itemsDue', itemsDue);
    for (const item of itemsDue) {
      const templateData = this.prepareTemplateDataShapeForNotifications(item);
      // console.log('templateData', templateData);
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

    if (notificationEntity.length > 0) {
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
  }

  prepareTemplateDataShapeForNotifications(
    item: RecurringItemModel,
  ): IServiceReminderTemplateData | null {
    // console.log('item', item);
    const services = item[EntityList.SERVICE];
    // console.log('services', services);
    const latestService = services?.sort(
      (a, b) => Number(b.serviceDate) - Number(a.serviceDate),
    )[0];
    // console.log('latestService', latestService);

    if (!latestService || !latestService.serviceDate) {
      return null;
    }

    // const nextDueDate = new DateCodeUtils(latestService.serviceDate).addMonths(
    //   item.servicePeriod,
    // );

    // AFTER
    const nextDueDate = this.getNextDueDate(
      latestService.serviceDate,
      item.servicePeriod,
      item.servicePeriodUnit,
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
      nextDueDate: new DateCodeUtils(nextDueDate).toLongDateString(),

      vendors: vendors.map((vendor) => ({
        vendorId: vendor.id,
        name: vendor.name,
        contactNo: vendor.contactNo,
        email: vendor.email,
      })),

      lastServiceDate: latestService.serviceDate,
      lastServiceVendorName: lastVendor?.name ?? 'Unknown',
      lastServiceAmount: latestService.serviceAmount,

      baseUrl: this.envVariablesConfig.baseUrl,
      recurringItemId: item.id,
      userId: item.userId,
    };
  }

  // ── private helper ─────────────────────────────────────────────────────────

  private getNextDueDate(
    serviceDateCode: string | number,
    servicePeriod: number,
    servicePeriodUnit: ServicePeriodUnit,
  ): string {
    const utils = new DateCodeUtils(serviceDateCode);

    switch (servicePeriodUnit) {
      case ServicePeriodUnit.DAYS:
        return utils.addDays(servicePeriod);
      case ServicePeriodUnit.WEEKS:
        return utils.addWeeks(servicePeriod);
      case ServicePeriodUnit.MONTHS:
        return utils.addMonths(servicePeriod);
      case ServicePeriodUnit.YEARS:
        return utils.addYears(servicePeriod);
    }
  }

  // ── filter method ──────────────────────────────────────────────────────────

  filterItemsDueWithinWindow(
    recurringItemModels: RecurringItemModel[],
    windowDays: number = 7,
  ): RecurringItemModel[] {
    return recurringItemModels.filter((item) => {
      const services = item[EntityList.SERVICE];

      const latestService = services?.sort(
        (a, b) => Number(b.serviceDate) - Number(a.serviceDate),
      )[0];

      // Never serviced → no due date to compute, skip
      if (!latestService?.serviceDate) {
        return false;
      }

      const nextDueDate = this.getNextDueDate(
        latestService.serviceDate,
        item.servicePeriod,
        item.servicePeriodUnit,
      );

      const daysUntilDue = DateCodeUtils.daysDiff(nextDueDate);

      // Only keep items due today (0) through windowDays (7) from now
      return daysUntilDue >= 0 && daysUntilDue <= windowDays;
    });
  }
}
