import { useActivatedPluginsSNSAdaptor } from '@masknet/plugin-infra'
import { isTypedMessageTuple, isWellKnownTypedMessages } from '@masknet/shared-base'
import { makeStyles } from '@masknet/theme'
import { useEffect, useMemo } from 'react'
import { usePostInfoDetails } from '../DataSource/usePostInfo'
import { PayloadReplacerTransformer } from './PayloadReplacer'
import { TypedMessageRender } from '@masknet/typed-message/dom'
import { TypedMessageRenderContext } from '../../../shared-ui/TypedMessageRender/context'
const useStyles = makeStyles()({
    root: {
        overflowWrap: 'break-word',
    },
})

export interface PostReplacerProps {
    zip?: () => void
    unzip?: () => void
}

export function PostReplacer(props: PostReplacerProps) {
    const { classes } = useStyles()
    const postMessage = usePostInfoDetails.rawMessage()
    const hasMaskPayload = usePostInfoDetails.containsMaskPayload()

    const plugins = useActivatedPluginsSNSAdaptor(false)
    const processedPostMessage = useMemo(
        () =>
            plugins.reduce((x, plugin) => {
                try {
                    return plugin.typedMessageTransformer?.(x) ?? x
                } catch {
                    return x
                }
            }, PayloadReplacerTransformer(postMessage)),
        [plugins.map((x) => x.ID).join(), postMessage],
    )
    const shouldReplacePost =
        // replace posts which enhanced by plugins
        (isTypedMessageTuple(processedPostMessage)
            ? processedPostMessage.items.some((x) => !isWellKnownTypedMessages(x))
            : true) ||
        // replace posts which encrypted by Mask
        hasMaskPayload

    // zip/unzip original post
    useEffect(() => {
        if (shouldReplacePost) props.zip?.()
        else props.unzip?.()
    }, [shouldReplacePost])

    return shouldReplacePost ? (
        <span className={classes.root}>
            <TypedMessageRenderContext>
                <TypedMessageRender message={processedPostMessage} />
            </TypedMessageRenderContext>
        </span>
    ) : null
}
