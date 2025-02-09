import { Button, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { makeStyles } from '@masknet/theme'
import formatDateTime from 'date-fns/format'
import { File } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import { useI18N } from '../../locales/i18n_generated.js'
import { FileRouter } from '../../constants.js'
import type { FileInfo } from '../../types.js'

const useStyles = makeStyles()((theme) => ({
    container: {
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        width: 150,
        paddingLeft: 10,
    },
    heading: {
        lineHeight: 1.1,
        color: theme.palette.text.primary,
        marginTop: 0,
        marginBottom: 10,
    },
    listing: {
        flex: 1,
    },
    more: {
        fontSize: 14,
        lineHeight: 1.2,
        color: theme.palette.primary.contrastText,
    },
    root: {
        margin: 0,
        marginLeft: 3,
    },
    primary: {
        fontSize: 12,
        lineHeight: 1.1,
        color: theme.palette.text.primary,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
    secondary: {
        fontSize: 10,
        lineHeight: 1.2,
        color: theme.palette.text.secondary,
    },
    itemRoot: {
        padding: 0,
        paddingBottom: 10,
        userSelect: 'none',
        cursor: 'pointer',
    },
    itemIconRoot: {
        minWidth: 32,
    },
}))

interface Props {
    files: FileInfo[]
    onMore?(): void
}

export const RecentFiles: React.FC<Props> = ({ files, onMore }) => {
    const t = useI18N()
    const navigate = useNavigate()
    const { classes } = useStyles()
    const onClick = (info: FileInfo) => () => {
        navigate(FileRouter.Uploaded, { state: info })
    }
    const renderItem = (file: FileInfo, index: number) => (
        <ListItem classes={{ root: classes.itemRoot }} key={index} onClick={onClick(file)}>
            <ListItemIcon classes={{ root: classes.itemIconRoot }}>
                <File width={32} height={32} />
            </ListItemIcon>
            <ListItemText
                classes={{
                    root: classes.root,
                    primary: classes.primary,
                    secondary: classes.secondary,
                }}
                primary={file.name}
                secondary={formatDateTime(file.createdAt, 'yyyy-MM-dd HH:mm')}
            />
        </ListItem>
    )
    return (
        <section className={classes.container}>
            <Typography className={classes.heading}>{t.recent_files()}</Typography>
            <List className={classes.listing}>{files.slice(0, 4).map(renderItem)}</List>
            {onMore && (
                <Button className={classes.more} onClick={onMore}>
                    {t.show_more()}
                </Button>
            )}
        </section>
    )
}
