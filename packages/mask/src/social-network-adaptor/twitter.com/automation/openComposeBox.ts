import { CrossIsolationMessages, CompositionDialogEvent } from '@masknet/shared-base'
import { makeTypedMessageText, SerializableTypedMessages } from '@masknet/typed-message'

export function openComposeBoxTwitter(
    content: string | SerializableTypedMessages,
    options?: CompositionDialogEvent['options'],
) {
    CrossIsolationMessages.events.compositionDialogEvent.sendToLocal({
        reason: 'timeline',
        open: true,
        content: typeof content === 'string' ? makeTypedMessageText(content) : content,
        options,
    })
}
