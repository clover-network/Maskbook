import { useSubscription } from 'use-subscription'
import { UNDEFINED, NetworkPluginID } from '@masknet/shared-base'
import { useWeb3State } from './useWeb3State.js'

export function useAccount<T extends NetworkPluginID>(pluginID?: T, expectedAccount?: string) {
    const { Provider, Others } = useWeb3State(pluginID)
    const defaultAccount = useSubscription(Provider?.account ?? UNDEFINED)
    const account = expectedAccount ?? defaultAccount ?? ''
    return Others?.formatAddress ? Others.formatAddress(account) : account
}
