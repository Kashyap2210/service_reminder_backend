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
import { ServiceCreateDto } from '../dtos/service.create.dto';
import { ServiceSearchDto } from '../dtos/service.search.dto';
import { ServiceUpdateDto } from '../dtos/service.update.dto';
import { ServiceService } from '../services/service.service';
import {
  CreateServiceSwagger,
  DeleteServiceSwagger,
  SearchServicesSwagger,
  UpdateServiceSwagger,
} from '../service.swagger';
import { EntityList, IServiceEntity, IUserEntity } from 'service_reminder_common';

@ApiTags(EntityList.SERVICE)
@Controller(EntityList.SERVICE)
export class ServiceController {
  constructor(private readonly registryService: RegistryService) {}

  get serviceService(): ServiceService {
    return this.registryService.get(EntityList.SERVICE) as ServiceService;
  }

  @Post()
  @CreateServiceSwagger()
  @UseGuards(AuthGuard)
  async createService(
    @Body() dto: ServiceCreateDto,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<IServiceEntity> {
    return this.serviceService.createService(currentUser, dto);
  }

  @UpdateServiceSwagger()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateService(
    @Param('id') id: string,
    @Body() dto: ServiceUpdateDto,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<IServiceEntity> {
    return this.serviceService.updateService(+id, currentUser, dto);
  }

  @SearchServicesSwagger()
  @UseGuards(AuthGuard)
  @Post('search')
  async searchServices(
    @Body() dto: ServiceSearchDto,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<IServiceEntity[]> {
    return this.serviceService.search(dto, currentUser);
  }

  @DeleteServiceSwagger()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteService(
    @Param('id') id: string,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<boolean> {
    return this.serviceService.deleteService(+id, currentUser);
  }
}
