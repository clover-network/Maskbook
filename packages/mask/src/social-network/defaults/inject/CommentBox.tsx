import { memo, useCallback } from 'react'
import type { PostInfo } from '../../PostInfo'
import { DOMProxy, MutationObserverWatcher } from '@dimensiondev/holoflows-kit'
import { CommentBox, CommentBoxProps } from '../../../components/InjectedComponents/CommentBox'
import { createReactRootShadowed } from '../../../utils/shadow-root/renderInShadowRoot'
import { makeStyles } from '@masknet/theme'
import { usePostInfo, PostInfoProvider } from '../../../components/DataSource/usePostInfo'
import { noop } from 'lodash-unified'
import { MaskMessages } from '../../../utils/messages'
import { startWatch } from '../../../utils/watcher'
import type { PostContext } from '@masknet/plugin-infra/src'

const defaultOnPasteToCommentBox = async (
    encryptedComment: string,
    _postContext: PostContext,
    _realCurrent: HTMLElement | null,
) => {
    MaskMessages.events.autoPasteFailed.sendToLocal({ text: encryptedComment })
}

// TODO: should not rely on onPasteToCommentBoxFacebook.
// Use automation.nativeCommentBox.appendText
export const injectCommentBoxDefaultFactory = function <T extends string>(
    onPasteToCommentBox = defaultOnPasteToCommentBox,
    additionPropsToCommentBox: (classes: Record<T, string>) => Partial<CommentBoxProps> = () => ({}),
    useCustomStyles: (props?: any) => { classes: Record<T, string> } = makeStyles()({}) as any,
    mountPointCallback?: (node: DOMProxy<HTMLElement, HTMLSpanElement, HTMLSpanElement>) => void,
) {
    const CommentBoxUI = memo(function CommentBoxUI({ dom }: { dom: HTMLElement | null }) {
        const info = usePostInfo()!
        // TODO:
        const hasMask = true // usePostInfoDetails.containsMaskPayload()
        const { encryptPostComment } = info
        const { classes } = useCustomStyles()
        const props = additionPropsToCommentBox(classes)
        const onCallback = useCallback(
            async (content) => {
                const encryptedComment = await encryptPostComment(content)
                onPasteToCommentBox(encryptedComment, info, dom).catch(console.error)
            },
            [encryptPostComment, info, dom],
        )
        if (!hasMask) return null
        return <CommentBox onSubmit={onCallback} {...props} />
    })
    return (signal: AbortSignal, current: PostInfo) => {
        if (!current.comment?.commentBoxSelector) return noop
        const commentBoxWatcher = new MutationObserverWatcher(
            current.comment.commentBoxSelector.clone(),
            document.body,
        ).useForeach((node, key, meta) => {
            try {
                mountPointCallback?.(meta)
            } catch {}
            const root = createReactRootShadowed(meta.afterShadow, { signal })
            root.render(
                <PostInfoProvider post={current}>
                    <CommentBoxUI {...{ ...current, dom: meta.realCurrent }} />
                </PostInfoProvider>,
            )
            return root.destory
        })
        startWatch(commentBoxWatcher, signal)
        return () => commentBoxWatcher.stopWatch()
    }
}
