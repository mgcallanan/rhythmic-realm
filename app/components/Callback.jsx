import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash
      .substring(1)
      .split('&')
      .reduce((initial, item) => {
        if (item) {
          const parts = item.split('=');
          initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
      }, {});

    if (hash.access_token) {
      localStorage.setItem('spotify_access_token', hash.access_token);
      navigate('/rhythmic-realm/');
    }
  }, [navigate]);

  return (
    <div>
      <h2>Callback</h2>
      <p>Processing login...</p>
    </div>
  );
};

export default Callback;