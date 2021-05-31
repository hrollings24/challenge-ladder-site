import React from 'react'
import "./images.css";

export default function HomeAwayLogo({stylesheet}) {
    const url = 'https://firebasestorage.googleapis.com/v0/b/challenger-ladder.appspot.com/o/long-01.png?alt=media&token=e694d857-571a-4df5-a24b-cd4add9786e0';
    return (
      <img src={url} alt='Climb The Ladder Logo' className={stylesheet}/>
    );
}
