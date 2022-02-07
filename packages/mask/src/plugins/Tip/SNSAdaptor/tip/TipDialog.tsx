import { PluginId, useActivatedPlugin, usePluginIDContext } from '@masknet/plugin-infra'
import { useRemoteControlledDialog } from '@masknet/shared'
import { makeStyles } from '@masknet/theme'
import { EMPTY_LIST, useChainIdValid } from '@masknet/web3-shared-evm'
import { DialogContent } from '@mui/material'
import { useEffect } from 'react'
import { InjectedDialog } from '../../../../components/shared/InjectedDialog'
import { NetworkTab } from '../../../../components/shared/NetworkTab'
import { useI18N } from '../../../../utils'
import { TargetChainIdContext } from '../../contexts'
import { PluginTipMessages } from '../../messages'
import { TipForm } from './TipForm'

const useStyles = makeStyles()((theme) => ({
    abstractTabWrapper: {
        width: '100%',
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(2),
    },
    content: {
        paddingTop: 0,
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    },
}))

interface TipDialogProps {
    open?: boolean
    onClose?: () => void
}

export function TipDialog({ open, onClose }: TipDialogProps) {
    const pluginID = usePluginIDContext()
    const tipDefinition = useActivatedPlugin(PluginId.Tip, 'any')
    const chainIdList = tipDefinition?.enableRequirement.web3?.[pluginID]?.supportedChainIds ?? EMPTY_LIST
    const { t } = useI18N()
    const { classes } = useStyles()
    const chainIdValid = useChainIdValid()

    const { targetChainId, setTargetChainId } = TargetChainIdContext.useContainer()
    const { open: remoteOpen, closeDialog } = useRemoteControlledDialog(PluginTipMessages.tipDialogUpdated)

    useEffect(() => {
        if (!chainIdValid) closeDialog()
    }, [chainIdValid, closeDialog])

    return (
        <InjectedDialog
            open={open || remoteOpen}
            onClose={() => {
                onClose?.()
                closeDialog()
            }}
            title={t('plugin_tip_tip')}>
            <DialogContent className={classes.content}>
                <div className={classes.abstractTabWrapper}>
                    <NetworkTab
                        chainId={targetChainId}
                        setChainId={(id) => {
                            console.log('change chain', id)
                            setTargetChainId(id)
                        }}
                        chains={chainIdList}
                    />
                </div>
                <TipForm />
            </DialogContent>
        </InjectedDialog>
    )
}
