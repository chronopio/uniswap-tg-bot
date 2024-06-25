import { Test, TestingModule } from '@nestjs/testing';
import { ProviderService } from './provider.service';
import { ConfigModule } from '@nestjs/config';
import { ethers } from 'ethers';

describe('ProviderService', () => {
  let service: ProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [ProviderService],
    }).compile();

    service = module.get<ProviderService>(ProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an ethers sepolia provider', async () => {
    const provider = service.getProvider();
    expect(provider).toBeInstanceOf(ethers.AlchemyProvider);

    const network = await provider.getNetwork();
    expect(network.chainId).toBe(11155111n);
    expect(network.name).toBe('sepolia');
  });
});
