import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AppointmentType,
  EntityList,
  IAppointmentEntity,
  IUserEntity,
} from 'service_reminder_common';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RegistryService } from 'src/shared/services/registry.service';
import { UserService } from 'src/user/services/user.service';
import { VendorService } from 'src/vendor/services/vendor.service';
import {
  CreateAppointmentSwagger,
  DeleteAppointmentSwagger,
  SearchAppointmentsSwagger,
  UpdateAppointmentSwagger,
} from '../appointment.swagger';
import {
  bookAppointmentErrorPage,
  bookAppointmentFromReminderMail,
  bookAppointmentSuccessPage,
} from '../browser-templates/appointment-booking.template';
import { AppointmentCreateDto } from '../dtos/appointment.create.dto';
import { AppointmentSearchDto } from '../dtos/appointment.search.dto';
import { AppointmentUpdateDto } from '../dtos/appointment.update.dto';
import { AppointmentService } from '../services/appointment.service';
// import { manageAppointmentPage } from '../templates/manage-appointment.page';

@ApiTags(EntityList.APPOINTMENT)
@Controller(EntityList.APPOINTMENT)
export class AppointmentController {
  constructor(private readonly registryService: RegistryService) {}

  get appointmentService(): AppointmentService {
    return this.registryService.get(
      EntityList.APPOINTMENT,
    ) as AppointmentService;
  }

  get vendorService(): VendorService {
    return this.registryService.get(EntityList.VENDOR) as VendorService;
  }

  get userService(): UserService {
    return this.registryService.get(EntityList.USER) as UserService;
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

  @Get('book-page')
  @Header('Content-Type', 'text/html')
  async bookPage(@Query() query: any): Promise<string> {
    const vendorId = Number(query.vendorId ?? '');
    const recurringItemId = Number(query.recurringItemId ?? '');
    const userId = Number(query.userId ?? '');
    const vendorName = String(query.vendorName ?? '');
    const recurringItemName = String(query.recurringItemName ?? '');

    return bookAppointmentFromReminderMail({
      vendorId,
      vendorName,
      recurringItemId,
      userId,
      recurringItemName,
    });
  }

  @Post('book')
  @Header('Content-Type', 'text/html')
  async book(@Body() body: any): Promise<string> {
    try {
      if (!body?.appointmentDate) {
        throw new Error('Appointment date is required.');
      }

      const dto = new AppointmentCreateDto();
      dto.vendorId = Number(body.vendorId);
      dto.recurringItemId = Number(body.recurringItemId);
      dto.userId = Number(body.userId);
      dto.appointmentDate = Number(
        String(body.appointmentDate).replace(/-/g, ''),
      );
      dto.checkPoints = body.checkPoints ? String(body.checkPoints) : null;
      dto.appointmentType = AppointmentType.SERVICE;

      await this.appointmentService.bookFromEmail(dto);

      return bookAppointmentSuccessPage();
    } catch (error: any) {
      // console.log('error', error);
      const message =
        error?.message ?? 'Unable to book the appointment at this time.';
      return bookAppointmentErrorPage(message);
    }
  }
}
