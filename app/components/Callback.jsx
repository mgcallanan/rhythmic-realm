import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const history = useNavigate();

  useEffect(() => {
    const hash = window.location.hash
      .substring(1)
      .split('&')
      .reduce((initial, item) => {
        let parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);
        return initial;
      }, {});

    if (hash.access_token) {
      localStorage.setItem('spotify_access_token', hash.access_token);
      history.push('/'); // Redirect to your desired route after successful login
    } else {
      history.push('/'); // Redirect to the login screen if the token is not present
    }
  }, [history]);

  return (
    <div>
      {/* You can add a loading spinner here while processing the access token */}
    </div>
  );
};

export default Callback;