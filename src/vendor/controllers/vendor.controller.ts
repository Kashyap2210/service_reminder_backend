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
import { VendorCreateDto } from '../dtos/vendor.create.dto';
import { VendorSearchDto } from '../dtos/vendor.search.dto';
import { VendorUpdateDto } from '../dtos/vendor.update.dto';
import { VendorService } from '../services/vendor.service';
import {
  CreateVendorSwagger,
  DeleteVendorSwagger,
  SearchVendorsSwagger,
  UpdateVendorSwagger,
} from '../vendor.swagger';
import { EntityList, IUserEntity, IVendorEntity } from 'service_reminder_common';

@ApiTags(EntityList.VENDOR)
@Controller(EntityList.VENDOR)
export class VendorController {
  constructor(private readonly registryService: RegistryService) {}

  get vendorService(): VendorService {
    return this.registryService.get(EntityList.VENDOR) as VendorService;
  }

  @Post()
  @CreateVendorSwagger()
  @UseGuards(AuthGuard)
  async createVendor(
    @Body() dto: VendorCreateDto,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<IVendorEntity> {
    return this.vendorService.createVendor(currentUser, dto);
  }

  @UpdateVendorSwagger()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateVendor(
    @Param('id') id: string,
    @Body() dto: VendorUpdateDto,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<IVendorEntity> {
    return this.vendorService.updateVendor(+id, currentUser, dto);
  }

  @SearchVendorsSwagger()
  @UseGuards(AuthGuard)
  @Post('search')
  async searchVendors(
    @Body() dto: VendorSearchDto,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<IVendorEntity[]> {
    return this.vendorService.search(dto, currentUser);
  }

  @DeleteVendorSwagger()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteVendor(
    @Param('id') id: string,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<boolean> {
    return this.vendorService.deleteVendor(+id, currentUser);
  }
}
