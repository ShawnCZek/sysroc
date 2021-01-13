import React from 'react';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SchoolIcon from '@material-ui/icons/School';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import AssignmentIndRoundedIcon from '@material-ui/icons/AssignmentIndRounded';
import GroupRoundedIcon from '@material-ui/icons/GroupRounded';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Header } from './Header';
import { Loading } from './Loading';
import { useHistory } from 'react-router';
import { useHasPermissions } from '../hooks/hasPermissions.hook';
import { PERMISSIONS } from '../generated/permissions';
import { useMeQuery } from '../generated/graphql';
import { isAdmin } from '../auth/roles';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
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
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(7, 10),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
}));

export const PersistentDrawerLeft: React.FC = props => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();

  const [open, setOpen] = React.useState(false);

  const { data, loading } = useMeQuery();

  const canViewProjects = useHasPermissions(PERMISSIONS.PROJECTS_VIEW);
  const canViewUsers = useHasPermissions(PERMISSIONS.MANAGE_STUDENT_USERS, PERMISSIONS.MANAGE_TEACHER_USERS);
  const canViewClassification = useHasPermissions(PERMISSIONS.CLASSIFICATION_VIEW);
  const canViewGroups = useHasPermissions(PERMISSIONS.GROUP_MANAGE);
  const canManageRoles = isAdmin(data?.me?.user);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  if (loading) return <Loading />;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header drawerOpen={open} handleDrawerOpen={handleDrawerOpen} />
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem
            button
            onClick={() => {
              history.push('/');
            }}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          { canViewProjects &&
            <ListItem
              button
              onClick={() => {
                history.push('/projects');
              }}
            >
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Projects" />
            </ListItem>
          }
          { canViewUsers &&
            <ListItem
              button
              onClick={() => {
                history.push('/users');
              }}
            >
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItem>
          }
          { canViewClassification &&
            <ListItem
              button
              onClick={() => {
                history.push('/classification');
              }}
            >
              <ListItemIcon>
                <EmojiEventsIcon />
              </ListItemIcon>
              <ListItemText primary="Classification" />
            </ListItem>
          }
          { canManageRoles &&
            <ListItem button onClick={() => history.push('/roles')}>
              <ListItemIcon>
                <AssignmentIndRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Roles" />
            </ListItem>
          }
          { canViewGroups &&
            <ListItem button onClick={() => history.push('/groups')}>
              <ListItemIcon>
                <GroupRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Groups" />
            </ListItem>
          }
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open
        })}
      >
        <div className={classes.drawerHeader} />
        {props.children}
      </main>
    </div>
  );
};
