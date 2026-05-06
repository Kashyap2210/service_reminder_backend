import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as path from 'path';
import { EnvVariablesConfig } from 'src/shared/services/env-variables-config.service';
import { IMailData } from '../templates/template-interfaces/mail-data.interface';
import { EmailTemplate } from '../utils/email-template.enum';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly envVariablesConfig: EnvVariablesConfig,
  ) {}

  async sendNotification<T>(
    templateName: EmailTemplate,
    mailData: IMailData,
    templateData: T,
  ) {
    this.logger.log(`[sendNotification] Initiating | template=${templateName}`);

    const templatePath = path.join(
      __dirname,
      '..',
      'templates',
      `${templateName}.html`,
    );

    // this.logger.debug(
    //   `[sendNotification] Resolved template path | path=${templatePath}`,
    // );

    if (!fs.existsSync(templatePath)) {
      this.logger.error(
        `[sendNotification] Template file not found | path=${templatePath}`,
      );
      throw new Error(`Template file not found: ${templatePath}`);
    }

    const templateSource = fs.readFileSync(templatePath, 'utf8');
    this.logger.debug(
      `[sendNotification] Template file read successfully | template=${templateName}`,
    );

    const compiled = handlebars.compile(templateSource);
    const html: string = compiled(templateData);
    this.logger.debug(
      `[sendNotification] Template compiled successfully | template=${templateName} | htmlLength=${html.length}`,
    );

    await this.sendMail(mailData, html);

    this.logger.log(`[sendNotification] Completed | template=${templateName}`);
  }

  /**
   * Sends pre-rendered HTML email via Mailer service
   * @param mailData - Recipient, sender and subject info
   * @param html - Pre-rendered HTML string from sendNotification
   */
  private async sendMail(mailData: IMailData, html: string): Promise<any> {
    const { toEmail, fromEmail, subject } = mailData;

    // this.logger.log(
    //   `[sendMail] Sending email | to=${toEmail} | subject="${subject}"`,
    // );

    try {
      // console.log(this.envVariablesConfig.getEnviornment() === 'development');
      // console.log(this.envVariablesConfig.mailTo);
      // console.log(fromEmail);
      // console.log(
      //   this.envVariablesConfig.getEnviornment() === 'development'
      //     ? [this.envVariablesConfig.mailTo]
      //     : toEmail,
      // );

      const response = await this.mailerService.sendMail({
        to:
          this.envVariablesConfig.getEnviornment() === 'development'
            ? [this.envVariablesConfig.mailTo]
            : toEmail,
        // toEmail,
        // from: fromEmail,
        from: this.envVariablesConfig.mailFrom,
        subject,
        html,
      });

      //   this.logger.log(
      //     `[sendMail] Email sent successfully | to=${toEmail} | messageId=${response?.id ?? 'N/A'}`,
      //   );

      return response;
    } catch (error) {
      this.logger.error(
        `[sendMail] Failed to send email | to=${toEmail} | subject="${subject}" | error=${error.message}`,
        error.stack,
      );
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * Renders template with dummy data and returns HTML string for browser preview
   * @param templateName - Email template type
   * @param templateData - Dummy data to populate the template
   * @returns Rendered HTML string
   */
  previewTemplate<T>(templateName: EmailTemplate, templateData: T): string {
    // this.logger.log(
    //   `[previewTemplate] Rendering preview | template=${templateName}`,
    // );

    const templatePath = path.join(
      __dirname,
      '..',
      'templates',
      `${templateName}.html`,
    );

    if (!fs.existsSync(templatePath)) {
      //   this.logger.error(
      //     `[previewTemplate] Template file not found | path=${templatePath}`,
      //   );
      throw new Error(`Template file not found: ${templatePath}`);
    }

    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const compiled = handlebars.compile(templateSource);
    const html = compiled(templateData);

    this.logger.log(
      `[previewTemplate] Preview rendered successfully | template=${templateName} | htmlLength=${html.length}`,
    );

    return html;
  }
}
