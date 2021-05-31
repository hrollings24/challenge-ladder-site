import React from 'react'
import './images.css';


export default function ProfileImage({ url }) {
    return (
        <img src={url} className="profilePicture" alt='profile picture' />
    )
}
