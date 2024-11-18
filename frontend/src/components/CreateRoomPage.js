import React, {Component} from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import "./CreateRoomPage.css"; // Integrate the provided CSS file

export default class CreateRoomPage extends Component {
    static defaultProps = {
        votesToSkip: 2,
        guestCanPause: true,
        update: false,
        roomCode: null,
        updateCallback: () => {},
    };

    constructor(props) {
        super(props);
        this.state = {
            guestCanPause: this.props.guestCanPause,
            votesToSkip: this.props.votesToSkip,
            errorMsg: "",
            successMsg: "",
        };
        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
        this.handleVotesChange = this.handleVotesChange.bind(this);
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
        this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);
    }

    handleVotesChange(e) {
        this.setState({
            votesToSkip: e.target.value,
        });
    }

    handleGuestCanPauseChange(e) {
        this.setState({
            guestCanPause: e.target.value === "true" ? true : false,
        });
    }

    handleRoomButtonPressed() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
            }),
        };
        fetch("/api/create-room", requestOptions)
            .then((response) => response.json())
            .then((data) => this.props.history.push("/room/" + data.code));
    }

    handleUpdateButtonPressed() {
        const requestOptions = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
                code: this.props.roomCode,
            }),
        };
        fetch("/api/update-room", requestOptions).then((response) => {
            if (response.ok) {
                this.setState({
                    successMsg: "Room updated successfully!",
                });
            } else {
                this.setState({
                    errorMsg: "Error updating room...",
                });
            }
            this.props.updateCallback();
        });
    }

    renderCreateButtons() {
        return (
            <div className="button-group">
                <Button className="btn" onClick={this.handleRoomButtonPressed}>
                    Create Room
                </Button>
                <Button className="btn" component={Link} to="/">
                    Back
                </Button>
            </div>
        );
    }

    renderupdateButtons() {
        return (
            <div className="button-group">
                <Button className="btn" onClick={this.handleUpdateButtonPressed}>
                    Update Room
                </Button>
            </div>
        );
    }

    render() {
        const title = this.props.update ? "Update Room" : "Create Room";

        return (
            <div className="room-container">
                <h4>{title}</h4>
                <p className="subtitle">Guest Control of Playback State</p>

                <div className="radio-group">
                    <FormControl component="fieldset">
                        <RadioGroup
                            row
                            defaultValue={this.props.guestCanPause.toString()}
                            onChange={this.handleGuestCanPauseChange}
                        >
                            <FormControlLabel
                                value="true"
                                control={<Radio color="primary" />}
                                label="Play/Pause"
                            />
                            <FormControlLabel
                                value="false"
                                control={<Radio color="secondary" />}
                                label="No Control"
                            />
                        </RadioGroup>
                    </FormControl>
                </div>

                <div className="input-group">
                    <TextField
                        required
                        type="number"
                        onChange={this.handleVotesChange}
                        defaultValue={this.state.votesToSkip}
                        inputProps={{
                            min: 1,
                            style: { textAlign: "center" },
                        }}
                    />
                    <p className="subtitle">Votes Required to Skip Song</p>
                </div>

                <div>
                    {this.state.errorMsg && (
                        <Alert
                            severity="error"
                            onClose={() => this.setState({ errorMsg: "" })}
                        >
                            {this.state.errorMsg}
                        </Alert>
                    )}
                    {this.state.successMsg && (
                        <Alert
                            severity="success"
                            onClose={() => this.setState({ successMsg: "" })}
                        >
                            {this.state.successMsg}
                        </Alert>
                    )}
                </div>

                {!this.props.update
                    ? this.renderCreateButtons()
                    : this.renderupdateButtons()}
            </div>
        );
    }
}