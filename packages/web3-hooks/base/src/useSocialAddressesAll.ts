import LRUCache from 'lru-cache'
import { useAsyncRetry } from 'react-use'
import { EMPTY_LIST, NetworkPluginID } from '@masknet/shared-base'
import type { SocialAddress, SocialAddressType, SocialIdentity } from '@masknet/web3-shared-base'
import type { Web3Helper } from '@masknet/web3-helpers'
import { useWeb3State } from './useWeb3State.js'

type AddressList = Array<SocialAddress<Web3Helper.ChainIdAll>>
type CacheValue = Promise<Array<PromiseSettledResult<AddressList>>>

const addressCache = new LRUCache<string, CacheValue>({
    max: 500,
    ttl: 2 * 60 * 1000,
})

/**
 * Get all social addresses across all networks.
 */
export function useSocialAddressesAll(
    identity?: SocialIdentity,
    includes?: SocialAddressType[],
    sorter?: (a: SocialAddress<Web3Helper.ChainIdAll>, z: SocialAddress<Web3Helper.ChainIdAll>) => number,
) {
    // TODO: to add flow
    const { IdentityService: EVM_IdentityService } = useWeb3State(NetworkPluginID.PLUGIN_EVM)
    const { IdentityService: SolanaIdentityService } = useWeb3State(NetworkPluginID.PLUGIN_SOLANA)

    return useAsyncRetry<Array<SocialAddress<Web3Helper.ChainIdAll>>>(async () => {
        const userId = identity?.identifier?.userId
        if (!userId || userId === '$unknown') return EMPTY_LIST
        const cacheKey = `${userId}_${identity.publicKey ?? ''}`
        let cached = addressCache.get(cacheKey)

        if (!cached || identity.isOwner) {
            cached = Promise.allSettled<AddressList>(
                [EVM_IdentityService, SolanaIdentityService].map((x) => x?.lookup(identity) ?? []),
            )
            if (!identity.isOwner) {
                addressCache.set(cacheKey, cached)
            }
        }
        const allSettled = await cached
        const listOfAddress = allSettled.flatMap((x) => (x.status === 'fulfilled' ? x.value : []))
        if (allSettled.every((x) => x.status === 'rejected')) {
            addressCache.delete(cacheKey)
        }
        const sorted = sorter && listOfAddress.length ? listOfAddress.sort(sorter) : listOfAddress
        return includes?.length ? sorted.filter((x) => includes.includes(x.type)) : sorted
    }, [identity, sorter, includes?.join(), EVM_IdentityService?.lookup, SolanaIdentityService?.lookup])
}
