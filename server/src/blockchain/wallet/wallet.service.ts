import { Injectable } from '@nestjs/common';
import type { HDNodeWallet } from 'ethers';
import { Mnemonic, Wallet, ethers } from 'ethers';

import { ProviderService } from '../provider/provider.service';

@Injectable()
export class WalletService {
  constructor(private readonly providerService: ProviderService) {}

  create(): HDNodeWallet {
    return Wallet.fromPhrase(
      Mnemonic.fromEntropy(ethers.randomBytes(16)).phrase,
      this.providerService.getProvider(),
    );
  }

  import(phrase: string): HDNodeWallet {
    return Wallet.fromPhrase(phrase, this.providerService.getProvider());
  }
}
