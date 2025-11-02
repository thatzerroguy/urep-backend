import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { NinRequestDtoType } from './dto/nin-request.dto';

interface QoreIdTokenResponse {
  accessToken: string;
  expiresIn: number;
}

export interface QoreIdVerificationResponse {
  id: string;
  firstname: string;
  lastname: string;
  nin: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  [key: string]: any;
}

@Injectable()
export class NinService {
  private accessToken?: string;
  private tokenExpiresAt?: number;
  private readonly tokenUrl: string;
  private readonly baseUrl: string;
  private readonly logger = new Logger(NinService.name);

  constructor(private readonly config: ConfigService) {
    this.tokenUrl = 'https://api.qoreid.com/token';
    this.baseUrl = 'https://api.qoreid.com/v1/ng/identities';
  }

  /**
   * Verify NIN details against QoreID service
   * @param ninRequestDto - The NIN verification request data
   * @returns Promise with verification result
   * @throws BadRequestException if validation fails
   * @throws InternalServerErrorException if service is unavailable
   */
  async verifyNin(
    ninRequestDto: NinRequestDtoType,
  ): Promise<QoreIdVerificationResponse> {
    const { nin } = ninRequestDto;

    // Validate NIN format
    if (!this.isValidNinFormat(nin)) {
      throw new BadRequestException('Invalid NIN format. Must be 11 digits.');
    }

    try {
      const token = await this.getToken();
      const url = `${this.baseUrl}/nin/${nin}`;

      const response = await axios.post<QoreIdVerificationResponse>(
        url,
        {}, // Empty body since we only need NIN in URL
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000, // 15 second timeout
        },
      );

      this.logger.log(`NIN verification successful for NIN: ${nin}`);
      return response.data;
    } catch (error) {
      return this.handleVerificationError(error, nin);
    }
  }

  /**
   * Validate NIN format (11 digits)
   */
  private isValidNinFormat(nin: string): boolean {
    return /^\d{11}$/.test(nin);
  }

  /**
   * Handle errors from NIN verification
   */
  private handleVerificationError(error: any, nin: string): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        const status: number = axiosError.response.status;
        const data = axiosError.response.data as
          | { message?: string }
          | undefined;

        this.logger.error(
          `NIN verification failed for ${nin}: ${status} - ${JSON.stringify(data)}`,
        );

        if (status === 400) {
          // BAD_REQUEST
          throw new BadRequestException(
            data?.message || 'Invalid NIN verification request',
          );
        }

        if (status === 404) {
          // NOT_FOUND
          throw new BadRequestException(
            'NIN not found or details do not match',
          );
        }

        if (status === 401) {
          // UNAUTHORIZED
          this.logger.error('QoreID authentication failed');
          throw new InternalServerErrorException(
            'Identity verification service unavailable',
          );
        }

        if (status === 429) {
          // TOO_MANY_REQUESTS
          throw new HttpException(
            'Too many verification attempts. Please try again later.',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }

        throw new InternalServerErrorException(
          'Identity verification service error',
        );
      }

      if (axiosError.code === 'ECONNABORTED') {
        this.logger.error('NIN verification timeout');
        throw new InternalServerErrorException(
          'Verification request timed out',
        );
      }

      this.logger.error('NIN verification network error', axiosError.message);
      throw new InternalServerErrorException(
        'Unable to connect to verification service',
      );
    }

    if (error instanceof HttpException) {
      throw error;
    }

    this.logger.error('Unexpected error during NIN verification', error);
    throw new InternalServerErrorException('Verification service error');
  }

  /**
   * Retrieve authentication token for QoreID API
   * Implements token caching to avoid unnecessary API calls
   * @returns Promise with access token
   * @throws InternalServerErrorException if token retrieval fails
   */
  private async getToken(): Promise<string> {
    const now = Date.now();

    // Reuse valid token if it hasn't expired
    if (this.accessToken && this.tokenExpiresAt && now < this.tokenExpiresAt) {
      this.logger.debug('Using cached QoreID token');
      return this.accessToken;
    }

    // Load QoreID API credentials
    const clientId = this.config.get<string>('qoreIdClientID');
    const clientSecret = this.config.get<string>('qoreIdSecret');

    if (!clientId || !clientSecret) {
      this.logger.error('QoreID credentials missing in environment');
      throw new InternalServerErrorException(
        'Identity verification service configuration error',
      );
    }

    try {
      const response = await axios.post<QoreIdTokenResponse>(
        this.tokenUrl,
        {
          clientId,
          secret: clientSecret,
        },
        {
          timeout: 10000, // 10 second timeout
        },
      );

      const { accessToken, expiresIn } = response.data;

      if (!accessToken || !expiresIn) {
        this.logger.error('Invalid QoreID token response format');
        throw new InternalServerErrorException(
          'Identity verification service error',
        );
      }

      // Cache token and set expiration (refresh 1 minute early)
      this.accessToken = accessToken;
      this.tokenExpiresAt = now + expiresIn * 1000 - 60_000;

      this.logger.log('QoreID token retrieved successfully');
      return this.accessToken;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        this.logger.error(
          'Failed to retrieve QoreID token',
          error.response?.data || error.message,
        );
      } else {
        this.logger.error('Unexpected error retrieving QoreID token', error);
      }

      throw new InternalServerErrorException(
        'Identity verification service unavailable',
      );
    }
  }
}
