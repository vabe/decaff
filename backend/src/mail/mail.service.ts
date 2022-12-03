import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendVerificationEmail(user: User, token: string) {
    const subject = "deCaff - Account verification";
    const template = "./verificationEmail";
    const link = `${process.env.FRONTEND_URI}/email-verification?token=${token}`;
    const companyName = "CrySyS - Kooperativ Torzs";
    const companyAddress = "Budapest, Műegyetem rkp. 3, 1111";

    await this.mailerService.sendMail({
      to: user.email,
      subject,
      template,
      context: {
        name: user.name,
        link,
        subject,
        companyName,
        companyAddress,
      },
    });
  }
}
