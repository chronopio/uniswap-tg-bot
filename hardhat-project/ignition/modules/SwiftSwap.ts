import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

// Sepolia
const SWAP_ROUTER_ADDRESS = '0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E';
const QUOTER_V2_ADDRESS = '0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3';

const SwiftSwapModule = buildModule('SwiftSwapModule', (m) => {
    const swapRouterAddress = m.getParameter(
        'swapRouterAddress',
        SWAP_ROUTER_ADDRESS
    );
    const quoterAddress = m.getParameter('quoterAddress', QUOTER_V2_ADDRESS);

    const swiftSwap = m.contract('SwiftSwap', [
        swapRouterAddress,
        quoterAddress
    ]);

    return { swiftSwap };
});

export default SwiftSwapModule;
