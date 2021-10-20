import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Alert } from "react-bootstrap"
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
    const [challengeLoading, setChallengeLoading] = useState(true)
    const [challenge, setChallenge] = useState(new Challenge)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")
    const [lost, setLost] = useState(false)


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

    const removeErrorAlert = () => {
        setError("")
    }

    const removeAlert = () => {
        setSuccess("")
    }


    useEffect(async () => {
        const db = firebase.firestore();
        const challengeCollection = db.collection('challenge');
        const ref = challengeCollection.doc(location.search.split('=')[1])
        try{
            await challenge.load(ref)
        }
        catch{
            setLost(true)
            setChallengeLoading(false)
        }
        setChallengeLoading(false)
     }, []);
    
     useEffect(() => {
        if (!challengeLoading){
            console.log(challenge)
        }
    },[challengeLoading]); 


    return (
        <div>
            <LoadingOverlay
                active={challengeLoading}
                spinner
                text={"Loading"}>
                <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <Row>
                        <Col md="auto">
                            <Sidebar></Sidebar>
                        </Col>
                        <Col>
                            {lost ? <div>404 Not Found</div> :
                            <Row style={{ paddingTop: 20, paddingRight: 20}}> 
                                <Col>
                                    <div>
                                        <h1>Challenge with {challenge.userToChallenge.getFullName()}</h1>
                                        <h2>{challenge.ladderName}</h2>
                                    </div>
                                    <div>
                                    <Alert show={error!=""} variant="danger" onClose={() => removeErrorAlert()} dismissible>
                                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                                        <p>
                                        {error}
                                        </p>
                                    </Alert>
                                    <Alert show={success!=""} variant="success" onClose={() => removeAlert()} dismissible>
                                        <Alert.Heading>Success!</Alert.Heading>
                                        <p>
                                        {success}
                                        </p>
                                    </Alert>
                                    </div>

                                    <ChallengeActionView challenge={challenge} setSuccess={setSuccess} setError={setError} setLoading={setChallengeLoading}></ChallengeActionView>
                                </Col>
                            </Row>
                            }
                        </Col>
                    </Row>
                </Container>
                
            </LoadingOverlay>
        </div>
    )
}
