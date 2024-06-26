import type { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox-viem';
import '@nomicfoundation/hardhat-network-helpers';
import '@nomicfoundation/hardhat-ignition-viem';
import '@nomicfoundation/hardhat-verify';
import '@openzeppelin/hardhat-upgrades';
import '@typechain/hardhat';
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
                blockNumber: 19920400
            },
            accounts: {
                mnemonic: process.env.MNEMONIC,
                accountsBalance: '1000000000000000000000000'
            }
        },
        sepolia: {
            chainId: 11155111,
            url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
            accounts: {
                mnemonic: process.env.MNEMONIC
            }
        }
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY
    },
    sourcify: {
        enabled: true
    },
    mocha: {
        timeout: 60000
    }
};

export default config;
