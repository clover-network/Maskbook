import type { Plugin } from '@masknet/plugin-infra'
import { RootContext } from '../contexts'
import { base } from '../base'
import { TipDialog } from './tip'

const sns: Plugin.SNSAdaptor.Definition = {
    ...base,
    init(signal) {},
    GlobalInjection: function Component() {
        return (
            <RootContext>
                <TipDialog />
            </RootContext>
        )
    },
}

export default sns
