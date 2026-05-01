import { BadRequestException, Controller, Get, Header } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EnvVariablesConfig } from 'src/shared/services/env-variables-config.service';
import { MailService } from '../services/mail.service';
import { dummyData } from '../templates/dummy-data';
import { IMailData } from '../templates/template-interfaces/mail-data.interface';
import { IUserSignUp } from '../templates/template-interfaces/user-signup.interface';
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
}
