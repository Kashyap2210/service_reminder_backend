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
import { IAppointmentEntity } from 'src/common/interfaces/entities/appointment.entity.interface';
import { IUserEntity } from 'src/common/interfaces/entities/user.entity.interface';
import { EntityList } from 'src/common/utils/entity.utils';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RegistryService } from 'src/shared/services/registry.service';
import {
  CreateAppointmentSwagger,
  DeleteAppointmentSwagger,
  SearchAppointmentsSwagger,
  UpdateAppointmentSwagger,
} from '../appointment.swagger';
import { AppointmentCreateDto } from '../dtos/appointment.create.dto';
import { AppointmentSearchDto } from '../dtos/appointment.search.dto';
import { AppointmentUpdateDto } from '../dtos/appointment.update.dto';
import { AppointmentService } from '../services/appointment.service';

@ApiTags(EntityList.APPOINTMENT)
@Controller(EntityList.APPOINTMENT)
export class AppointmentController {
  constructor(private readonly registryService: RegistryService) {}

  get appointmentService(): AppointmentService {
    return this.registryService.get(
      EntityList.APPOINTMENT,
    ) as AppointmentService;
  }

  @Post()
  @CreateAppointmentSwagger()
  @UseGuards(AuthGuard)
  async createAppointment(
    @Body() dto: AppointmentCreateDto,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<IAppointmentEntity> {
    return this.appointmentService.createAppointment(currentUser, dto);
  }

  @UpdateAppointmentSwagger()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateAppointment(
    @Param('id') id: string,
    @Body() dto: AppointmentUpdateDto,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<IAppointmentEntity> {
    return this.appointmentService.updateAppointment(+id, currentUser, dto);
  }

  @SearchAppointmentsSwagger()
  @UseGuards(AuthGuard)
  @Post('search')
  async searchAppointments(
    @Body() dto: AppointmentSearchDto,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<IAppointmentEntity[]> {
    return this.appointmentService.search(dto, currentUser);
  }

  @DeleteAppointmentSwagger()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteAppointment(
    @Param('id') id: string,
    @CurrentUser() currentUser: IUserEntity,
  ): Promise<boolean> {
    return this.appointmentService.deleteAppointment(+id, currentUser);
  }
}
