import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { expect } from 'chai';
import hre, { ethers, upgrades } from 'hardhat';
import { getAddress, parseEther } from 'viem';

describe('SwiftSwap', function () {
    const routerAddress = getAddress(
        '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'
    );
    const quoterAddress = getAddress(
        '0x61fFE014bA17989E743c5F6cB21bF9697530B21e'
    );
    const daiAddress = getAddress('0x6B175474E89094C44Da98b954EedeAC495271d0F');
    const wethAddress = getAddress(
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    );

    async function deploySwiftSwapFixture() {
        const [owner, otherAccount] = await hre.viem.getWalletClients();

        const SwiftSwap = await ethers.getContractFactory('SwiftSwap');
        const swiftSwapProxy = await upgrades.deployProxy(SwiftSwap, [
            routerAddress,
            quoterAddress
        ]);
        await swiftSwapProxy.waitForDeployment();

        const address = await swiftSwapProxy.getAddress();
        const swiftSwap = await hre.viem.getContractAt(
            'SwiftSwap',
            getAddress(address)
        );

        const publicClient = await hre.viem.getPublicClient();

        return {
            swiftSwap,
            owner,
            otherAccount,
            publicClient
        };
    }

    describe('Deployment', function () {
        it('should deploy and initialize correctly', async function () {
            const { swiftSwap } = await loadFixture(deploySwiftSwapFixture);

            const events = await swiftSwap.getEvents.Initialized();

            expect(events.length).to.equal(1);
            expect(events[0].args.version).to.equal(1n);
        });

        it('should set the correct router address', async function () {
            const { swiftSwap } = await loadFixture(deploySwiftSwapFixture);

            expect(await swiftSwap.read.swapRouter()).to.equal(
                routerAddress.toString()
            );
        });

        it('should set the correct quoter address', async function () {
            const { swiftSwap } = await loadFixture(deploySwiftSwapFixture);

            expect(await swiftSwap.read.quoter()).to.equal(
                quoterAddress.toString()
            );
        });
    });

    describe('Quote', function () {
        it('should return the correct quote for exact input swap', async function () {
            const { swiftSwap, owner } = await loadFixture(
                deploySwiftSwapFixture
            );

            const amountIn = parseEther('1');

            await swiftSwap.write.getExactInQuote([
                daiAddress,
                wethAddress,
                amountIn
            ]);

            const events = await swiftSwap.getEvents.ExactInQuote({
                tokenIn: daiAddress,
                tokenOut: wethAddress
            });

            expect(events.length).to.equal(1);

            const args = events[0].args;

            expect(args.sender).to.equal(getAddress(owner.account.address));
            expect(args.tokenIn).to.equal(daiAddress.toString());
            expect(args.tokenOut).to.equal(wethAddress.toString());
            expect(args.amountIn).to.equal(amountIn);
            expect(args.amountOut).to.not.be.undefined;
            expect(args.gasEstimate).to.not.be.undefined;
        });

        it('should return the correct quote for exact output swap', async function () {
            const { swiftSwap, owner } = await loadFixture(
                deploySwiftSwapFixture
            );

            const amountOut = parseEther('1');

            await swiftSwap.write.getExactOutQuote([
                wethAddress,
                daiAddress,
                amountOut
            ]);

            const events = await swiftSwap.getEvents.ExactOutQuote({
                tokenIn: wethAddress,
                tokenOut: daiAddress
            });

            expect(events.length).to.equal(1);

            const args = events[0].args;

            expect(args.sender).to.equal(getAddress(owner.account.address));
            expect(args.tokenIn).to.equal(wethAddress.toString());
            expect(args.tokenOut).to.equal(daiAddress.toString());
            expect(args.amountOut).to.equal(amountOut);
            expect(args.amountIn).to.not.be.undefined;
            expect(args.gasEstimate).to.not.be.undefined;
        });
    });
});
