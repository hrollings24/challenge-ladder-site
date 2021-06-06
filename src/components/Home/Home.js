import React, { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useHistory, useLocation } from "react-router-dom"
import { Container, Row, Col, Alert } from "react-bootstrap"
import MainUser from "../../Persistance/MainUser"
import LadderCards from "./LadderCards"
import DoIHaveNotifications from "./DoIHaveNotifications"
import LoadingOverlay from 'react-loading-overlay';
import ChallengeCards from "./ChallengeCards"

import './Home.css';
import Sidebar from "../Sidebar.js"


export default function Home(props){
    const { currentUser, logout } = useAuth()
    const history = useHistory()
    const location = useLocation();
    const [showAlert, setShowAlert] = useState(false)
    const [userDataLoaded, setUserDataLoaded] = useState(false)

    async function userLoaded() {
        
        if (MainUser.getInstance().getUserID() == ""){
            await MainUser.getInstance().setUser(currentUser.uid);
            console.log(MainUser.getInstance().getLadders())
            setUserDataLoaded(true);
        }
        else{
            setUserDataLoaded(true);
        }
    }

    useEffect(() => {
        console.log("At home")
        let query = location.search
        if (query == "?success"){
            setShowAlert(true)
        }
        userLoaded()
    },[]); 

    const removeAlert = () =>{ 
        setShowAlert(false)
        history.replace('/')
    }
    
    return (
        <div>
            <LoadingOverlay
                active={!userDataLoaded}
                spinner
                text='Loading'>
                <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <Row>
                        <Col md="auto">
                            <Sidebar></Sidebar>
                        </Col>
                        <Col>
                            <Row style={{ paddingTop: 20, paddingRight: 20}}>
                                <Container>
                                    <Row>
                                    <h1 className = "homeh2">Home</h1>
                                    </Row>
                                    <Alert show={showAlert} variant={'success'}>
                                        Successfully removed from ladder. <Alert.Link onClick={() => removeAlert()} >Remove</Alert.Link>
                                    </Alert>
                                    <Row>
                                    <DoIHaveNotifications></DoIHaveNotifications>
                                    </Row>
                                </Container>
                            </Row>
                            <Row style={{ paddingTop: 20, paddingRight: 20}}>
                                <h2 className = "homeh2">My Ladders</h2>
                                <LadderCards></LadderCards>      
                            </Row>
                            <Row style={{ paddingTop: 20, paddingRight: 20}}>
                                <h2 className = "homeh2">Challenges</h2>
                                <ChallengeCards></ChallengeCards>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </LoadingOverlay>
        </div>
    );

    
}
