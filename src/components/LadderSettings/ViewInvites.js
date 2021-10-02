import React, { useState, useEffect } from 'react'
import LadderUserDisplayer from './LadderUserDisplayer'
import firebase from 'firebase/app';
import 'firebase/firestore';
import LoadingOverlay from 'react-loading-overlay';

export default function ViewInvites({ladder, setLoading}) {
    const [ids, setIds] = useState([])
    const [loading2, setLoading2] = useState(false)

    const findInvites = async () => {
        setLoading2(true)

        const db = firebase.firestore();
        const noteRef = db.collection('notifications')
        const ladderRef = db.collection('ladders').doc(ladder.id)

        const snapshot = await noteRef.where('type', '==', 'invite').where('ladder', '==', ladderRef).get()
        
        if (snapshot.empty) {
            console.log('No matching documents.');
        }  
          
        snapshot.forEach(doc => {
            setIds( arr => [...arr, doc.data().toUser.id]);
        });

        setLoading2(false)
        console.log(loading2)
    }

    useEffect(() => {
        console.log(ladder)
        findInvites()
    },[ladder]); 


    return (
        <div>
            <LoadingOverlay
                active={loading2}
                spinner
                text={"Loading"}>
            {loading2 ? <p>loading</p> : <div>{ids.length == 0 ? <h4>You have no pending invites</h4> : <LadderUserDisplayer ladderUserIds={ids} type={"invite"} ladder={ladder} setLoading={setLoading}></LadderUserDisplayer> }</div>}
            </LoadingOverlay>
        </div>
    )
}
