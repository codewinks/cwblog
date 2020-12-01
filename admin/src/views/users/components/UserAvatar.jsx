import {makeStyles} from '@material-ui/core/styles';
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import React from "react";

const useStyles = makeStyles(theme => ({
    isOnline: {
        '& .MuiBadge-badge': {
            backgroundColor: '#44b700',
            color: '#44b700',
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: '$ripple 1.2s infinite ease-in-out',
                border: '1px solid currentColor',
                content: '""',
            },
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

const UserAvatar = ({user}) => {
    const classes = useStyles();
    return (
        <Badge
            overlap="circle"
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            variant="dot"
            className={classes.isOnline}
        >
            <Avatar alt={user.first_name} src={user.avatar}/>
        </Badge>
    )
}

export default UserAvatar;