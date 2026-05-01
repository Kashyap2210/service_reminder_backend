// src/users/services/user.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import {
  DateCodeUtils,
  EntityList,
  EntityType,
  IUserEntity,
  UserRole,
} from 'service_reminder_common';
import { MailService } from 'src/mail/services/mail.service';
import { IMailData } from 'src/mail/templates/template-interfaces/mail-data.interface';
import { IUserSignUp } from 'src/mail/templates/template-interfaces/user-signup.interface';
import { EmailTemplate } from 'src/mail/utils/email-template.enum';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { BaseService } from 'src/shared/services/base.service';
import { EnvVariablesConfig } from 'src/shared/services/env-variables-config.service';
import { EntityManager } from 'typeorm';
import { UserCreateDto } from '../dtos/user.create.dto';
import { UserUpdateDto } from '../dtos/user.update.dto';
import { UserRepository } from '../repositories/user.repository';
import { IUserCreateTransactionInputData } from '../transactions/interfaces/user-create-transaction.interface';
import { IUserUpdateTransactionInputData } from '../transactions/interfaces/user-update-transaction.interface';
import { UserCreateTransaction } from '../transactions/user.create.transaction';
import { UserUpdateTransaction } from '../transactions/user.update.transaction';
import { UserHistoryService } from './user-history.service';

@Injectable()
export class UserService extends BaseService<EntityList.USER> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly mailServie: MailService,
    private readonly envVariablesConfig: EnvVariablesConfig,

    private readonly userCreateTransaction: UserCreateTransaction,
    private readonly userUpdateTransaction: UserUpdateTransaction,
  ) {
    super(EntityList.USER);
  }

  get userHistoryService(): UserHistoryService {
    return this.registryService.get(
      EntityList.USER_HISTORY,
    ) as UserHistoryService;
  }

  getRepository(
    entityManager?: EntityManager,
  ): EntityManagerBaseService<EntityList.USER> {
    return this.userRepository;
  }

  async createUser(dto: UserCreateDto, entityManager?: EntityManager) {
    // here we will require system user
    const systemUser = await this.getSystemUser();

    const validationResult = await dto.validate(
      systemUser,
      this.registryService,
    );
    if (validationResult) {
      const errors = validationResult;
      throw new BadRequestException(errors[0]);
    }

    const data: IUserCreateTransactionInputData = {
      dto: {
        ...dto.toCreateDto(),
        password: await bcrypt.hash(dto.password, 10),
      },
      currentUser: systemUser,
    };

    return this.userCreateTransaction.run(data);
  }

  async updateUser(
    id: number,
    currentUser: IUserEntity,
    dto: UserUpdateDto,
    entityManager?: EntityManager,
  ) {
    let existingUser: IUserEntity | null = null;
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
        existingUser = validationResult;
      }
    }

    let updatedPassword = '';
    if (dto.password) {
      updatedPassword = await bcrypt.hash(dto.password, 10);
    }

    const data: IUserUpdateTransactionInputData = {
      id,
      dto: {
        ...dto.toUpdateDto(),
        ...(dto.password ? { password: updatedPassword } : {}),
      },
      currentUser,
      existingEntity: existingUser!, // <== User will always be there as we throw error from dto
    };

    return this.userUpdateTransaction.run(data);
  }

  async deleteUser(
    id: number,
    currentUser: IUserEntity,
    entityManager?: EntityManager,
  ) {
    return this.userRepository.deleteById(id, entityManager);
  }

  async getSystemUser(
    entityManager?: EntityManager,
  ): Promise<EntityType<EntityList.USER>> {
    const userId = this.configService.get('SYSTEM_USER_ID')!;
    const systemUser = (
      await this.search(
        {
          id: [Number(userId)],
          role: [UserRole.ADMIN],
        },
        undefined,
        entityManager,
      )
    )[0];
    return systemUser;
  }

  async sendUserCreateNotification(newUser: IUserEntity) {
    const mailData: IMailData = {
      toEmail: [newUser.email],
      fromEmail: this.envVariablesConfig.mailFrom,
      subject: 'Registration Successful',
    };

    const userSignUpTemplateData: IUserSignUp = {
      name: newUser.name,
      email: newUser.email,
      contactNo: newUser.contactNo,
      year: DateCodeUtils.getCurrentYear(),
    };

    await this.mailServie.sendNotification(
      EmailTemplate.USER_SIGNUP,
      mailData,
      userSignUpTemplateData,
    );
  }
}
