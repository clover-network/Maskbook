import { useAsyncRetry } from 'react-use'
import type { NetworkPluginID } from '@masknet/shared-base'
import type { Web3Helper } from '@masknet/web3-helpers'
import { useWeb3Hub } from './useWeb3Hub.js'
import { useChainContext } from './useContext.js'

export function useNonFungibleTokensFromTokenList<
    S extends 'all' | void = void,
    T extends NetworkPluginID = NetworkPluginID,
>(pluginID?: T, options?: Web3Helper.Web3HubOptionsScope<S, T>) {
    const { chainId } = useChainContext({
        chainId: options?.chainId,
    })
    const hub = useWeb3Hub(pluginID, options)

    return useAsyncRetry<Array<Web3Helper.NonFungibleTokenScope<S, T>> | undefined>(async () => {
        return hub?.getNonFungibleTokensFromTokenList?.(chainId)
    }, [chainId, hub])
}
