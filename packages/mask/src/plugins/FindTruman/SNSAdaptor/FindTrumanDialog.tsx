import { Box, DialogActions, DialogContent, Tab, Typography } from '@mui/material'
import { TabContext, TabPanel } from '@mui/lab'
import { InjectedDialog, PluginWalletStatusBar, ChainBoundary } from '@masknet/shared'
import { makeStyles, MaskTabList, useTabs } from '@masknet/theme'
import AssetsPanel from './AssetsPanel.js'
import ParticipatePanel from './ParticipatePanel.js'
import { useContext } from 'react'
import type { FindTrumanI18nFunction } from '../types.js'
import { FindTrumanContext } from '../context.js'
import { useChainContext } from '@masknet/web3-hooks-base'
import { useConst } from './hooks/useConst.js'
import IntroductionPanel from './IntroductionPanel.js'
import { useI18N } from '../../../utils/index.js'
import { NetworkPluginID } from '@masknet/shared-base'

const useStyles = makeStyles()((theme, props) => ({
    wrapper: {
        paddingBottom: '0 !important',
        '::-webkit-scrollbar': {
            backgroundColor: 'transparent',
            width: 20,
        },
        '::-webkit-scrollbar-thumb': {
            borderRadius: '20px',
            width: 5,
            border: '7px solid rgba(0, 0, 0, 0)',
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(250, 250, 250, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            backgroundClip: 'padding-box',
        },
    },
    tabPaneWrapper: {
        width: '100%',
        marginBottom: '24px',
    },
    tabPane: {
        width: 535,
        margin: '0 auto',
        padding: 0,
    },
    power: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '8px 16px',
    },
    icon: {
        width: 22,
        height: 22,
        paddingLeft: 12,
    },
    actions: {
        padding: 0,
        display: 'block',
    },
    statusBar: {
        margin: 0,
    },
}))

interface FindTrumanDialogProps {
    onClose(): void
    open: boolean
}

export function FindTrumanDialog(props: FindTrumanDialogProps) {
    const { t: i18N } = useI18N()
    const { open, onClose } = props
    const { consts, t } = useConst()
    const { classes } = useStyles()
    const { account, chainId } = useChainContext<NetworkPluginID.PLUGIN_EVM>()

    const [currentTab, onChange, tabs] = useTabs(
        FindTrumanDialogTab.Introduction,
        FindTrumanDialogTab.Assets,
        FindTrumanDialogTab.Participate,
    )

    return (
        <FindTrumanContext.Provider
            value={{
                address: account,
                const: consts,
                t,
            }}>
            <TabContext value={currentTab}>
                <InjectedDialog
                    open={open}
                    onClose={onClose}
                    title="FindTruman"
                    titleTabs={<FindTrumanDialogTabs tabs={tabs} onChange={onChange} />}>
                    <DialogContent className={classes.wrapper}>
                        {consts && (
                            <Box className={classes.tabPaneWrapper}>
                                <TabPanel className={classes.tabPane} value={FindTrumanDialogTab.Introduction}>
                                    <IntroductionPanel />
                                </TabPanel>
                                <TabPanel className={classes.tabPane} value={FindTrumanDialogTab.Assets}>
                                    <AssetsPanel />
                                </TabPanel>
                                <TabPanel className={classes.tabPane} value={FindTrumanDialogTab.Participate}>
                                    <ParticipatePanel storyId={consts.storyId} />
                                </TabPanel>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions className={classes.actions}>
                        <Box className={classes.power}>
                            <Typography
                                sx={{ marginRight: 1 }}
                                variant="body1"
                                color="textSecondary"
                                fontSize={14}
                                fontWeight={700}>
                                {i18N('plugin_findtruman_powered_by')}
                            </Typography>
                            <Typography variant="body1" color="textPrimary" fontSize={14} fontWeight={700}>
                                {i18N('plugin_findtruman_find_truman')}
                            </Typography>
                            <img
                                className={classes.icon}
                                src={new URL('../assets/findtruman.png', import.meta.url).toString()}
                            />
                        </Box>
                        <PluginWalletStatusBar className={classes.statusBar}>
                            <ChainBoundary expectedPluginID={NetworkPluginID.PLUGIN_EVM} expectedChainId={chainId} />
                        </PluginWalletStatusBar>
                    </DialogActions>
                </InjectedDialog>
            </TabContext>
        </FindTrumanContext.Provider>
    )
}

enum FindTrumanDialogTab {
    Introduction = 'introduction',
    Assets = 'assets',
    Participate = 'participate',
}

interface FindTrumanDialogTabsProps
    extends withClasses<'tab' | 'tabs' | 'tabPanel' | 'indicator' | 'focusTab' | 'tabPaper'> {
    tabs: Record<FindTrumanDialogTab, FindTrumanDialogTab>
    onChange: (event: unknown, value: string) => void
}

function getFindTrumanDialogTabName(t: FindTrumanI18nFunction, type: FindTrumanDialogTab) {
    switch (type) {
        case FindTrumanDialogTab.Introduction:
            return t('plugin_find_truman_dialog_tab_introduction')
        case FindTrumanDialogTab.Assets:
            return t('plugin_find_truman_dialog_tab_assets')
        case FindTrumanDialogTab.Participate:
            return t('plugin_find_truman_dialog_tab_participate')
    }
}

function FindTrumanDialogTabs(props: FindTrumanDialogTabsProps) {
    const { t } = useContext(FindTrumanContext)
    const { onChange, tabs } = props

    return (
        <MaskTabList variant="base" onChange={onChange} aria-label="FindTrumanTabs">
            <Tab
                label={<span>{getFindTrumanDialogTabName(t, FindTrumanDialogTab.Introduction)}</span>}
                value={tabs.introduction}
            />
            <Tab label={<span>{getFindTrumanDialogTabName(t, FindTrumanDialogTab.Assets)}</span>} value={tabs.assets} />
            <Tab
                label={<span>{getFindTrumanDialogTabName(t, FindTrumanDialogTab.Participate)}</span>}
                value={tabs.participate}
            />
        </MaskTabList>
    )
}
