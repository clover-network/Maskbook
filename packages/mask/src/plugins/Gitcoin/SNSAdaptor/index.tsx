import { useMemo } from 'react'
import { ChainId } from '@masknet/web3-shared-evm'
import { NetworkPluginID, Plugin, useChainId } from '@masknet/plugin-infra'
import MaskPluginWrapper from '../../MaskPluginWrapper'
import { extractTextFromTypedMessage, parseURL } from '@masknet/shared-base'
import { usePostInfoDetails } from '../../../components/DataSource/usePostInfo'
import { PreviewCard } from './PreviewCard'
import { base } from '../base'
import { PLUGIN_NAME, PLUGIN_META_KEY } from '../constants'
import { DonateDialog } from './DonateDialog'
import { EthereumChainBoundary } from '../../../web3/UI/EthereumChainBoundary'

const isGitcoin = (x: string): boolean => /^https:\/\/gitcoin.co\/grants\/\d+/.test(x)
const isGitCoinSupported = (chainId: ChainId) => [ChainId.Mainnet, ChainId.Matic].includes(chainId)

const sns: Plugin.SNSAdaptor.Definition = {
    ...base,
    init(signal) {},
    DecryptedInspector: function Comp(props) {
        const link = useMemo(() => {
            const x = extractTextFromTypedMessage(props.message)
            if (x.none) return null
            return parseURL(x.val).find(isGitcoin)
        }, [props.message])
        if (!link) return null
        return <Renderer url={link} />
    },
    CompositionDialogMetadataBadgeRender: new Map([[PLUGIN_META_KEY, () => PLUGIN_NAME]]),
    GlobalInjection() {
        return <DonateDialog />
    },
    PostInspector() {
        const links = usePostInfoDetails.mentionedLinks()

        const link = links.find(isGitcoin)
        if (!link) return null
        return <Renderer url={link} />
    },
}

function Renderer(props: React.PropsWithChildren<{ url: string }>) {
    const [id = ''] = props.url.match(/\d+/) ?? []
    const chainId = useChainId(NetworkPluginID.PLUGIN_EVM)
    return (
        <MaskPluginWrapper pluginName="Gitcoin">
            <EthereumChainBoundary chainId={isGitCoinSupported(chainId) ? chainId : ChainId.Mainnet}>
                <PreviewCard id={id} />
            </EthereumChainBoundary>
        </MaskPluginWrapper>
    )
}

export default sns
