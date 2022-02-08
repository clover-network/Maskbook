import type { RequestArguments, TransactionConfig } from 'web3-core'
import type { JsonRpcPayload, JsonRpcResponse } from 'web3-core-helpers'
import {
    createPayload,
    EthereumMethodType,
    getPayloadId,
    ProviderType,
    RequestOptions,
    SendOverrides,
} from '@masknet/web3-shared-evm'
import {
    currentChainIdSettings,
    currentMaskWalletAccountSettings,
    currentMaskWalletChainIdSettings,
    currentProviderSettings,
} from '../../../plugins/Wallet/settings'
import { WalletRPC } from '../../../plugins/Wallet/messages'
import { hasNativeAPI } from '../../../../shared/native-rpc'
import { openPopupWindow } from '../HelperService'
import Services from '../../service'
import { createProvider } from './provider'
import { getError, hasError } from './error'

let id = 0

const UNCONFIRMED_CALLBACK_MAP = new Map<number, (error: Error | null, response?: JsonRpcResponse) => void>()

function isRiskMethod(method: EthereumMethodType) {
    return [
        EthereumMethodType.ETH_SIGN,
        EthereumMethodType.PERSONAL_SIGN,
        EthereumMethodType.ETH_SIGN_TYPED_DATA,
        EthereumMethodType.ETH_DECRYPT,
        EthereumMethodType.ETH_GET_ENCRYPTION_PUBLIC_KEY,
        EthereumMethodType.ETH_SEND_TRANSACTION,
    ].includes(method)
}

export async function sendRequest<T extends unknown>(
    requestArguments: RequestArguments,
    overrides?: SendOverrides,
    options?: RequestOptions,
) {
    const { providerType = currentProviderSettings.value, chainId = currentChainIdSettings.value } = overrides ?? {}
    const { popupsWindow = true } = options ?? {}

    const provider = await createProvider(chainId, providerType)
    if (!provider?.request) throw new Error('Failed to create provider.')

    // redirect risk rpc to the mask wallet
    if (
        !hasNativeAPI &&
        providerType === ProviderType.MaskWallet &&
        isRiskMethod(requestArguments.method as EthereumMethodType)
    ) {
        return new Promise<T>((resolve, reject) => {
            const payload = createPayload(id++, requestArguments.method, requestArguments.params)

            UNCONFIRMED_CALLBACK_MAP.set(payload.id, (error: Error | null, response?: JsonRpcResponse) => {
                if (hasError(error, response)) reject(getError(error, response))
                else resolve(response?.result as T)
            })
            if (popupsWindow) openPopupWindow()
        })
    }

    return provider?.request?.<T>(requestArguments)
}

export async function confirmRequest<T extends unknown>(payload: JsonRpcPayload) {
    const pid = getPayloadId(payload)
    if (!pid) throw new Error('Invalid request payload.')

    try {
        const result = await sendRequest<T>(
            {
                method: payload.method,
                params: payload.params,
            },
            {
                account: currentMaskWalletAccountSettings.value,
                chainId: currentMaskWalletChainIdSettings.value,
                providerType: ProviderType.MaskWallet,
            },
        )

        UNCONFIRMED_CALLBACK_MAP.get(pid)?.(null, {
            id: pid,
            jsonrpc: '2.0',
            result,
        })
        await WalletRPC.deleteUnconfirmedRequest(payload)
        await Services.Helper.removePopupWindow()
        UNCONFIRMED_CALLBACK_MAP.delete(pid)
    } catch (error) {
        UNCONFIRMED_CALLBACK_MAP.get(pid)?.(getError(error))
    }
}

export async function rejectRequest(payload: JsonRpcPayload) {
    const pid = getPayloadId(payload)
    if (!pid) return
    UNCONFIRMED_CALLBACK_MAP.get(pid)?.(new Error('User rejected!'))
    await WalletRPC.deleteUnconfirmedRequest(payload)
    await Services.Helper.removePopupWindow()
    UNCONFIRMED_CALLBACK_MAP.delete(pid)
}

export async function replaceRequest(hash: string, payload: JsonRpcPayload, overrides?: TransactionConfig) {
    const pid = getPayloadId(payload)
    if (!pid || payload.method !== EthereumMethodType.ETH_SEND_TRANSACTION) return

    const [config] = payload.params as [TransactionConfig]
    return sendRequest<string>(
        {
            method: EthereumMethodType.MASK_REPLACE_TRANSACTION,
            params: [
                hash,
                {
                    ...config,
                    ...overrides,
                },
            ],
        },
        {
            account: currentMaskWalletAccountSettings.value,
            chainId: currentMaskWalletChainIdSettings.value,
            providerType: ProviderType.MaskWallet,
        },
    )
}

export async function cancelRequest(hash: string, payload: JsonRpcPayload, overrides?: TransactionConfig) {
    const pid = getPayloadId(payload)
    if (!pid || payload.method !== EthereumMethodType.ETH_SEND_TRANSACTION) return

    const [config] = payload.params as [TransactionConfig]
    return replaceRequest(hash, payload, {
        ...config,
        ...overrides,
        to: config.from as string,
        data: '0x',
        value: '0x0',
    })
}
