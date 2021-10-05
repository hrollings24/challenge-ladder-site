import React from 'react'
import MainUser from '../../Persistance/MainUser'
import firebase from 'firebase/app';
import 'firebase/firestore';

export default function AwaitingResponseView({challenge, notification}) {

    console.log(notification.fromUserRef.path)
    
    const db = firebase.firestore();
    const mainuserref = db.collection('users').doc(MainUser.getInstance().userID)

    console.log(mainuserref.path)

    if (mainuserref.path == notification.fromUserRef.path){
        return (
            <div>
                Awaiting a response from the other user
            </div>
        )
    }

    return (
        <div>
            <p>You need to reply to this challenge</p>
            <p>Accept</p>
            <p>Decline</p>
        </div>
    )
}
