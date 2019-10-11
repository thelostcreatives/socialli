import React, {} from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { UserFeed, Explore, Profile, Button, NewListForm, NewPostForm, ListPage, PostComp } from './index';

const Main = (props) => {

    const { user } = props;

    return(
        <Router>
            <MainWrapper>
                <nav id = "nav">
                    <NavLink exact to = "/" activeStyle = { NavActiveStyle }>Home</NavLink>
                    <NavLink exact to = "/explore" activeStyle = { NavActiveStyle }>Explore</NavLink>
                    <NavLink exact to = "/follows" activeStyle = { NavActiveStyle }>Follows</NavLink>
                    <NavLink exact to = {`/${user.attrs.username}`} activeStyle = { NavActiveStyle }>Profile</NavLink>
                </nav>
                <div id = "main">
                    <Switch>
                        <Route exact path = "/" component = {UserFeed}/>
                        <Route exact path = "/explore" component = {Explore}/>
                        <Route exact path = "/follows" render = {(props) => (<div></div>)}/>
                        <Route path = "/newList" component = {NewListForm}/>
                        <Route exact path = "/:id" component = {Profile}/>
                        <Route exact path = {`/list/:id`} component = {ListPage}/>
                        <Route path = {`/${user.attrs.username}/:id/newPost`} component = {NewPostForm}/>
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
        user: state.auth.anylistUser
    }
}

export default connect(mstp, {})(withRouter(Main));

const MainWrapper = styled.div`
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-areas: "nav main side";
    grid-template-rows: 1fr;
    grid-template-columns: 150px 1fr 150px;

    font-family: 'Work Sans', sans-serif;

    a {
        color: black;
        &:hover{
            color: grey;
        }
    }

    #nav {
        grid-area: nav;
        padding: 0 0 0 50px;

        display: flex;
        flex-direction: column;
        align-items: flex-start;

        font-family: 'Work Sans', sans-serif;
        font-size: 25px;
        a {
            text-decoration: none;
            color: black;
            padding: 10px;
            width: 100%;
            &:hover {
                background: #f7f7f7;
                cursor: pointer;
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
`;

const NavActiveStyle = {
    color: "black",
    fontWeight: "bold",
}
