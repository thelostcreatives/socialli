import React, {} from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { UserFeed, Profile, Button, NewListForm, NewPostForm, ListPage } from './index';

const Main = (props) => {
    return(
        <Router>
            <MainWrapper>
                <nav id = "nav">
                    <NavLink exact to = "/" activeStyle = { NavActiveStyle }>Home</NavLink>
                    <NavLink exact to = "/follows" activeStyle = { NavActiveStyle }>Follows</NavLink>
                    <NavLink exact to = "/profile" activeStyle = { NavActiveStyle }>Profile</NavLink>
                    <Route exact path = "/profile" component = { (props) => <Button text = "New List" onClick = { () => props.history.push("/newList")}/> }/>
                    <Route exact path = "/profile/:id" component = { (props) => <Button text = "New Post" onClick = { () => props.history.push(`${props.match.url}/newPost`)} /> }/>
                </nav>
                <div id = "main">
                    <Switch>
                        <Route exact path = "/" component = {UserFeed}/>
                        <Route exact path = "/profile" component = {Profile}/>
                        <Route exact path = "/profile/:id" render = {(props) => <ListPage {...props} isOwned = {true} />}/>
                        <Route path = "/list/:id" render = {(props) => <ListPage {...props} isOwned = {false} />}/>
                        <Route path = "/profile/:id/newPost" component = {NewPostForm}/>
                        <Route path = "/newList" component = {NewListForm}/>
                    </Switch>
                </div>
                <div id = "aside">
                    BOOKMARKS?
                </div>
                
            </MainWrapper>
        </Router>
    )
}

export default withRouter(Main);

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
