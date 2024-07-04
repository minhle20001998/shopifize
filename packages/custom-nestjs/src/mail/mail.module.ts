import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { MailService } from './mail.service';
import { EnvModule, EnvService, GlobalEnv } from 'src/env';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [EnvService],
      imports: [EnvModule],
      useFactory: (env: EnvService<GlobalEnv>) => {
        return {
          transport: {
            host: 'smtp.gmail.com',
            secure: false,
            auth: {
              user: env.get('mail.email'),
              pass: env.get('mail.password'),
            },
          },
          defaults: {
            from: '"No Reply" <noreply@example.com>',
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
