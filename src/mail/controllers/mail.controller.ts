import { BadRequestException, Controller, Get, Header } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EnvVariablesConfig } from 'src/shared/services/env-variables-config.service';
import { MailService } from '../services/mail.service';
import { dummyData } from '../templates/dummy-data';
import { IAppointmentCreated } from '../templates/template-interfaces/appointment-created.interface';
import { IMailData } from '../templates/template-interfaces/mail-data.interface';
import { IRecurringItemCreated } from '../templates/template-interfaces/recurring-item-created.interface';
import { IServiceCreated } from '../templates/template-interfaces/service-created.interface';
import { IUserSignUp } from '../templates/template-interfaces/user-signup.interface';
import { IVendorCreated } from '../templates/template-interfaces/vendor-created.interface';
import { EmailTemplate } from '../utils/email-template.enum';

@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly envVariablesConfig: EnvVariablesConfig,
  ) {}

  /**
   * Preview service reminder email template in browser with dummy data
   * @returns HTML string rendered for browser display
   */
  @Get('preview/service-reminder')
  @Header('Content-Type', 'text/html')
  @ApiOperation({
    summary: 'Preview service reminder email template',
    description:
      'Returns the rendered HTML for the service reminder email template with dummy data',
  })
  async previewServiceReminder(): Promise<string> {
    const data = dummyData[EmailTemplate.SERVICE_REMINDER];

    if (!data) {
      throw new BadRequestException(
        'Dummy data not found for service reminder template',
      );
    }

    await this.mailService.sendNotification(
      EmailTemplate.SERVICE_REMINDER,
      {
        toEmail: ['kash.cdac@gmail.com'],
        fromEmail: 'Resend <onboarding@resend.dev>',
        subject: 'Test Email',
      },
      data,
    );

    return this.mailService.previewTemplate(
      EmailTemplate.SERVICE_REMINDER,
      data,
    );
  }

  @Get('preview/user-sign-up')
  @Header('Content-Type', 'text/html')
  async previewUserSignUp(): Promise<string> {
    const data = dummyData[EmailTemplate.USER_SIGNUP];

    if (!data) {
      throw new BadRequestException(
        'Dummy data not found for user sign up template',
      );
    }

    const mailData: IMailData = {
      toEmail: [this.envVariablesConfig.mailTo],
      fromEmail: this.envVariablesConfig.mailFrom,
      subject: 'Registration Successful',
    };

    const userSignUpTemplateData: IUserSignUp =
      dummyData[EmailTemplate.USER_SIGNUP];

    await this.mailService.sendNotification(
      EmailTemplate.USER_SIGNUP,
      mailData,
      userSignUpTemplateData,
    );

    return this.mailService.previewTemplate(EmailTemplate.USER_SIGNUP, data);
  }

  @Get('preview/appointment-created')
  @Header('Content-Type', 'text/html')
  @ApiOperation({
    summary: 'Preview appointment created email template',
    description:
      'Returns the rendered HTML for the appointment created email template with dummy data',
  })
  async previewAppointmentCreated(): Promise<string> {
    const data = dummyData[EmailTemplate.APPOINTMENT_CREATED];

    if (!data) {
      throw new BadRequestException(
        'Dummy data not found for appointment created template',
      );
    }

    const mailData: IMailData = {
      toEmail: [this.envVariablesConfig.mailTo],
      fromEmail: this.envVariablesConfig.mailFrom,
      subject: 'Appointment Confirmation',
    };

    const appointmentCreatedTemplateData: IAppointmentCreated =
      dummyData[EmailTemplate.APPOINTMENT_CREATED];

    await this.mailService.sendNotification(
      EmailTemplate.APPOINTMENT_CREATED,
      mailData,
      appointmentCreatedTemplateData,
    );

    return this.mailService.previewTemplate(
      EmailTemplate.APPOINTMENT_CREATED,
      data,
    );
  }

  @Get('preview/recurring-item-created')
  @Header('Content-Type', 'text/html')
  @ApiOperation({
    summary: 'Preview recurring item created email template',
    description:
      'Returns the rendered HTML for the recurring item created email template with dummy data',
  })
  async previewRecurringItemCreated(): Promise<string> {
    const data = dummyData[EmailTemplate.RECURRING_ITEM_CREATED];

    if (!data) {
      throw new BadRequestException(
        'Dummy data not found for recurring item created template',
      );
    }

    const mailData: IMailData = {
      toEmail: [this.envVariablesConfig.mailTo],
      fromEmail: this.envVariablesConfig.mailFrom,
      subject: 'Recurring Item Created',
    };

    const recurringItemCreatedTemplateData: IRecurringItemCreated =
      dummyData[EmailTemplate.RECURRING_ITEM_CREATED];

    await this.mailService.sendNotification(
      EmailTemplate.RECURRING_ITEM_CREATED,
      mailData,
      recurringItemCreatedTemplateData,
    );

    return this.mailService.previewTemplate(
      EmailTemplate.RECURRING_ITEM_CREATED,
      data,
    );
  }

  @Get('preview/service-created')
  @Header('Content-Type', 'text/html')
  @ApiOperation({
    summary: 'Preview service created email template',
    description:
      'Returns the rendered HTML for the service created email template with dummy data',
  })
  async previewServiceCreated(): Promise<string> {
    const data = dummyData[EmailTemplate.SERVICE_CREATED];

    if (!data) {
      throw new BadRequestException(
        'Dummy data not found for service created template',
      );
    }

    const mailData: IMailData = {
      toEmail: [this.envVariablesConfig.mailTo],
      fromEmail: this.envVariablesConfig.mailFrom,
      subject: 'Service Created',
    };

    const serviceCreatedTemplateData: IServiceCreated =
      dummyData[EmailTemplate.SERVICE_CREATED];

    await this.mailService.sendNotification(
      EmailTemplate.SERVICE_CREATED,
      mailData,
      serviceCreatedTemplateData,
    );

    return this.mailService.previewTemplate(
      EmailTemplate.SERVICE_CREATED,
      data,
    );
  }

  @Get('preview/vendor-created')
  @Header('Content-Type', 'text/html')
  @ApiOperation({
    summary: 'Preview vendor created email template',
    description:
      'Returns the rendered HTML for the vendor created email template with dummy data',
  })
  async previewVendorCreated(): Promise<string> {
    const data = dummyData[EmailTemplate.VENDOR_CREATED];

    if (!data) {
      throw new BadRequestException(
        'Dummy data not found for vendor created template',
      );
    }

    const mailData: IMailData = {
      toEmail: [this.envVariablesConfig.mailTo],
      fromEmail: this.envVariablesConfig.mailFrom,
      subject: 'Vendor Created',
    };

    const vendorCreatedTemplateData: IVendorCreated =
      dummyData[EmailTemplate.VENDOR_CREATED];

    await this.mailService.sendNotification(
      EmailTemplate.VENDOR_CREATED,
      mailData,
      vendorCreatedTemplateData,
    );

    return this.mailService.previewTemplate(EmailTemplate.VENDOR_CREATED, data);
  }
}
