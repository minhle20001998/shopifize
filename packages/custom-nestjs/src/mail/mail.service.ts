import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendPasswordReset(email: string, token: string) {
    //TODO: add dev and prod variable
    const url = `http://localhost:3000/reset-password/${token}`;

    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Reset password',
      template: '../../../src/mail/templates/reset-password', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: email,
        url,
      },
    });
  }

  async sendOTP(email: string, otp: string, purpose: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: purpose,
      template: '../../../src/mail/templates/otp',
      context: {
        name: email,
        otp,
        purpose,
      },
    });
  }
}
