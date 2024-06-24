// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./interfaces/ISwapRouter02.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IQuoterV2.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "hardhat/console.sol";

/// @title SwiftSwap
/// @dev This contract allows for efficient swapping of tokens using Uniswap V3.
contract SwiftSwap is Initializable {
    // 0.3% is assumed to handle medium risk pairs
    uint24 public constant poolFee = 3000;
    ISwapRouter02 public swapRouter;
    IQuoterV2 public quoter;

    event Swap(
        address indexed sender,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );

    event ExactInQuote(
        address indexed sender,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 gasEstimate
    );

    event ExactOutQuote(
        address indexed sender,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 gasEstimate
    );

    /// @notice Initializes the contract with the Uniswap V3 SwapRouter and Quoter.
    /// @param _swapRouter The address of the Uniswap V3 SwapRouter.
    /// @param _quoter The address of the Uniswap V3 Quoter.
    function initialize(
        ISwapRouter02 _swapRouter,
        IQuoterV2 _quoter
    ) public initializer {
        swapRouter = _swapRouter;
        quoter = _quoter;
    }

    /// @notice Returns the quote for an exact input swap.
    /// @param tokenIn The address of the input token.
    /// @param tokenOut The address of the output token.
    /// @param amountIn The exact amount of the input token to swap.
    /// @return amountOut The amount of the output token.
    /// @return gasEstimate The estimated gas for the swap.
    function getExactInQuote(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) public returns (uint256, uint256) {
        (uint256 amountOut, , , uint256 gasEstimate) = quoter
            .quoteExactInputSingle(
                IQuoterV2.QuoteExactInputSingleParams({
                    tokenIn: tokenIn,
                    tokenOut: tokenOut,
                    fee: poolFee,
                    amountIn: amountIn,
                    sqrtPriceLimitX96: 0
                })
            );

        emit ExactInQuote(
            msg.sender,
            tokenIn,
            tokenOut,
            amountIn,
            amountOut,
            gasEstimate
        );

        return (amountOut, gasEstimate);
    }

    /// @notice Returns the quote for an exact output swap.
    /// @param tokenIn The address of the input token.
    /// @param tokenOut The address of the output token.
    /// @param amountOut The exact amount of the output token to receive.
    /// @return amountIn The amount of the input token to swap.
    /// @return gasEstimate The estimated gas for the swap.
    function getExactOutQuote(
        address tokenIn,
        address tokenOut,
        uint256 amountOut
    ) public returns (uint256, uint256) {
        (uint256 amountIn, , , uint256 gasEstimate) = quoter
            .quoteExactOutputSingle(
                IQuoterV2.QuoteExactOutputSingleParams({
                    tokenIn: tokenIn,
                    tokenOut: tokenOut,
                    fee: poolFee,
                    amount: amountOut,
                    sqrtPriceLimitX96: 0
                })
            );

        emit ExactOutQuote(
            msg.sender,
            tokenIn,
            tokenOut,
            amountIn,
            amountOut,
            gasEstimate
        );

        return (amountIn, gasEstimate);
    }

    /// @notice Swaps an exact input amount of one token for another.
    /// @dev This function will revert if the transaction is not successful.
    /// @param tokenIn The address of the input token.
    /// @param tokenOut The address of the output token.
    /// @param amountIn The exact amount of the input token to swap.
    function swapExactIn(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMinimum
    ) public {
        require(amountIn > 0, "amount must be greater than 0");

        TransferHelper.safeTransferFrom(
            tokenIn,
            msg.sender,
            address(this),
            amountIn
        );

        TransferHelper.safeApprove(tokenIn, address(swapRouter), amountIn);

        IV3SwapRouter.ExactInputSingleParams memory params = IV3SwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: poolFee,
                recipient: msg.sender,
                amountIn: amountIn,
                amountOutMinimum: amountOutMinimum,
                sqrtPriceLimitX96: 0
            });

        uint256 amountOut = swapRouter.exactInputSingle(params);

        emit Swap(msg.sender, tokenIn, tokenOut, amountIn, amountOut);
    }

    /// @notice Swaps an input token for an exact output amount of another token, excess is refunded.
    /// @param tokenIn The address of the input token.
    /// @param tokenOut The address of the output token.
    /// @param amountOut The exact amount of the output token to receive.
    /// @param amountInMaximum The maximum amount of the input token that can be spent.
    function swapExactOut(
        address tokenIn,
        address tokenOut,
        uint256 amountOut,
        uint256 amountInMaximum
    ) public {
        require(
            amountOut > 0 && amountInMaximum > 0,
            "both amounts must be greater than 0"
        );

        TransferHelper.safeTransferFrom(
            tokenIn,
            msg.sender,
            address(this),
            amountInMaximum
        );

        TransferHelper.safeApprove(
            tokenIn,
            address(swapRouter),
            amountInMaximum
        );

        IV3SwapRouter.ExactOutputSingleParams memory params = IV3SwapRouter
            .ExactOutputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: poolFee,
                recipient: msg.sender,
                amountOut: amountOut,
                amountInMaximum: amountInMaximum,
                sqrtPriceLimitX96: 0
            });

        uint256 amountIn = swapRouter.exactOutputSingle(params);

        // Refund extra tokens to the user
        if (amountIn < amountInMaximum) {
            TransferHelper.safeApprove(tokenIn, address(swapRouter), 0);
            TransferHelper.safeTransfer(
                tokenIn,
                msg.sender,
                amountInMaximum - amountIn
            );
        }

        emit Swap(msg.sender, tokenIn, tokenOut, amountIn, amountOut);
    }
}
