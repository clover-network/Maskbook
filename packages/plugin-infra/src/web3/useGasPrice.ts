import { useAsyncRetry } from 'react-use'
import type { NetworkPluginID } from '@masknet/web3-shared-base'
import type { Web3Helper } from '../web3-helpers'
import { useWeb3Connection } from './useWeb3Connection'

export function useGasPrice<T extends NetworkPluginID>(pluginID?: T, options?: Web3Helper.Web3ConnectionOptions<T>) {
    const connection = useWeb3Connection(pluginID, options)
    return useAsyncRetry(async () => {
        if (!connection) return '0'
        return connection.getGasPrice() ?? '0'
    }, [connection])
}