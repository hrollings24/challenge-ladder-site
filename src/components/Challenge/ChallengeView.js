import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap"
import Sidebar from "../Sidebar.js"
import Challenge from "../../Persistance/Challenge"
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useAuth } from "../../contexts/AuthContext"
import MainUser from "../../Persistance/MainUser"

export default function ChallengeView() {
    const location = useLocation();
    const [challengeLoaded, setChallengeLoaded] = useState(false)
    const [challenge, setChallenge] = useState(new Challenge)
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
        setChallengeLoaded(true)
     }, []);
    
     useEffect(() => {
        if (challengeLoaded){
            console.log(challenge.userToChallenge.getFullName())
        }
    },[challengeLoaded]); 


    return (
        <div>
            <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
                <Row>
                    <Col md="auto">
                        <Sidebar></Sidebar>
                    </Col>
                    <Col>
                        <Row style={{ paddingTop: 20, paddingRight: 20}}> 
                            <Col>
                                {
                                    challengeLoaded ?
                                    <div>
                                        <h1>Challenge with {challenge.userToChallenge.getFullName()}</h1>
                                        <h2>{challenge.ladderName}</h2>
                                    </div>:
                                    <div>loading...</div>
                                }
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
