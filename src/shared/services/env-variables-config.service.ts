import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvVariablesConfig {
  private readonly _mailHost: string;
  private readonly _mailPort: number;
  private readonly _mailUser: string;
  private readonly _mailPassword: string;
  private readonly _mailFrom: string;
  private readonly _mailTo: string;
  private readonly _baseUrl: string;
  private readonly _sendNotifications: string;

  constructor(private readonly configService: ConfigService) {
    this._mailHost = this.getOrThrow('MAIL_HOST');
    this._mailPort = Number(this.getOrThrow('MAIL_PORT'));
    this._mailUser = this.getOrThrow('MAIL_USER');
    this._mailPassword = this.getOrThrow('MAIL_PASSWORD');
    this._mailFrom = this.getOrThrow('MAIL_FROM');
    this._mailTo = this.getOrThrow('MAIL_TO');
    this._baseUrl = this.getOrThrow('APP_BASE_URL');
    this._sendNotifications = this.getOrThrow('SEND_NOTIFICATIONS');

    // Optional: validate port
    if (isNaN(this._mailPort)) {
      throw new BadRequestException({
        key: 'MAIL_PORT',
        message: 'MAIL_PORT must be a valid number',
      });
    }
  }

  private getOrThrow(varName: string): string {
    const value = this.configService.get<string>(varName);

    if (!value) {
      throw new BadRequestException({
        key: varName,
        message: `Env variable: ${varName} not found.`,
      });
    }

    return value;
  }

  getEnviornment() {
    return this.configService.get<string>('NODE_ENV');
  }

  // Getters (optional, you could also expose properties directly)
  get mailHost(): string {
    return this._mailHost;
  }

  get mailPort(): number {
    return this._mailPort;
  }

  get mailUser(): string {
    return this._mailUser;
  }

  get mailPassword(): string {
    return this._mailPassword;
  }

  get mailFrom(): string {
    return this._mailFrom;
  }

  get mailTo(): string {
    return this._mailTo;
  }

  get baseUrl(): string {
    return this._baseUrl;
  }

  get sendNotifications(): boolean {
    return toBoolean(this._sendNotifications);
  }
}

function toBoolean(value) {
  return value === 'true';
}
