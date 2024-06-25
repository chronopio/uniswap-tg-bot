import { WalletService } from './wallet.service';

import { Test, TestingModule } from '@nestjs/testing';
import { Mnemonic, ethers } from 'ethers';
import { ProviderModule } from '../provider/provider.module';

describe('WalletService', () => {
  let service: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletService],
      imports: [ProviderModule],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Wallet Creation', () => {
    it('should create a new wallet', () => {
      const wallet = service.create();

      expect(wallet.address).toHaveLength(42);
      expect(wallet.privateKey.startsWith('0x')).toBe(true);
      expect(wallet.privateKey).toHaveLength(66);
      expect(wallet.publicKey.startsWith('0x')).toBe(true);
      expect(wallet.publicKey).toHaveLength(68);
      expect(wallet.mnemonic.phrase.split(' ')).toHaveLength(12);
    });
  });

  describe('Wallet Import', () => {
    it('should import a wallet when passing valid mnemonic', () => {
      const mnemonic = Mnemonic.fromEntropy(ethers.randomBytes(16));
      const importedWallet = service.import(mnemonic.phrase);

      expect(importedWallet.address).toHaveLength(42);
      expect(importedWallet.privateKey.startsWith('0x')).toBe(true);
      expect(importedWallet.privateKey).toHaveLength(66);
      expect(importedWallet.publicKey.startsWith('0x')).toBe(true);
      expect(importedWallet.publicKey).toHaveLength(68);
      expect(importedWallet.mnemonic.phrase).toEqual(mnemonic.phrase);
    });

    it('should throw an error when passing invalid mnemonic', () => {
      const invalidMnemonic = 'invalid mnemonic';
      expect(() => service.import(invalidMnemonic)).toThrow();
    });
  });
});
