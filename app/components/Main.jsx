import React from "react";
import { connect } from "react-redux";
import {
  setIslandScale,
  setDirIten,
  setLightColor,
  setSong,
  setObjectColor,
  setAudioFeatures,
  setAudioAnalysis,
  setSongProgress,
  setFetchTimeStamp,
} from "../stores/AppStore";
import RangeInputSet from "./RangeInputSet.jsx";
import SongSelect from "./SongSelect.jsx";
import { stringify } from "querystring";

class Main extends React.Component {
  state = {
    isLoggedIn: false,
    userName: "NONAME",
    currentTrackID: "NA",
    playbackProgress: 0,
    fetchTimeStamp: 0,
    currentTrackName: "NONE",
  };

  componentDidMount() {
    this.checkTokenAndFetchUserProfile();
  }

  checkTokenAndFetchUserProfile = () => {
    const accessToken = localStorage.getItem("spotify_access_token");
    console.log("accessToken " + accessToken);
    if (accessToken) {
      this.fetchUserProfile(accessToken);
      this.fetchCurrentlyPlaying(accessToken);
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
      console.log(this.state.userName);
      this.fetchCurrentlyPlaying(accessToken);
    } else {
      console.error("Failed to fetch user profile");
    }
  }

  async;

  async fetchCurrentlyPlaying(accessToken) {
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      // console.log(data)
      this.setState({
        currentTrackID: data.item.id,
        playbackProgress: data.progress_ms,
        fetchTimeStamp: data.timestamp,
      });

      this.props.dispatch(setSongProgress(data.progress_ms));

      // this.props.dispatch(setFetchTimeStamp(data.timestamp));
      this.props.dispatch(setFetchTimeStamp(window.performance.now()));
      this.fetchTrack(accessToken);
      this.fetchTrackAudioFeatures(accessToken);
      this.fetchTrackAudioAnalysis(accessToken);
      console.log(this.state.currentTrackID);
    } else {
      console.error("Failed to fetch currently playing song");
    }
  }

  async fetchTrack(accessToken) {
    const response = await fetch(
      `https://api.spotify.com/v1/tracks/${this.state.currentTrackID}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      // console.log(data)
      this.setState({ currentTrackName: data.name });
      console.log(this.state.currentTrackName);
    } else {
      console.error("Failed to fetch currently playing song");
    }
  }

  async fetchTrackAudioAnalysis(accessToken) {
    const response = await fetch(
      `https://api.spotify.com/v1/audio-analysis/${this.state.currentTrackID}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      // console.log(data)
      this.props.dispatch(setAudioAnalysis(data));
      console.log(data);
    } else {
      console.error("Failed to fetch currently playing song");
    }
  }

  async fetchTrackAudioFeatures(accessToken) {
    const response = await fetch(
      `https://api.spotify.com/v1/audio-features/${this.state.currentTrackID}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      // console.log(data)
      this.props.dispatch(setAudioFeatures(data));
      console.log(data);
    } else {
      console.error("Failed to fetch currently playing song");
    }
  }
  loginToSpotify = (event) => {
    event.preventDefault();

    const scope = "playlist-modify-public+user-read-currently-playing";

    const CLIENT_ID = "df2ae4f57ee94424b0371c4d16d075a6";

    // Production redirect_uri
    const REDIRECT_URI = window.location.origin + "/callback";

    // Development redirect_uri
    // const REDIRECT_URI = window.location.origin + "/rhythmic-realm/callback";

    console.log("redirect_uri " + REDIRECT_URI);
    const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${scope}`;

    window.location = AUTH_URL;
  };

  render() {
    const wrapStyle = {
      position: "absolute",
      padding: 20,
      width: 260,
      height: "100vh",
    };
    const { islandScale, dirinten, lightcolor, song, objectcolor } =
      this.props.app;

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
            <h3>
              {" "}
              <strong>Current Song:</strong> {this.state.currentTrackName}
            </h3>
            {/* <SongSelect
              label={this.state.currentTrackName}
              min={0}
              max={3}
              step={0.05}
              value={dirinten}
              onChange={(v) => {
                this.props.dispatch(setSong(v));
              }}
            /> */}
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
