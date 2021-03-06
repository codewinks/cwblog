import React, {useEffect} from "react";
import {useApp} from './context/App'
import {useAuth0} from "./context/Auth0";
import {createMuiTheme, makeStyles, ThemeProvider} from '@material-ui/core/styles';
import {Route, Switch, useLocation} from "react-router-dom";
import history from './history';

import CssBaseline from '@material-ui/core/CssBaseline';
import Navigation from "./views/common/Navigation";
import Login from "./views/auth/Login";
import Dashboard from "./views/Dashboard";
import NoMatch from "./views/errors/NoMatch";
import TagList from "./views/tags/List";
import SettingList from "./views/settings/List";
import CategoryList from "./views/categories/List";
import UserList from "./views/users/List";
import RoleList from "./views/roles/List";
import PostList from "./views/posts/List";
import PostForm from "./views/posts/Form";
import PrivateRoute from "./components/PrivateRoute";
import Alert from "./components/Alert";
import {SettingProvider} from './context/Setting'
import {CategoryProvider} from './context/Category'
import {PostProvider} from './context/Post'
import {TagProvider} from './context/Tag'
import {UserProvider} from './context/User'
import {RoleProvider} from "./context/Role";

import './App.css';
import {InviteProvider} from "./context/Invite";
import InviteList from "./views/invites/List";
import Upload from "./routes/Upload";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(12, 4, 6, 4),
    },
}));

function App() {
    const classes = useStyles();
    const {alert, showAlert, hideAlert} = useApp();
    const {loading, isAuthenticated} = useAuth0();
    const location = useLocation();
    const query = new URLSearchParams(location.search);

    const theme = createMuiTheme({
        palette: {
            primary: {
                main: '#004f67',
            },
            secondary: {
                main: '#0aa2d0',
                contrastText: '#ffffff'
            },
        },
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 960,
                lg: 1280,
                xl: 1920,
                xxl: 2560,
            },
        },
    });

    useEffect(() => {
        if (query.get('error') && query.get('error_description')) {
            history.push('/');
            showAlert('error', query.get('error_description'))
        }
        // eslint-disable-next-line
    }, [location])

    if (loading || !isAuthenticated) {
        return (
            <ThemeProvider theme={theme}>
                <Alert variant={alert.variant} message={alert.message} autoHideDuration={alert.autoHideDuration}
                       onClose={hideAlert}/>
                <Login/>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <div className={classes.root}>
                <Alert variant={alert.variant} message={alert.message} autoHideDuration={alert.autoHideDuration}
                       onClose={hideAlert}/>
                <CssBaseline/>
                <Navigation/>

                <main className={classes.content}>
                    <Switch>
                        <PrivateRoute exact path='/' component={Dashboard}/>
                        <PrivateRoute exact path='/posts/create'
                                      render={p => (<PostProvider {...p}><PostForm {...p}/></PostProvider>)}/>
                        <PrivateRoute exact path='/posts/:postId'
                                      render={p => (<PostProvider {...p}><PostForm {...p}/></PostProvider>)}/>
                        <PrivateRoute exact path='/posts'
                                      render={p => (<PostProvider {...p}><PostList {...p}/></PostProvider>)}/>
                        <PrivateRoute exact path='/tags/:tagId'
                                      render={p => (<TagProvider {...p}><TagList {...p}/></TagProvider>)}/>
                        <PrivateRoute exact path='/tags'
                                      render={p => (<TagProvider {...p}><TagList {...p}/></TagProvider>)}/>
                        <PrivateRoute exact path='/categories/:categoryId' render={p => (
                            <CategoryProvider {...p}><CategoryList {...p}/></CategoryProvider>)}/>
                        <PrivateRoute exact path='/categories' render={p => (
                            <CategoryProvider {...p}><CategoryList {...p}/></CategoryProvider>)}/>
                        <PrivateRoute exact path='/users'
                                      render={p => (<UserProvider {...p}><UserList {...p}/></UserProvider>)}/>
                        <PrivateRoute exact path='/users/:userId'
                                      render={p => (<UserProvider {...p}><UserList {...p}/></UserProvider>)}/>
                        <PrivateRoute exact path='/roles/:roleId'
                                      render={p => (<RoleProvider {...p}><RoleList {...p}/></RoleProvider>)}/>
                        <PrivateRoute exact path='/roles'
                                      render={p => (<RoleProvider {...p}><RoleList {...p}/></RoleProvider>)}/>
                        <PrivateRoute exact path='/invites/:inviteId'
                                      render={p => (<InviteProvider {...p}><InviteList {...p}/></InviteProvider>)}/>
                        <PrivateRoute exact path='/invites'
                                      render={p => (<InviteProvider {...p}><InviteList {...p}/></InviteProvider>)}/>
                        <PrivateRoute exact path='/profile'
                                      render={p => (<UserProvider {...p}><UserList {...p}/></UserProvider>)}/>
                        <PrivateRoute exact path='/settings/:settingId'
                                      render={p => (<SettingProvider {...p}><SettingList {...p}/></SettingProvider>)}/>
                        <PrivateRoute exact path='/settings'
                                      render={p => (<SettingProvider {...p}><SettingList {...p}/></SettingProvider>)}/>
                        <PrivateRoute exact path='/upload' component={Upload}/>
                        <Route component={NoMatch}/>
                    </Switch>
                </main>
            </div>
        </ThemeProvider>
    );
}

export default App;
