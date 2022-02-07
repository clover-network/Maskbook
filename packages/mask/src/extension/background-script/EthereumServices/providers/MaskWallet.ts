import MaskWallet from 'web3'
import type { HttpProvider } from 'web3-core'
import { PopupRoutes } from '@masknet/shared-base'
import { ChainId, getChainRPC, ProviderType } from '@masknet/web3-shared-evm'
import { currentChainIdSettings } from '../../../../plugins/Wallet/settings'
import { getWallets, selectAccountPrepare } from '../../../../plugins/Wallet/services'
import { openPopupWindow } from '../../HelperService'
import type { Provider, ProviderOptions, Web3Options } from '../types'

export class MaskWalletProvider implements Provider {
    private seed = Math.floor(Math.random() * 4)
    private providerPool = new Map<string, HttpProvider>()
    private instancePool = new Map<string, MaskWallet>()

    private createWeb3Instance(provider: HttpProvider) {
        return (
            this.instancePool.get(provider.host) ??
            (() => {
                const newInstance = new MaskWallet(provider)
                this.instancePool.set(provider.host, newInstance)
                return newInstance
            })()
        )
    }

    async createProvider({ url = '' }: ProviderOptions) {
        if (!url) throw new Error('Invalid provider url.')
        const provider =
            this.providerPool.get(url) ??
            new MaskWallet.providers.HttpProvider(url, {
                timeout: 3 * 1000, // ms
                // @ts-ignore
                clientConfig: {
                    keepalive: true,
                    keepaliveInterval: 1, // ms
                },
                reconnect: {
                    auto: true,
                    delay: 5000, // ms
                    maxAttempts: Number.MAX_SAFE_INTEGER,
                    onTimeout: true,
                },
            })
        this.providerPool.set(url, provider)
        return provider
    }

    async createWeb3({ chainId = currentChainIdSettings.value, keys = [], url }: Web3Options) {
        const provider = await this.createProvider({
            chainId,
            url: url || getChainRPC(chainId, this.seed),
        })
        const web3 = this.createWeb3Instance(provider)
        if (keys.length) {
            web3.eth.accounts.wallet.clear()
            keys.forEach((k) => k && k !== '0x' && web3.eth.accounts.wallet.add(k))
        }
        return web3
    }

    async requestAccounts(chainId?: ChainId) {
        const wallets = await getWallets(ProviderType.MaskWallet)
        return new Promise<{
            chainId: ChainId
            accounts: string[]
        }>(async (resolve, reject) => {
            try {
                await selectAccountPrepare((accounts, chainId) => {
                    resolve({
                        chainId,
                        accounts,
                    })
                })
                await openPopupWindow(wallets.length > 0 ? PopupRoutes.SelectWallet : undefined, {
                    chainId,
                })
            } catch {
                reject(new Error('Failed to connect to Mask Network.'))
            }
        })
    }
}
