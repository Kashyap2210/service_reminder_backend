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
  EntityFilterDataHelper,
  EntityList,
  IAppointmentEntity,
  IUserEntity,
} from 'service_reminder_common';
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

  @SearchAppointmentsSwagger()
  @Post('search-global')
  @UseGuards(AuthGuard)
  async searchGlobal(
    @Body() dto: AppointmentSearchDto,
    @CurrentUser() currentUser: IUserEntity,
  ) {
    // {
    //   "relations": [
    //     {
    //       "name": "user",
    //       "relations": [
    //         {
    //           "name": "recurring_item",
    //           "relations": [
    //             { "name": "vendor_recurring_item_mapping", "relations": [{"name": "vendor"}] },
    //             { "name": "appointment" },
    //             { "name": "service" }
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // }
    console.log(dto);
    const serachRes = await this.appointmentService.searchV2(dto, currentUser);
    console.log('searchRes', serachRes);
    const searchResConverted = new EntityFilterDataHelper(serachRes);
    // .entityModelsMap;
    searchResConverted.populateRelationsFor([
      EntityList.APPOINTMENT,
      EntityList.RECURRING_ITEM,
      EntityList.USER,
      EntityList.SERVICE,
      EntityList.VENDOR,
    ]);
    console.log(
      'searchResConverted',
      searchResConverted.entityModelsMap[EntityList.SERVICE],
    );

    return searchResConverted;
  }

  @Get('book-page')
  @Header('Content-Type', 'text/html')
  async bookPage(@Query() query: any): Promise<string> {
    const vendorId = Number(query.vendorId ?? '');
    const recurringItemId = Number(query.recurringItemId ?? '');
    const userId = Number(query.userId ?? '');
    const vendorName = String(query.vendorName ?? '');
    const recurringItemName = String(query.recurringItemName ?? '');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Book Appointment</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 { font-size: 28px; margin-bottom: 5px; }
    .content { padding: 30px 20px; }
    .section-title {
      font-size: 15px;
      font-weight: 700;
      color: #667eea;
      margin: 24px 0 10px 0;
    }
    .info-card {
      background-color: #f9f9f9;
      border-left: 4px solid #667eea;
      border-radius: 4px;
      padding: 15px;
      margin-bottom: 20px;
    }
    .details-item {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #555;
      margin: 8px 0;
    }
    .details-item .label {
      font-weight: 600;
      color: #333;
    }
    .details-item .value { color: #444; }
    .form-group { margin-bottom: 18px; }
    .form-group label {
      display: block;
      font-size: 14px;
      color: #333;
      margin-bottom: 8px;
      font-weight: 600;
    }
    .input-field {
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px;
      font-size: 14px;
      color: #333;
      background: #fff;
    }
    .submit-button {
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px;
      border-radius: 4px;
      border: none;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
    .footer {
      text-align: center;
      padding: 20px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #999;
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📅 Book Appointment</h1>
    </div>
    <div class="content">
      <div class="section-title">Appointment Info</div>
      <div class="info-card">
        <div class="details-item">
          <span class="label">Vendor</span>
          <span class="value">${vendorName}</span>
        </div>
        <div class="details-item">
          <span class="label">Service</span>
          <span class="value">${recurringItemName}</span>
        </div>
      </div>
      <form action="/api/v1/appointment/book" method="POST" enctype="application/x-www-form-urlencoded">
        <input type="hidden" name="vendorId" value="${vendorId}" />
        <input type="hidden" name="recurringItemId" value="${recurringItemId}" />
        <input type="hidden" name="userId" value="${userId}" />
        <div class="form-group">
          <label for="appointmentDate">Appointment Date</label>
          <input id="appointmentDate" class="input-field" type="date" name="appointmentDate" required />
        </div>
        <div class="form-group">
          <label for="checkPoints">Checkpoints (optional)</label>
          <textarea id="checkPoints" class="input-field" name="checkPoints" rows="4" maxlength="1024"></textarea>
        </div>
        <button type="submit" class="submit-button">Book Appointment</button>
      </form>
    </div>
    <div class="footer">
      <p>© 2026 Service Reminder App. All rights reserved.</p>
      <p>This is an automated message. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>`;
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

      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Booked</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 { font-size: 28px; margin-bottom: 5px; }
    .content { padding: 30px 20px; }
    .message {
      background-color: #fffbea;
      border: 1px solid #ffe082;
      border-radius: 4px;
      padding: 12px 15px;
      margin: 20px 0;
      font-size: 14px;
      color: #856404;
      line-height: 1.6;
    }
    .action-wrapper { text-align: center; margin-top: 20px; }
    .close-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 14px;
      border-radius: 4px;
      border: none;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
    .footer {
      text-align: center;
      padding: 20px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #999;
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Appointment Booked</h1>
    </div>
    <div class="content">
      <div class="message">
        Your appointment has been confirmed. You will receive a confirmation email shortly.
      </div>
      <div class="action-wrapper">
        <button type="button" class="close-button" onclick="window.close()">Close</button>
      </div>
    </div>
    <div class="footer">
      <p>© 2026 Service Reminder App. All rights reserved.</p>
      <p>This is an automated message. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>`;
    } catch (error: any) {
      console.log('error', error);
      const message =
        error?.message ?? 'Unable to book the appointment at this time.';
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Failed</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 { font-size: 28px; margin-bottom: 5px; }
    .content { padding: 30px 20px; }
    .message {
      background-color: #fffbea;
      border: 1px solid #ffe082;
      border-radius: 4px;
      padding: 12px 15px;
      margin: 20px 0;
      font-size: 14px;
      color: #856404;
      line-height: 1.6;
    }
    .footer {
      text-align: center;
      padding: 20px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #999;
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>❌ Booking Failed</h1>
    </div>
    <div class="content">
      <div class="message">${this.escapeHtml(message)}</div>
    </div>
    <div class="footer">
      <p>© 2026 Service Reminder App. All rights reserved.</p>
      <p>This is an automated message. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>`;
    }
  }

  private escapeHtml(value: string): string {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
