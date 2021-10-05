import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap"
import Sidebar from "../Sidebar.js"
import Challenge from "../../Persistance/Challenge"
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useAuth } from "../../contexts/AuthContext"
import MainUser from "../../Persistance/MainUser"
import LoadingOverlay from 'react-loading-overlay';
import ChallengeActionView from "./ChallengeActionView.js";
import SystemNotification from "../../Persistance/SystemNotification.js";

export default function ChallengeView() {
    const location = useLocation();
    const [challengeLoaded, setChallengeLoaded] = useState(false)
    const [challenge, setChallenge] = useState(new Challenge)
    const [challengeNote, setChallengeNote] = useState()

    const { currentUser, logout } = useAuth()
    const [userDataLoaded, setUserDataLoaded] = useState(false)

    async function userLoaded() {
        
        if (MainUser.getInstance().getUserID() == ""){
            await MainUser.getInstance().setUser(currentUser.uid);
            setUserDataLoaded(true);
        }
        else{
            setUserDataLoaded(true);
        }
    }

    useEffect(() => {
        userLoaded()
    },[]); 

    useEffect(async () => {
        const db = firebase.firestore();
        const challengeCollection = db.collection('challenge');
        const ref = challengeCollection.doc(location.search.split('=')[1])
        await challenge.load(ref)
        console.log(challenge.userToChallenge.getFullName())

        //find notifictions to do with challenge
        const noteSnapshots = await db.collection('notifications').where("challengeRef", "==", ref).get()

        if (noteSnapshots.empty) {
            console.log('No matching notifications');
            setChallengeLoaded(true)
        } 
        else{
            noteSnapshots.forEach(note => {
                const data = note.data()
                let noteAsNote = new SystemNotification()
                noteAsNote.load(data, note.id)
                setChallengeNote(noteAsNote)
                console.log("Settingloading")
                setChallengeLoaded(true)
            })
        }

     }, []);
    
     useEffect(() => {
        if (challengeLoaded){
            console.log(challenge.userToChallenge.getFullName())
        }
    },[challengeLoaded]); 


    return (
        <div>
            <LoadingOverlay
                active={!challengeLoaded}
                spinner
                text={"Loading"}>
                <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <Row>
                        <Col md="auto">
                            <Sidebar></Sidebar>
                        </Col>
                        <Col>
                            <Row style={{ paddingTop: 20, paddingRight: 20}}> 
                                <Col>
                                    <div>
                                        <h1>Challenge with {challenge.userToChallenge.getFullName()}</h1>
                                        <h2>{challenge.ladderName}</h2>
                                    </div>
                                    <ChallengeActionView challenge={challenge} notification={challengeNote}></ChallengeActionView>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
                
            </LoadingOverlay>
        </div>
    )
}
