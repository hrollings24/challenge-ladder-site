import React from 'react';
import './Home/Home.css';


function LogoImage() {
  const url = 'https://firebasestorage.googleapis.com/v0/b/challenger-ladder.appspot.com/o/161644784402633425.png?alt=media&token=e4af43b0-0d04-49fa-8053-ae1093e97a6a';
  return (
    <img src={url} className="logo" alt='Climb The Ladder Logo' />
  );
}

export default LogoImage;