import type { RequestArguments } from 'web3-core'
import type { RequestOptions, SendOverrides } from '@masknet/web3-shared-evm'
import { currentChainIdSettings, currentProviderSettings } from '../../../plugins/Wallet/settings'
import { createProvider } from './provider'
import { createContext, dispatch } from './composer'

export async function sendRequest<T extends unknown>(
    requestArguments: RequestArguments,
    overrides?: SendOverrides,
    options?: RequestOptions,
) {
    const { providerType = currentProviderSettings.value, chainId = currentChainIdSettings.value } = overrides ?? {}

    const context = createContext(requestArguments, overrides, options)
    dispatch(context, async () => {
        try {
            // create request provider
            const provider = await createProvider(chainId, providerType)
            if (!provider?.request) throw new Error('Failed to create provider.')

            // send request and set result in the context
            const result = await provider?.request?.<T>(requestArguments)
            context.setResult(result)
        } catch (error) {
            context.setError(error instanceof Error ? error : new Error('Failed to send request.'))
        }
    })
}
