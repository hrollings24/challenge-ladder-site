import React, { useState, useEffect } from "react"
import Ladder from "../../Persistance/Ladder"
import 'firebase/firestore';
import { useAuth } from "../../contexts/AuthContext"
import ViewLadderSignedIn from './ViewLadderSignedIn'
import ViewLadderOutsider from './ViewLadderOutsider'

export default function ViewLadder(props) {
    const { currentUser } = useAuth()
    
    var refsAsArray = []

    if (currentUser != null){
        return (
            <div>
                <ViewLadderSignedIn laddername={props.location.pathname}></ViewLadderSignedIn>
            </div>
        ) 
    }

    return (
        <div>
            <ViewLadderOutsider props = {props}></ViewLadderOutsider>
        </div>
    ) 
}
