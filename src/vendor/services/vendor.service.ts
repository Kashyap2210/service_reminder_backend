import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DateCodeUtils,
  EntityFilterDataHelper,
  EntityList,
  EntityType,
  IEntityFilterIncludeData,
  IUserEntity,
  IVendorEntity,
  IVendorRecurringItemMappingCreateDto,
  diffArrays,
} from 'service_reminder_common';
import { MailService } from 'src/mail/services/mail.service';
import { IMailData } from 'src/mail/templates/template-interfaces/mail-data.interface';
import { IVendorCreated } from 'src/mail/templates/template-interfaces/vendor-created.interface';
import { EmailTemplate } from 'src/mail/utils/email-template.enum';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { BaseService } from 'src/shared/services/base.service';
import { EnvVariablesConfig } from 'src/shared/services/env-variables-config.service';
import { EntityManager } from 'typeorm';
import { VendorCreateDto } from '../dtos/vendor.create.dto';
import { VendorUpdateDto } from '../dtos/vendor.update.dto';
import { VendorRepository } from '../repositories/vendor.repository';
import { IVendorCreateTransactionInputData } from '../transactions/interfaces/vendor-create-transaction.interface';
import { IVendorUpdateTransactionInputData } from '../transactions/interfaces/vendor-update-transaction.interface';
import { VendorCreateTransaction } from '../transactions/vendor.create.transaction';
import { VendorUpdateTransaction } from '../transactions/vendor.update.transaction';
import { VendorHistoryService } from './vendor-history.service';
import { VendorRecurringItemMappingService } from './vendor-recurring-item-mapping.service';

@Injectable()
export class VendorService extends BaseService<EntityList.VENDOR> {
  constructor(
    private readonly vendorRepository: VendorRepository,
    private readonly mailService: MailService,
    private readonly envVariablesConfig: EnvVariablesConfig,
    private readonly vendorCreateTransaction: VendorCreateTransaction,
    private readonly vendorUpdateTransaction: VendorUpdateTransaction,
  ) {
    super(EntityList.VENDOR);
  }

  get vendorRecurringItemMappingService(): VendorRecurringItemMappingService {
    return this.registryService.get(
      EntityList.VENDOR_RECURRING_ITEM_MAPPING,
    ) as VendorRecurringItemMappingService;
  }

  get vendorHistoryService(): VendorHistoryService {
    return this.registryService.get(
      EntityList.VENDOR_HISTORY,
    ) as VendorHistoryService;
  }

  getRepository(
    entityManager?: EntityManager,
  ): EntityManagerBaseService<EntityList.VENDOR> {
    return this.vendorRepository;
  }

  async createVendor(
    currentUser: IUserEntity,
    dto: VendorCreateDto,
    entityManager?: EntityManager,
  ): Promise<EntityType<EntityList.VENDOR>> {
    const validationResult = await dto.validate(
      currentUser,
      this.registryService,
    );
    if (validationResult) {
      const errors = validationResult;
      throw new BadRequestException(errors[0]);
    }

    const data: IVendorCreateTransactionInputData = {
      dto,
      currentUser,
    };

    return this.vendorCreateTransaction.run(data);
  }

