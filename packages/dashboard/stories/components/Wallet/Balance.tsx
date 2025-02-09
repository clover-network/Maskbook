import { story } from '@masknet/storybook-shared'
import { Balance as C } from '../../../src/pages/Wallets/components/Balance/index.js'
import { action } from '@storybook/addon-actions'
const { meta, of } = story(C)

export default meta({ title: 'Components/Wallet/Balance Card' })

export const BalanceCard = of({
    args: {
        onBuy: action('onBuy'),
        onSend: action('onSend'),
        onSwap: action('onSwap'),
        onReceive: action('onReceive'),
    },
})
