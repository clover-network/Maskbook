import { Icons } from '@masknet/icons'
import { useChainId, useWeb3State } from '@masknet/plugin-infra/web3'
import { makeStyles } from '@masknet/theme'
import { isSameAddress, NetworkPluginID, SocialAddressType } from '@masknet/web3-shared-base'
import { Link, MenuItem, Select, Tooltip, TooltipProps, Typography } from '@mui/material'
import { FC, memo, useRef } from 'react'
import { useTip } from '../../contexts/index.js'
import { Translate, useI18N } from '../../locales/index.js'
import type { TipsAccount } from '../../types/index.js'

const useStyles = makeStyles<void, 'icon' | 'tooltip' | 'pluginIcon' | 'text'>()((theme, _, refs) => {
    return {
        root: {
            height: 40,
            flexGrow: 1,
        },
        menuItem: {
            height: 32,
            color: theme.palette.maskColor.main,
            borderRadius: theme.spacing(1),
            padding: theme.spacing(0, 0.5),
            '&:not(:first-of-type)': {
                marginTop: theme.spacing(1),
            },
        },
        text: {
            fontWeight: 700,
            fontSize: 14,
            fontFamily: 'Helvetica',
            marginLeft: theme.spacing(0.5),
        },
        select: {
            display: 'flex',
            alignItems: 'center',
            [`& .${refs.icon}`]: {
                display: 'none',
            },
            [`& .${refs.pluginIcon}`]: {
                display: 'none',
            },
            [`& .${refs.text}`]: {
                fontWeight: 400,
            },
        },
        menuPaper: {
            '::-webkit-scrollbar': {
                display: 'none',
                opacity: 0,
            },
        },
        menu: {
            maxHeight: 312,
            padding: theme.spacing(1.5),
            borderRadius: theme.spacing(2),
        },
        icon: {
            width: 20,
            height: 20,
        },
        pluginIcon: {},
        link: {
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: 0,
        },
        actionIcon: {
            marginLeft: theme.spacing(0.5),
            color: theme.palette.maskColor.main,
        },
        twitterIcon: {
            borderRadius: '50%',
        },
        checkIcon: {
            marginLeft: 'auto',
            color: '#60DFAB',
            filter: 'drop-shadow(0px 4px 10px rgba(28, 104, 243, 0.2))',
        },
        tooltip: {
            maxWidth: 'unset',
        },
    }
})

const PluginIcon = ({ pluginID }: { pluginID: NetworkPluginID }) => {
    const { classes } = useStyles()
    const mapping = {
        [NetworkPluginID.PLUGIN_EVM]: (
            <Icons.ETH
                size={20}
                className={classes.pluginIcon}
                style={{
                    filter: 'drop-shadow(0px 6px 12px rgba(98, 126, 234, 0.2))',
                    backdropFilter: 'blur(16px)',
                }}
            />
        ),
        [NetworkPluginID.PLUGIN_FLOW]: (
            <Icons.Flow
                size={20}
                className={classes.pluginIcon}
                style={{
                    filter: 'drop-shadow(0px 6px 12px rgba(25, 251, 155, 0.2))',
                    backdropFilter: 'blur(16px)',
                }}
            />
        ),
        [NetworkPluginID.PLUGIN_SOLANA]: (
            <Icons.Solana
                size={20}
                className={classes.pluginIcon}
                style={{
                    filter: 'drop-shadow(0px 6px 12px rgba(25, 251, 155, 0.2))',
                    backdropFilter: 'blur(16px)',
                }}
            />
        ),
    }
    return mapping[pluginID]
}

enum AddressPlatform {
    Facebook = 'facebook',
    Twitter = 'twitter',
    NextId = 'next_id',
}
enum AddressSource {
    ENS = 'ENS',
    RSS3 = 'RSS3',
}
const sourceMap: Partial<Record<SocialAddressType, AddressSource>> = {
    [SocialAddressType.ENS]: AddressSource.ENS,
    [SocialAddressType.RSS3]: AddressSource.RSS3,
}

interface AddressSourceTooltipProps extends Omit<TooltipProps, 'title'> {
    platform?: AddressPlatform
    source?: AddressSource
}

