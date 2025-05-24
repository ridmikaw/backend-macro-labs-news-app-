import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ValidateCaptchaService {
  async validate(captchaToken: string): Promise<void> {
    const secretKey = process.env.CAPTCHA_SECRET_KEY;
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`,
    );
    if (!response.data.success) {
      throw new BadRequestException('Invalid Captcha');
    }
  }
}
