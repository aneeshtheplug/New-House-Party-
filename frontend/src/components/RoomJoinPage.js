import React, {Component} from "react";
import { TextField, Button, Grid, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import "./RoomJoinPage.css";

export default class RoomJoinPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: "",
            error: "",
        };
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
        this.roomButtonPressed = this.roomButtonPressed.bind(this);
    }

    render() {
        return (
            <div className="room-join-container">
                <Typography variant="h4" component="h4">
                    Join a Room
                </Typography>
                <TextField
                    error={!!this.state.error}
                    label="Code"
                    placeholder="Enter a Room Code"
                    value={this.state.roomCode}
                    helperText={this.state.error}
                    variant="outlined"
                    onChange={this.handleTextFieldChange}
                    fullWidth
                />
                <Grid container spacing={2} justify="center">
                    <Grid item>
                        <Button
                            className="btn"
                            onClick={this.roomButtonPressed}
                        >
                            Enter Room
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            className="btn"
                            component={Link}
                            to="/"
                        >
                            Back
                        </Button>
                    </Grid>
                </Grid>
            </div>
        );
    }

    handleTextFieldChange(e) {
        this.setState({
            roomCode: e.target.value,
        });
    }

    roomButtonPressed() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code: this.state.roomCode,
            }),
        };
        fetch("/api/join-room", requestOptions)
            .then((response) => {
                if (response.ok) {
                    this.props.history.push(`/room/${this.state.roomCode}`);
                } else {
                    this.setState({ error: "Room not found." });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
}