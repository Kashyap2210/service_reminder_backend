import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { EnvVariablesConfig } from 'src/shared/services/env-variables-config.service';
import { SharedModule } from 'src/shared/shared.module';
import { MailController } from './controllers/mail.controller';
import { MailService } from './services/mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [SharedModule],
      inject: [EnvVariablesConfig],
      useFactory: () => ({
        transport: {
          host: process.env.MAIL_HOST || '<you_env_variable_here>',
          port: parseInt(process.env.MAIL_PORT || '465'),
          secure: true,
          auth: {
            user: process.env.MAIL_USER || '<you_env_variable_here>',
            pass: process.env.MAIL_PASSWORD || '<you_env_variable_here>',
          },
        },
        defaults: {
          from: process.env.MAIL_FROM || '<you_env_variable_here>',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
            extName: '.html',
          },
        },
      }),
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
