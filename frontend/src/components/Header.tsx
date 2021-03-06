import React from 'react';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { AppBar, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import { setAccessToken } from '../auth/accessToken';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import clsx from 'clsx';
import { useHistory } from 'react-router';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    hide: {
      display: 'none'
    }
  })
);

interface Props {
  handleDrawerOpen: () => void;
  drawerOpen: boolean;
}

export const Header: React.FC<Props> = props => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { data, loading } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();
  const history = useHistory();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const redirectToSignIn = () => {
    history.push('/signin');
  };

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: props.drawerOpen
      })}
    >
      <Toolbar>
        {!loading && data && data.me && (
          <IconButton
            edge="start"
            className={clsx(
              classes.menuButton,
              props.drawerOpen && classes.hide
            )}
            color="inherit"
            aria-label="menu"
            onClick={props.handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" className={classes.title}>
          Sysroc
        </Typography>
        {!loading && data && data.me ? (
          <div>
            Hello, {data.me.user?.name}
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={handleClose}
            >
              {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
              <MenuItem
                onClick={() => {
                  history.push('/settings');
                  handleClose();
                }}
              >
                Settings
              </MenuItem>
              <MenuItem
                onClick={async () => {
                  await logout();
                  setAccessToken('');
                  history.push('/');
                  window.location.reload();
                  await client!.resetStore();
                  handleClose();
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <Button
            aria-label="sign in button"
            aria-controls="menu-appbar"
            color="inherit"
            onClick={redirectToSignIn}
          >
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};
