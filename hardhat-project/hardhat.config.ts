import type { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox-viem';
import '@openzeppelin/hardhat-upgrades';
import 'dotenv/config';

const config: HardhatUserConfig = {
    solidity: {
        version: '0.8.24',
        settings: {
            optimizer: {
                enabled: true,
                runs: 1_000_000
            }
        }
    },
    networks: {
        hardhat: {
            allowUnlimitedContractSize: false,
            chainId: 1,
            forking: {
                url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
                blockNumber: 15360000
            },
            accounts: {
                mnemonic: process.env.MNEMONIC,
                accountsBalance: '1000000000000000000000000'
            }
        }
    },
    mocha: {
        timeout: 60000
    }
};

export default config;
