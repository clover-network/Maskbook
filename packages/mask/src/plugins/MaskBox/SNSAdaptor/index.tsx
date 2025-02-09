import { useMemo } from 'react'
import { type Plugin, usePluginWrapper, usePostInfoDetails } from '@masknet/plugin-infra/content-script'
import { base } from '../base.js'
import { extractTextFromTypedMessage } from '@masknet/typed-message'
import { Trans } from 'react-i18next'
import { parseURLs } from '@masknet/shared-base'
import { PreviewCard } from './components/PreviewCard.js'
import { Context } from '../hooks/useContext.js'
import { ApplicationEntry } from '@masknet/shared'
import { openWindow } from '@masknet/shared-base-ui'
import { Icons } from '@masknet/icons'

const isMaskBox = (x: string) => x.startsWith('https://box-beta.mask.io') || x.startsWith('https://box.mask.io')

const sns: Plugin.SNSAdaptor.Definition = {
    ...base,
    init(signal) {},
    DecryptedInspector(props) {
        const link = useMemo(() => {
            const x = extractTextFromTypedMessage(props.message)
            if (x.none) return null
            return parseURLs(x.val).find(isMaskBox)
        }, [props.message])
        if (!link) return null
        return <Renderer url={link} />
    },
    PostInspector() {
        const links = usePostInfoDetails.mentionedLinks()
        const link = links.find(isMaskBox)
        if (!link) return null
        return <Renderer url={link} />
    },
    ApplicationEntries: [
        (() => {
            const icon = <Icons.MaskBox />
            const name = <Trans i18nKey="plugin_mask_box_name" />
            const iconFilterColor = 'rgba(0, 87, 255, 0.3)'
            return {
                ApplicationEntryID: base.ID,
                RenderEntryComponent({ disabled }) {
                    return (
                        <ApplicationEntry
                            title={name}
                            disabled={disabled}
                            iconFilterColor={iconFilterColor}
                            icon={icon}
                            onClick={() => openWindow('https://box.mask.io/#/')}
                        />
                    )
                },
                appBoardSortingDefaultPriority: 7,
                marketListSortingPriority: 4,
                icon,
                tutorialLink: 'https://realmasknetwork.notion.site/d0941687649a4ef7a38d71f23ecbe4da',
                description: <Trans i18nKey="plugin_mask_box_description" />,
                category: 'dapp',
                iconFilterColor,
                name,
            }
        })(),
    ],
}

export default sns

function Renderer(
    props: React.PropsWithChildren<{
        url: string
    }>,
) {
    const [, matchedChainId] = props.url.match(/chain=(\d+)/i) ?? []
    const [, boxId] = props.url.match(/box=(\d+)/i) ?? []
    const [, hashRoot] = props.url.match(/rootHash=([\dA-Za-z]+)/) ?? []

    const shouldNotRender = !matchedChainId || !boxId
    usePluginWrapper(!shouldNotRender)
    if (shouldNotRender) return null

    return (
        <Context.Provider initialState={{ boxId, hashRoot }}>
            <PreviewCard />
        </Context.Provider>
    )
}
