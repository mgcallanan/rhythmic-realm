import React from "react";
import YouTube from "react-youtube";

export default class SongPlayer extends React.Component {
  render() {
    const opts = {
      height: "0",
      width: "0",
      host: "http://www.youtube.com",
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        origin: "http://localhost:8080/",
      },
    };

    return (
      <YouTube
        videoId="7V3jqsIe8c0"
        host="http://www.youtube.com"
        opts={opts}
        onReady={this._onReady}
      />
    );
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }
}
