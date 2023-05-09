import React from 'react';
// import './Login.css';

const CLIENT_ID = 'df2ae4f57ee94424b0371c4d16d075a6';
const REDIRECT_URI = 'http://localhost:8080/callback';
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=playlist-modify-public`;

const Login = () => {
  const loginToSpotify = () => {
    window.location = AUTH_URL;
  };

  return (
    <div className="login">
      <div className="login__container">
        <h1 className="login__title">Spotify Login Demo</h1>
        <p className="login__tagline">Experience the world of music at your fingertips</p>
        <button className="login__button" onClick={loginToSpotify}>
          Login with Spotify
        </button>
      </div>
    </div>
  );
};

export default Login;