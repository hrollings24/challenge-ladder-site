import React, { useState, useEffect } from "react"
import Ladder from "../../Persistance/Ladder"
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useAuth } from "../../contexts/AuthContext"
import ViewLadderSignedIn from './ViewLadderSignedIn'
import ViewLadderOutsider from './ViewLadderOutsider'


export default function ViewLadder(props) {
    
    var url = props.match.params.ladderurl
    const [ladder, setLadder] = useState(null);
    const { currentUser } = useAuth()
    
    var refsAsArray = []

    const loadLadder = async () => {  
        const db = firebase.firestore();

        
        const ladderRefs = await db.collection('ladders').where("url", "==", url).get()  
        
        ladderRefs.forEach(function(doc) {
            refsAsArray.push(doc)
        });

        for (const docu of refsAsArray){
            const lad = new Ladder()
            await lad.load(docu.data(), docu)
            setLadder(lad)
        }

    }
    
    loadLadder()

    if (ladder == null){
        return (
            <div>
            </div>
        ) 
    }

    if (currentUser != null){
        return (
            <div>
                <ViewLadderSignedIn ladder = {ladder}></ViewLadderSignedIn>
            </div>
        ) 
    }

    return (
        <div>
            <ViewLadderOutsider ladder = {ladder}></ViewLadderOutsider>
        </div>
    ) 
}
