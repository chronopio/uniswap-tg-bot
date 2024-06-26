import 'hardhat';
import { ethers, upgrades } from 'hardhat';
import 'dotenv/config';

async function main() {
    try {
        const SWAP_ROUTER_ADDRESS =
            '0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E';
        const QUOTER_V2_ADDRESS = '0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3';

        const SwiftSwap = await ethers.getContractFactory('SwiftSwap');

        const swiftSwapProxy = await upgrades.deployProxy(SwiftSwap, [
            SWAP_ROUTER_ADDRESS,
            QUOTER_V2_ADDRESS
        ]);
        await swiftSwapProxy.waitForDeployment();

        const address = await swiftSwapProxy.getAddress();

        console.log('SwiftSwap deployed to:', address);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

main();
