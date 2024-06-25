import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class ProviderService {
  private provider: ethers.Provider;

  constructor(private readonly configService: ConfigService) {
    this.provider = new ethers.AlchemyProvider(
      11155111,
      this.configService.get<string>('ALCHEMY_API_KEY'),
    );
  }

  getProvider(): ethers.Provider {
    return this.provider;
  }
}
