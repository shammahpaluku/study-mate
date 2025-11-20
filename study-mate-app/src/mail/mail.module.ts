import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    ConfigModule, // Make ConfigService available in MailService
  ],
  providers: [
    {
      provide: MailService,
      useFactory: (configService: ConfigService) => {
        return new MailService(configService);
      },
      inject: [ConfigService],
    },
  ],
  exports: [MailService],
})
export class MailModule {}
