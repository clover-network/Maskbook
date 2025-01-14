import { first } from 'lodash-es'
import { ChainId, chainResolver, isValidAddress, ProviderType } from '@masknet/web3-shared-evm'
import { BaseSCWalletProvider } from './BaseSCWallet.js'
import type { EVM_Provider } from '../types.js'
import { ExtensionSite, getSiteType, PopupRoutes } from '@masknet/shared-base'
import { SharedContextSettings } from '../../../settings/index.js'

/**
 * PayGasX
 * Learn more: https://github.com/DimensionDev/PayGasX
 */
export class SmartPayProvider extends BaseSCWalletProvider implements EVM_Provider {
    constructor() {
        super(ProviderType.SmartPay, {
            isSupportedAccount: () => Promise.resolve(true),
            isSupportedChainId: () => Promise.resolve(true),
            getDefaultAccount: () => '',
            getDefaultChainId: () => ChainId.Matic,
        })
    }

    override async connect(chainId: ChainId) {
        const siteType = getSiteType()
        if (siteType === ExtensionSite.Popup) throw new Error('Cannot connect wallet')

        // connected
        if (chainId === this.chainId && isValidAddress(this.account)) {
            return {
                account: this.account,
                chainId: this.chainId,
            }
        }

        // open popups
        const wallets = await SharedContextSettings.value.getWallets()
        SharedContextSettings.value.openPopupWindow(wallets.length ? PopupRoutes.SelectWallet : PopupRoutes.Wallet, {
            chainId,
        })

        // switch account
        const account = first(await SharedContextSettings.value.selectAccount())
        if (account) await this.switchAccount(account)
        if (!account || account !== this.account)
            throw new Error(`Failed to connect to ${chainResolver.chainFullName(chainId)}.`)

        // switch chain
        if (chainId !== this.chainId) await this.switchChain(chainId)
        if (chainId !== this.chainId) throw new Error(`Failed to connect to ${chainResolver.chainFullName(chainId)}.`)

        return {
            chainId,
            account,
        }
    }
}
