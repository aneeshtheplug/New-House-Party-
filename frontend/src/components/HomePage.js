import React, {Component} from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import { BrowserRouter as Router, Route, Link, Redirect} from "react-router-dom";
import { Switch } from 'react-router-dom';
import Room from "./Room";
import "./HomePage.css";

import {Grid, Button, ButtonGroup, Typography} from '@material-ui/core'


export default class HomePage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            roomCode: null,
        };
        this.clearRoomCode = this.clearRoomCode.bind(this)
    }

    async componentDidMount(){
        fetch('/api/user-in-room')
        .then((response) => response.json())
        .then((data) => {
            this.setState({
                roomCode: data.code,
            });
        });
    }

    renderHomePage(){
        return (
        <div className="main-container">
            <h1>House Party</h1>
            <p>Welcome to the ultimate party experience! Join a room or create your own to get started.</p>
            <div className="button-group">
                <Link to='/join' className="btn">Join a Room</Link>  
                <Link to='/create' className="btn">Create a Room</Link>              
            </div>
        </div>
        );
    }

    clearRoomCode(){
        this.setState({
            roomCode: null,
        });
    }

    render(){
        return (
        <Router>
            <Switch>
                <Route exact path = "/" render = {()=>{
                    return this.state.roomCode ? (
                    <Redirect to ={`/room/${this.state.roomCode}`}/>
                    ): (
                        this.renderHomePage()
                    );
                }}
                />
                <Route path = "/join" component = {RoomJoinPage}/> 
                <Route path = "/create" component = {CreateRoomPage}/> 
                <Route 
                path = '/room/:roomCode'
                render = {(props) => {
                    return <Room {...props} leaveRoomCallback = {this.clearRoomCode} />;
                }} 
                />
            </Switch>
        </Router>
        );
    }
}