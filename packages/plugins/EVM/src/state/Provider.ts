import { getEnumAsArray } from '@dimensiondev/kit'
import type { Plugin } from '@masknet/plugin-infra'
import { ProviderState, ProviderStorage } from '@masknet/plugin-infra/web3'
import { EnhanceableSite, ExtensionSite } from '@masknet/shared-base'
import { Account, isSameAddress } from '@masknet/web3-shared-base'
import {
    ChainId,
    isValidAddress,
    NetworkType,
    ProviderType,
    Web3,
    Web3Provider,
    chainResolver,
    providerResolver,
    isValidChainId,
} from '@masknet/web3-shared-evm'
import { SharedContextSettings } from '../settings'
import { Providers } from './Connection/provider'

export class Provider extends ProviderState<ChainId, ProviderType, NetworkType, Web3Provider, Web3> {
    constructor(context: Plugin.Shared.SharedContext) {
        const defaultValue: ProviderStorage<Account<ChainId>, ProviderType> = {
            accounts: Object.fromEntries(
                getEnumAsArray(ProviderType).map((x) => [
                    x.value,
                    {
                        account: '',
                        chainId: ChainId.Mainnet,
                    },
                ]),
            ) as Record<ProviderType, Account<ChainId>>,
            providers: Object.fromEntries(
                [...getEnumAsArray(EnhanceableSite), ...getEnumAsArray(ExtensionSite)].map((x) => [
                    x.value,
                    ProviderType.MaskWallet,
                ]),
            ) as Record<EnhanceableSite | ExtensionSite, ProviderType>,
        }

        super(context, Providers, defaultValue, {
            isSameAddress,
            isValidAddress,
            isValidChainId,
            getDefaultChainId: () => ChainId.Mainnet,
            getDefaultNetworkType: () => NetworkType.Ethereum,
            getNetworkTypeFromChainId: (chainId: ChainId) =>
                chainResolver.chainNetworkType(chainId) ?? NetworkType.Ethereum,
        })
    }

    override async connect(chainId: ChainId, providerType: ProviderType): Promise<Account<ChainId>> {
        const account = await super.connect(chainId, providerType)

        // add wallet into db
        await SharedContextSettings.value.updateWallet(account.account, {
            name: providerResolver.providerName(providerType)!,
        })

        return account
    }
}