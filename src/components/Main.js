import React, {} from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { UserFeed, Profile, Button } from './index';

const Main = (props) => {
    //nav || Feed || Bookmarks?
    return(
        <Router>
            <MainWrapper>
                <nav id = "nav">
                    <NavLink exact to = "/" activeStyle = { NavActiveStyle }>Home</NavLink>
                    <NavLink exact to = "/follows" activeStyle = { NavActiveStyle }>Follows</NavLink>
                    <NavLink exact to = "/profile" activeStyle = { NavActiveStyle }>Profile</NavLink>
                    <Route exact path = "/profile" component = { () => <Button text = "New List" onClick = {() => console.log("Works")}/> }/>
                    <Route exact path = "/profile/:id" component = { () => <Button text = "New Post" onClick = {() => console.log("Works")}/> }/>
                </nav>
                <div id = "main">
                    <Switch>
                        <Route exact path = "/" component = {UserFeed}/>
                        <Route path = "/profile" component = {Profile}/>
                    </Switch>
                </div>
                <div id = "aside">
                    BOOKMARKS?
                </div>
                
            </MainWrapper>
        </Router>
    )
}

export default Main;

const MainWrapper = styled.div`
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-areas: "nav main side";
    grid-template-rows: 1fr;
    grid-template-columns: 150px 1fr 150px;

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
    }
    #main {
        grid-area: main;
    }
    #aside {
        grid-area: side;
    }
`;

const NavActiveStyle = {
    color: "blue",
    fontWeight: "bold"
}