const SourceTooltip: FC<AddressSourceTooltipProps> = ({ platform, source, children }) => {
    const { classes } = useStyles()
    return (
        <Tooltip
            classes={{ tooltip: classes.tooltip }}
            disableInteractive
            title={
                <Typography fontSize={14} lineHeight="18px">
                    {source ? (
                        <Translate.source_tooltip
                            values={{ source: source ?? '' }}
                            components={{
                                Link: (
                                    <Typography component="span" color={(theme) => theme.palette.maskColor.primary} />
                                ),
                            }}
                            context={platform}>
                            {children}
                        </Translate.source_tooltip>
                    ) : (
                        <Translate.source_tooltip_only
                            values={{ context: platform! }}
                            components={{
                                Link: (
                                    <Typography component="span" color={(theme) => theme.palette.maskColor.primary} />
                                ),
                            }}
                            context={platform!}>
                            {children}
                        </Translate.source_tooltip_only>
                    )}
                </Typography>
            }
            arrow
            PopperProps={{
                disablePortal: true,
            }}>
            {children}
        </Tooltip>
    )
}

const TipsAccountSource: FC<{ tipsAccount: TipsAccount }> = ({ tipsAccount }) => {
    const { classes, cx, theme } = useStyles()
    const isLight = theme.palette.mode === 'light'
    const iconStyle = isLight
        ? {
              boxShadow: '0px 6px 12px rgba(28, 104, 243, 0.2)',
              backdropFilter: 'blur(8px)',
          }
        : undefined
    if (tipsAccount.verified)
        return (
            <SourceTooltip platform={AddressPlatform.NextId}>
                <Icons.NextIDMini
                    className={cx(classes.actionIcon, classes.icon)}
                    style={{ ...iconStyle, width: 32, height: 18 }}
                />
            </SourceTooltip>
        )
    if (tipsAccount.isSocialAddress) {
        return (
            <SourceTooltip platform={AddressPlatform.Twitter} source={tipsAccount.type && sourceMap[tipsAccount.type]}>
                <Icons.TwitterRound
                    className={cx(classes.actionIcon, classes.icon, classes.twitterIcon)}
                    style={iconStyle}
                />
            </SourceTooltip>
        )
    }
    return null
}

interface Props {
    className?: string
}
export const RecipientSelect: FC<Props> = memo(({ className }) => {
    const t = useI18N()
    const { classes, cx } = useStyles()
    const selectRef = useRef(null)
    const { recipient, recipients, setRecipient, isSending } = useTip()
    const recipientAddress = recipient?.address
    const { Others } = useWeb3State()
    const chainId = useChainId()

    return (
        <Select
            className={cx(classes.root, className)}
            ref={selectRef}
            value={recipientAddress}
            disabled={isSending}
            classes={{ select: classes.select }}
            onChange={(e) => {
                setRecipient(e.target.value)
            }}
            MenuProps={{
                classes: {
                    paper: classes.menuPaper,
                    list: classes.menu,
                },
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'center',
                },
                container: selectRef.current,
                anchorEl: selectRef.current,
                BackdropProps: {
                    invisible: true,
                },
            }}>
            {recipients.map((tipsAccount) => (
                <MenuItem className={classes.menuItem} key={tipsAccount.address} value={tipsAccount.address}>
                    <PluginIcon pluginID={tipsAccount.pluginId} />
                    <Typography component="span" className={classes.text}>
                        {tipsAccount.name || tipsAccount.address}
                    </Typography>
                    <Link
                        className={cx(classes.link, classes.actionIcon, classes.icon)}
                        onClick={(e) => e.stopPropagation()}
                        href={Others?.explorerResolver.addressLink(chainId, tipsAccount.address) ?? ''}
                        target="_blank"
                        title={t.view_on_explorer()}
                        rel="noopener noreferrer">
                        <Icons.LinkOut size={20} />
                    </Link>
                    <TipsAccountSource tipsAccount={tipsAccount} />
                    {isSameAddress(tipsAccount.address, recipientAddress) ? (
                        <Icons.CheckCircle className={cx(classes.checkIcon, classes.icon)} />
                    ) : null}
                </MenuItem>
            ))}
        </Select>
    )
})