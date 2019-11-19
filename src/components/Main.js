import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { User, Compass, Bell, Home } from 'react-feather';

import { UserFeed, Explore, Profile, Notifications, Button, NewListForm, NewPostForm, ListPage, PostComp, LoadingScreen } from './index';
import { getNotifs, getNewNotifsCount } from '../actions';
import { breakpoint } from '../utils/styleConsts';

const Main = (props) => {

    const { anylistUser, notifs, newNotifs } = props;
    const { getNotifs, getNewNotifsCount } = props;

	const { username, followedLists = [], followedPosts = [], other } = anylistUser.attrs;

    useEffect (() => {
		if (anylistUser._id) {
			getNotifs(username, [...followedLists, ...followedPosts], 0, 20);
            getNewNotifsCount(username, [...followedLists, ...followedPosts], other.lastSeenNotif);
        }
	}, [anylistUser]);

    return !username ?
    (<LoadingScreen/>) 
    :
    (
        <Router>
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
                    </div>
                </nav>
                <div id = "main">
                    <Switch>
                        <Route exact path = "/" component = {UserFeed}/>
                        <Route exact path = "/explore" component = {Explore}/>
                        <Route exact path = "/notifications" component = {Notifications}/>
                        <Route exact path = "/follows" render = {(props) => (<div></div>)}/>
                        <Route path = "/newList" component = {NewListForm}/>
                        <Route exact path = "/:id" component = {Profile}/>
                        <Route exact path = {`/list/:id`} component = {ListPage}/>
                        <Route path = {`/${username}/:id/newPost`} component = {NewPostForm}/>
                        <Route exact path = "/post/:id" render = {(props) => <PostComp {...props} preview = {false}/>}/>
                    </Switch>
                </div>
                <div id = "aside">
                </div>
                
            </MainWrapper>
        </Router>
    )
}

const mstp = (state) => {
    return {
        anylistUser: state.auth.anylistUser,
        notifs: state.notifs.notifications,
        newNotifs: state.notifs.newNotifs
    }
}

export default connect(mstp, {getNotifs, getNewNotifsCount})(withRouter(Main));

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

        div {
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
    }

    #main {
        grid-area: main;
        display: flex;
        justify-content: center;
    }
    #aside {
        grid-area: side;
    }

    @media only screen and (max-width: ${breakpoint.a}) {
        display: unset;
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