  async updateVendor(
    id: number,
    currentUser: IUserEntity,
    dto: VendorUpdateDto,
    entityManager?: EntityManager,
  ): Promise<EntityType<EntityList.VENDOR>> {
    let existingVendor: IVendorEntity | null = null;
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
        existingVendor = validationResult;
      }
    }

    let mappingsToCreate: number[] = [];
    let mappingsToDelete: number[] = [];

    if (dto.recurringItemIds?.length > 0) {
      const mappings = await this.getMappingsToCreateDelete(
        currentUser,
        id,
        dto,
        entityManager,
      );
      mappingsToCreate = mappings.mappingsToCreate;
      mappingsToDelete = mappings.mappingsToDelete;
    }

    const data: IVendorUpdateTransactionInputData = {
      id,
      dto,
      currentUser,
      existingEntity: existingVendor!,
      mappingsToCreate,
      mappingsToDelete,
    };

    return this.vendorUpdateTransaction.run(data);
  }

  async deleteVendor(
    id: number,
    currentUser: IUserEntity,
    entityManager?: EntityManager,
  ): Promise<boolean> {
    return this.vendorRepository.deleteById(id, entityManager);
  }

  async createVendorRecurringItemMappingEntities(
    currentUser: IUserEntity,
    dtos: IVendorRecurringItemMappingCreateDto[],
    manager: EntityManager,
  ) {
    await Promise.all(
      dtos.map((dto) => {
        this.vendorRecurringItemMappingService.createVendorRecurringItemMapping(
          dto,
          currentUser,
          manager,
        );
      }),
    );
  }

  async deleteVendorRecurringItemMappingEntities(
    currentUser: IUserEntity,
    mappingsToDeleteIds: number[],
    entityManager?: EntityManager,
  ) {
    return this.registryService
      .get(EntityList.VENDOR_RECURRING_ITEM_MAPPING)
      .deleteByIdsBase(currentUser, mappingsToDeleteIds, entityManager);
  }

  async getMappingsToCreateDelete(
    currentUser: IUserEntity,
    vendorId: number,
    dto: VendorUpdateDto,
    entityManager?: EntityManager,
  ): Promise<{
    mappingsToCreate: number[];
    mappingsToDelete: number[];
  }> {
    const existingVendorRecurringItemMappings =
      await this.vendorRecurringItemMappingService.search(
        {
          vendorId: [vendorId],
        },
        currentUser,
        entityManager,
      );
    const { present, added, deleted } = diffArrays(
      existingVendorRecurringItemMappings.map(
        (mapping) => mapping.recurringItemId,
      ),
      dto.recurringItemIds,
    );

    let mappingsToDelete: number[] = [];
    if (deleted.length > 0) {
      mappingsToDelete = existingVendorRecurringItemMappings
        .filter((mapping) => deleted.includes(mapping.recurringItemId))
        .map((mapping) => mapping.id);
    }

    return {
      mappingsToCreate: added,
      mappingsToDelete,
    };
  }

  async sendVendorCreatedNotification(
    currentUser: IUserEntity,
    vendor: IVendorEntity,
    entityManager?: EntityManager,
  ): Promise<void> {
    const userEntity = await this.getSupportingEntities(
      vendor,
      currentUser,
      entityManager,
    );

    const mailData: IMailData = {
      toEmail: [userEntity.email],
      fromEmail: this.envVariablesConfig.mailFrom,
      subject: 'Vendor Created',
    };

    const vendorCreatedTemplateData: IVendorCreated = {
      name: vendor.name,
      contactNo: vendor.contactNo,
      email: vendor.email ?? undefined,
      address: vendor.address,
      userName: userEntity.name,
      year: DateCodeUtils.getCurrentYear(),
    };

    await this.mailService.sendNotification(
      EmailTemplate.VENDOR_CREATED,
      mailData,
      vendorCreatedTemplateData,
    );
  }

  private async getSupportingEntities(
    vendor: IVendorEntity,
    currentUser: IUserEntity,
    entityManager?: EntityManager,
  ) {
    const userEntityInclude: IEntityFilterIncludeData<EntityList.USER> = {
      name: EntityList.USER,
      include: {
        id: [vendor.userId],
        columnKeys: ['id', 'name', 'email'],
      },
    };

    const searchResponse = await this.searchV2(
      {
        id: [-1],
        entities: [userEntityInclude],
      },
      currentUser,
      entityManager,
    );

    const searchResHelper = new EntityFilterDataHelper(searchResponse);

    const userEntity = searchResHelper.getEntityModelByFilter(EntityList.USER, {
      key: 'id',
      value: vendor.userId,
    });
    return userEntity;
  }
}
