import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SmsDtoType } from './dto/sms.dto';
import { VerifyOtpDtoType } from './dto/verify-otp.dto';
import axios from 'axios';

interface OtpRecord {
  otp: string;
  expiresAt: number;
  attempts: number;
}

@Injectable()
export class SmsService {
  private readonly baseurl: string;
  private readonly logger = new Logger(SmsService.name);
  private readonly otpStore = new Map<string, OtpRecord>();
  private readonly OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
  private readonly MAX_ATTEMPTS = 3;

  constructor(private readonly config: ConfigService) {
    this.baseurl = 'https://v3.api.termii.com';
    // Clean up expired OTPs every 5 minutes
    setInterval(() => this.cleanupExpiredOtps(), 5 * 60 * 1000);
  }

  /**
   * @description Sends an SMS message with OTP to the phone Number gotten from NIN verification
   * @param phoneDto - The phone number to send the OTP to
   * @returns Promise with SMS message response
   */
  async sendOtp(phoneDto: SmsDtoType): Promise<{
    success: boolean;
    message: string;
    phoneNumber: string;
    otp?: string;
  }> {
    const { phoneNumber } = phoneDto;

    // Validate phone number format
    if (!this.validatePhoneNumber(phoneNumber)) {
      throw new BadRequestException('Invalid phone number format');
    }

    // Generate OTP 6 random digits
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with expiry
    this.otpStore.set(phoneNumber, {
      otp,
      expiresAt: Date.now() + this.OTP_EXPIRY_MS,
      attempts: 0,
    });

    // Load Termii Api credentials
    const apikey = this.config.get<string>('termiiApiKey');
    const senderId = this.config.get<string>('termiiSenderId');
    const nodeEnv = this.config.get<string>('NODE_ENV');

    // In development, skip sending SMS and return OTP
    if (nodeEnv === 'development') {
      this.logger.log(
        `[DEV MODE] OTP for ${phoneNumber}: ${otp} (valid for 10 minutes)`,
      );
      return {
        success: true,
        message: 'OTP generated successfully',
        phoneNumber,
        otp, // Include OTP in dev mode for testing
      };
    }

    // Construct the URL for the request
    const url = `${this.baseurl}/api/sms/send`;

    // Construct the request body
    const body = {
      api_key: apikey,
      to: phoneNumber,
      from: senderId,
      channel: 'generic',
      type: 'plain',
      sms: `Your OTP for your Urep registration is: ${otp}`,
    };

    try {
      const response = await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      this.logger.log(`SMS sent successfully to ${phoneNumber}`);
      return {
        success: true,
        message: 'OTP sent successfully',
        phoneNumber,
        ...response.data,
      };
    } catch (error) {
      // Remove OTP from store if SMS fails
      this.otpStore.delete(phoneNumber);

      if (axios.isAxiosError(error)) {
        this.logger.error(
          `SMS message failed for ${phoneNumber}: ${error.response?.data || error.message}`,
        );
      } else if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('SMS message network error', error);
      throw new HttpException(
        'Unable to send OTP. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * @description Verify OTP for a phone number
   * @param verifyDto - Phone number and OTP to verify
   * @returns Success status
   */
  verifyOtp(verifyDto: VerifyOtpDtoType): {
    success: boolean;
    message: string;
    phoneNumber: string;
  } {
    const { phoneNumber, otp } = verifyDto;

    const record = this.otpStore.get(phoneNumber);

    if (!record) {
      throw new BadRequestException(
        'No OTP found for this phone number. Please request a new OTP.',
      );
    }

    // Check if OTP has expired
    if (Date.now() > record.expiresAt) {
      this.otpStore.delete(phoneNumber);
      throw new UnauthorizedException(
        'OTP has expired. Please request a new OTP.',
      );
    }

    // Check max attempts
    if (record.attempts >= this.MAX_ATTEMPTS) {
      this.otpStore.delete(phoneNumber);
      throw new UnauthorizedException(
        'Maximum verification attempts exceeded. Please request a new OTP.',
      );
    }

    // Increment attempts
    record.attempts += 1;

    // Verify OTP
    if (record.otp !== otp) {
      this.logger.warn(
        `Failed OTP verification attempt ${record.attempts}/${this.MAX_ATTEMPTS} for ${phoneNumber}`,
      );
      throw new UnauthorizedException(
        `Invalid OTP. ${this.MAX_ATTEMPTS - record.attempts} attempts remaining.`,
      );
    }

    // OTP verified successfully, remove from store
    this.otpStore.delete(phoneNumber);
    this.logger.log(`OTP verified successfully for ${phoneNumber}`);

    return {
      success: true,
      message: 'OTP verified successfully',
      phoneNumber,
    };
  }

  /**
   * @description Clean up expired OTPs from memory
   */
  private cleanupExpiredOtps() {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [phoneNumber, record] of this.otpStore.entries()) {
      if (now > record.expiresAt) {
        this.otpStore.delete(phoneNumber);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logger.debug(`Cleaned up ${cleanedCount} expired OTP(s)`);
    }
  }

  /**
   * @description Validates the phone number format (234XXXXXXXXXX)
   * @param phoneNumber
   * @private
   */
  private validatePhoneNumber(phoneNumber: string): boolean {
    return /^234\d{10}$/.test(phoneNumber);
  }
}
