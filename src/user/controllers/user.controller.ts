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
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RegistryService } from 'src/shared/services/registry.service';
import { UserCreateDto } from '../dtos/user.create.dto';
import { UserSearchDto } from '../dtos/user.search.dto';
import { UserUpdateDto } from '../dtos/user.update.dto';
import { UserService } from '../services/user.service';
import {
  CreateUserSwagger,
  DeleteUserSwagger,
  SearchUsersSwagger,
  UpdateUserSwagger,
} from '../user.swagger';
import { EntityList, IUserEntity } from 'service_reminder_common';

@ApiTags(EntityList.USER)
@Controller(EntityList.USER)
export class UserController {
  constructor(private readonly registryService: RegistryService) {}

  get userService(): UserService {
    return this.registryService.get(EntityList.USER) as UserService;
  }

  @Post()
  @CreateUserSwagger()
  async createUser(@Body() dto: UserCreateDto): Promise<IUserEntity> {
    return this.userService.createUser(dto);
  }

  @UpdateUserSwagger()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UserUpdateDto,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<IUserEntity> {
    return this.userService.updateUser(+id, currentUser, dto);
  }

  @SearchUsersSwagger()
  @UseGuards(AuthGuard)
  @Post('search')
  async searchUsers(
    @Body() dto: UserSearchDto,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<IUserEntity[]> {
    return this.userService.search(dto, currentUser);
  }

  @DeleteUserSwagger()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<boolean> {
    return this.userService.deleteUser(+id, currentUser);
  }
}
