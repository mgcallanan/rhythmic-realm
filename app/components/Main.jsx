import React from "react";
import { connect } from "react-redux";
import {
  setIslandScale,
  setDirIten,
  setLightColor,
  setSong,
  setObjectColor,
} from "../stores/AppStore";
import RangeInputSet from "./RangeInputSet.jsx";
import SongSelect from "./SongSelect.jsx";

class Main extends React.Component {
  state = {
    isLoggedIn: false,
    userName: "NONAME",
  };

  componentDidMount() {
    this.handleToken();
  }

  handleToken = () => {
    const hash = window.location.hash
      .substring(1)
      .split("&")
      .reduce((acc, item) => {
        const [key, value] = item.split("=");
        acc[key] = value;
        return acc;
      }, {});

    if (hash.access_token) {
      localStorage.setItem("spotify_access_token", hash.access_token);
      window.location.hash = ""; // Clear the token from the URL
      this.fetchUserProfile(hash.access_token);
    }
  };

  async fetchUserProfile(accessToken) {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      // console.log(data)
      this.setState({ userName: data.display_name, isLoggedIn: true });
      console.log(this.state.userName);
    } else {
      console.error("Failed to fetch user profile");
    }
  }

  loginToSpotify = (event) => {
    event.preventDefault();

    const CLIENT_ID = "df2ae4f57ee94424b0371c4d16d075a6";
    const REDIRECT_URI = window.location.origin;
    const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=playlist-modify-public`;

    window.location = AUTH_URL;
  };

  render() {
    const wrapStyle = {
      position: "absolute",
      padding: 20,
      width: 260,
      height: "100vh",
    };
    const { islandScale, dirinten, lightcolor, song, objectcolor} = this.props.app;

    const welcomeTextStyle = {
      color: "#1DB954", // Spotify green
      fontWeight: "bold",
      fontSize: "1.2em",
      marginTop: "1em",
    };

    return (
      <div style={wrapStyle}>
        <h2>Rhythmic Realm</h2>
        <p>
          Three.js project biolerplate with ES6 and React/Redux controls. Design
          Goal: to get projects up and running fast. Get the code on{" "}
          <a href="https://github.com/edwinwebb/three-seed/">GitHub</a>
        </p>
        <form>
          <fieldset>
            <RangeInputSet
              label={"Light Intensity"}
              min={0}
              max={3}
              step={0.05}
              value={dirinten}
              onChange={(v) => {
                this.props.dispatch(setDirIten(v));
              }}
            />
            {/* <label>Light Color</label>
            <input
              type="color"
              value={lightcolor}
              onChange={(e) => {
                this.props.dispatch(setLightColor(e.target.value));
              }}
            {/* <label>Cube Color</label>
            <input
              type="color"
              value={objectcolor}
              onChange={(f) => {
                this.props.dispatch(setObjectColor(f.target.value));
              }}
            /> */}
            <SongSelect
              label={"Current Song"}
              min={0}
              max={3}
              step={0.05}
              value={dirinten}
              onChange={(v) => {
                this.props.dispatch(setSong(v));
              }}
            />
            {this.state.isLoggedIn ? (
              <p style={welcomeTextStyle}>Welcome, {this.state.userName}!</p>
            ) : (
              <button onClick={this.loginToSpotify}>Login With Spotify</button>
            )}
          </fieldset>
        </form>
      </div>
    );
  }
}

export default connect((state) => ({ app: state.App }))(Main);
