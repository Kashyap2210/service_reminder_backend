// src/users/services/user.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EntityHistoryOperation } from 'src/common/enums/entity-history-operation.enum';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { EntityList } from 'src/common/utils/entity.utils';
import { EntityManagerBaseService } from 'src/shared/repositories/entity.base.manager';
import { BaseService } from 'src/shared/services/base.service';
import { EntityManager } from 'typeorm';
import { UserCreateDto } from '../dtos/user.create.dto';
import { UserUpdateDto } from '../dtos/user.update.dto';
import { UserRepository } from '../repositories/user.repository';
import { UserHistoryService } from './user-history.service';

@Injectable()
export class UserService extends BaseService<EntityList.USER> {
  constructor(private readonly userRepository: UserRepository) {
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
    const systemUser = {} as IUserEntity;

    const validationResult = await dto.validate(
      systemUser,
      this.registryService,
    );
    if (validationResult) {
      const errors = validationResult;
      throw new BadRequestException(errors[0]);
    }

    const instance = await this.userRepository.getInstance(
      { ...dto.toCreateDto(), password: await bcrypt.hash(dto.password, 10) },
      entityManager,
    );

    const userEntity = await this.userRepository.create(
      instance,
      entityManager,
    );

    await this.userHistoryService.createHistoryEntity(
      systemUser,
      { ...userEntity },
      EntityHistoryOperation.CREATE,
      undefined,
      entityManager,
    );

    return userEntity;
  }

  async updateUser(
    id: number,
    currentUser: IUserEntity,
    dto: UserUpdateDto,
    entityManager?: EntityManager,
  ) {
    const validationResult = await dto.validate(
      currentUser,
      this.registryService,
      id,
    );
    if (validationResult) {
      const errors = validationResult;
      throw new BadRequestException(errors[0]);
    }

    let updatedPassword = '';
    if (dto.password) {
      updatedPassword = await bcrypt.hash(dto.password, 10);
    }

    return this.updateByIdBase(
      id,
      {
        ...dto.toUpdateDto(),
        ...(dto.password ? { password: updatedPassword } : {}),
        updatedBy: currentUser.id,
      },
      entityManager,
    );
  }

  async deleteUser(
    id: number,
    currentUser: IUserEntity,
    entityManager?: EntityManager,
  ) {
    return this.userRepository.deleteById(id, entityManager);
  }
}
