import React from 'react'

export default function ClimbingLadder({stylesheet}) {
    const url = 'https://firebasestorage.googleapis.com/v0/b/challenger-ladder.appspot.com/o/climbing-ladder.png?alt=media&token=3a2518c3-5c73-499c-ab43-2c3d6bae058f';
    return (
      <img src={url} alt='Figure climbing a ladder' className={stylesheet}/>
    );
}
