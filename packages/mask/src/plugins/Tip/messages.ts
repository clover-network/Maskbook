import { createPluginMessage, createPluginRPC, PluginMessageEmitter } from '@masknet/plugin-infra'
import { PLUGIN_ID } from './constants'

interface TipDialogEvent {
    open: boolean
}

export interface TipMessage {
    /**
     * Swap dialog
     */
    tipDialogUpdated: TipDialogEvent

    rpc: unknown
}

if (import.meta.webpackHot) import.meta.webpackHot.accept()
export const PluginTipMessages: PluginMessageEmitter<TipMessage> = createPluginMessage(PLUGIN_ID)
export const PluginTipRPC = createPluginRPC(PLUGIN_ID, () => import('./services'), PluginTipMessages.rpc)
