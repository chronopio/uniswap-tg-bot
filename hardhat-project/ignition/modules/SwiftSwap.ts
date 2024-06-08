import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

// Sepolia
const SWAP_ROUTER_ADDRESS = '0x94cC0AaC535CCDB3C01d6787D6413C739ae12bc4';
const QUOTER_V2_ADDRESS = '0xC5290058841028F1614F3A6F0F5816cAd0df5E27';

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
