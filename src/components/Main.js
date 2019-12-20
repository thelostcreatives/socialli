import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { User, Compass, Bell, Home } from 'react-feather';

import { UserFeed, Explore, Profile, Notifications, 
         Button, NewListForm, NewPostForm, ListPage, 
         PostComp, LoadingScreen, Settings, NoAccessMessage } from './index';
import { handleSignOut, getNotifs, getNewNotifsCount, getSocialliConfig } from '../actions';
import { breakpoint } from '../utils/styleConsts';

import socialli_config from '../socialli_config';

const Main = (props) => {

    const { anylistUser, userSession, newNotifs, socialliConfig } = props;
    const { getNotifs, getNewNotifsCount, getSocialliConfig } = props;

    const { username, followedLists = [], followedPosts = [], other } = anylistUser ? anylistUser.attrs : {};
    const { _id, isPublic, blockedUsers = [], members = [] } = socialliConfig ?  socialliConfig.attrs : {};

    const isOwner = username === socialli_config.host;

    useEffect (() => {
		if (anylistUser._id) {
			getNotifs(username, [...followedLists, ...followedPosts], 0, 20);
            getNewNotifsCount(username, [...followedLists, ...followedPosts], other.lastSeenNotif);
        } 
        if (!socialliConfig._id){
            getSocialliConfig(socialli_config.host);
        }
	}, [anylistUser, socialliConfig]);

    return !username ?
    (<LoadingScreen/>) 
    :
    (
        <Router>
            {
                _id || isOwner ?
                    (isPublic && !blockedUsers.includes(username)) || (!isPublic && members.includes(username)) || isOwner ?
                    <MainWrapper>
                        <nav id = "nav">
                            <div>
                                <NavLink exact to = "/" activeStyle = { NavActiveStyle }>
                                    <Home/>
                                    <span>Home</span>
                                </NavLink>
                                <NavLink exact to = "/explore" activeStyle = { NavActiveStyle }>
                                    <Compass/>
                                    <span>Explore</span>
                                </NavLink>
                                {/* <NavLink exact to = "/follows" activeStyle = { NavActiveStyle }>Follows</NavLink> */}
                                <NavLink exact to = "/notifications" activeStyle = { NavActiveStyle }>
                                    <Bell/>
                                    {newNotifs > 0 ?
                                        <div id = "new-notifs"/>
                                        :
                                        null
                                    }
                                    <span>Notifications</span>
                                </NavLink>
                                <NavLink exact to = {`/${username}`} activeStyle = { NavActiveStyle }>
                                    <User/>
                                    <span>Profile</span>
                                </NavLink>

                                <div className = "other-links">
                                    {
                                        socialli_config.host === username ? 
                                        <NavLink exact to = "/settings" className = "basic-link">Settings</NavLink>
                                        :
                                        null
                                    }
                                </div>
                                
                            </div>
                        </nav>
                        <div id = "main">
                            <Switch>
                                <Route exact path = "/" component = {UserFeed}/>
                                <Route exact path = "/explore" component = {Explore}/>
                                <Route exact path = "/notifications" component = {Notifications}/>
                                <Route exact path = "/follows" render = {(props) => (<div></div>)}/>
                                <Route path = "/newList" component = {NewListForm}/>
                                {
                                    socialli_config.host === username ? 
                                    <Route exact path = "/settings" component = {Settings}/>
                                    :
                                    null
                                }
                                <Route exact path = "/:id" component = {Profile}/>
                                <Route exact path = {`/list/:id`} component = {ListPage}/>
                                <Route path = {`/${username}/:id/newPost`} component = {NewPostForm}/>
                                <Route exact path = "/post/:id" render = {(props) => <PostComp {...props} preview = {false}/>}/>
                            </Switch>
                        </div>
                        <div id = "aside">
                        </div>
                    </MainWrapper>
                    :
                    <MainWrapper>
                        <div id = "main">
                            <NoAccessMessage socialliConfig = {socialliConfig} />
                        </div>
                    </MainWrapper>
                :
                <MainWrapper>
                    <div id = "main">
                        <NoAccessMessage/>
                    </div>
                </MainWrapper>
            }
        </Router>
    )
}

const mstp = (state) => {
    return {
        anylistUser: state.auth.anylistUser,
        userSession: state.auth.userSession,
        notifs: state.notifs.notifications,
        newNotifs: state.notifs.newNotifs,
        socialliConfig: state.settings.socialliConfig 
    }
}

export default connect(mstp, {handleSignOut, getNotifs, getNewNotifsCount, getSocialliConfig})(withRouter(Main));

const MainWrapper = styled.div`
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    display: grid;
    height: 100%;
    grid-template-areas: "nav main side";
    grid-template-rows: 1fr;
    grid-template-columns: .8fr 3fr .5fr;
    

    font-family: 'Work Sans', sans-serif;

    a {
        color: black;
        &:hover{
            color: grey;
        }
    }

    .DraftEditor-root {
        margin: 10px 0;
        line-height: initial;
	}

    #nav {
        grid-area: nav;

        // position: relative;

        & > div {
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            padding: 0 0 0 50px;
            
            font-family: 'Work Sans', sans-serif;
            font-size: 25px;
            position: fixed;
            top: 0;
            a {
                display: flex;
                align-items: center;
                position: relative;

                text-decoration: none;
                color: black;
                padding: 10px;
                width: 100%;

                span {
                    margin-left: 10px;
                }

                &:hover {
                    background: #f7f7f7;
                    cursor: pointer;
                }
            }

            

            .active {
                svg {
                    stroke-width: 2.5;
                }
            }
        }

        #new-notifs {
            position: absolute;
            background: black;
            border: 2px solid white;
            border-radius: 100%;
            width: 12px !important;
            height: 12px;
            margin: 0;
            padding: 0;

            left: 23px;
            top: 11px;
        }

        .other-links {
            margin-top: 10px;
            a {
                padding: 0 0 0 10px;
                width: min-content;
                font-size: 12px;
                &:hover {
                    background: none;
                    text-decoration: underline;
                }
            }
        }
    }

    #main {
        grid-area: main;
        display: flex;
        justify-content: center;
    }
    #aside {
        grid-area: side;
    }

    #message {
        height: 80vh;

        width: 500px;

        display: flex;
        flex-direction: column;
        justify-content: center;

        margin: 10px;

        p {
            max-width: 500px;
            margin: 20px 0;
        }

        
    }

    

    @media only screen and (max-width: ${breakpoint.a}) {
        display: unset;
        width: 100%;
        #nav {
            grid-area: none;
            position: fixed;
            bottom: 0;
            z-index: 10;

            div {
                position: fixed;
                top: unset;
                bottom: 0;
                left: 0;

                padding: 0;
                width: 100%;

                flex-direction: row;
                justify-content: space-evenly;

                background: white;
                border-top: 1px solid #d2d6d7;

                a {
                    width: min-content;
                    span {
                        display: none;
                    }
                }
            }

            .other-links {
                display: none;
            }
        }
        #main {
            grid-area: none;
            width: unset;
            margin-bottom: 50px;
        }
        #aside {
            grid-area: none;
        }
    }
`;

const NavActiveStyle = {
    color: "black",
    fontWeight: "bold",
}
