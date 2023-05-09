import React from "react";
import { connect } from "react-redux";
import {
  setIslandScale,
  setDirIten,
  setLightColor,
  setSong,
} from "../stores/AppStore";
import RangeInputSet from "./RangeInputSet.jsx";
import SongSelect from "./SongSelect.jsx";

class Main extends React.Component {
  state = {
    isLoggedIn: false,
    userName: "NONAME",
  };

  componentDidMount() {
    this.checkTokenAndFetchUserProfile();
  }

  checkTokenAndFetchUserProfile = () => {
    const accessToken = localStorage.getItem("spotify_access_token");
    console.log("accessToken " + accessToken);
    if (accessToken) {
      this.fetchUserProfile(accessToken);
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
      this.setState({ userName: data.display_name, isLoggedIn: true });
    } else {
      console.error("Failed to fetch user profile");
    }
  } 

  loginToSpotify = (event) => {
    event.preventDefault();

    const CLIENT_ID = 'df2ae4f57ee94424b0371c4d16d075a6';

    // Production redirect_uri
    // const REDIRECT_URI = window.location.origin + "/callback";

    // Development redirect_uri
    const REDIRECT_URI = window.location.origin + "/rhythmic-realm/callback";
    
    console.log("redirect_uri " + REDIRECT_URI)
    const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=playlist-modify-public`;

  
    window.location = AUTH_URL;
  };
  
    render() {
    const wrapStyle = {
      position: 'absolute',
      padding: 20,
      width: 260,
      height: "100vh",
    };
    const { islandScale, dirinten, lightcolor, song } = this.props.app;

    const welcomeTextStyle = {
      color: '#1DB954', // Spotify green
      fontWeight: 'bold',
      fontSize: '1.2em',
      marginTop: '1em',
    };

    return (
      <div style={wrapStyle}>
        <h2>Rhythmic Realm</h2>
        <p>
          Three.js project biolerplate with ES6 and React/Redux controls. Design
          Goal: to get projects up and running fast. Get the code on{' '}
          <a href='https://github.com/edwinwebb/three-seed/'>GitHub</a>
        </p>
        <form>
          <fieldset>
            <RangeInputSet
              label={'Light Intensity'}
              min={0}
              max={3}
              step={0.05}
              value={dirinten}
              onChange={(v) => {
                this.props.dispatch(setDirIten(v));
              }}
            />
            <label>Light Color</label>
            <input
              type='color'
              value={lightcolor}
              onChange={(e) => {
                this.props.dispatch(setLightColor(e.target.value));
              }}
            />
            <SongSelect
              label={'Current Song'}
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