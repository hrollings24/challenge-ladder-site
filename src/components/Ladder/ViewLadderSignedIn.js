import React, { useState, useEffect }from 'react'
import { Container, Row, Col, Alert } from "react-bootstrap"
import '../Home/Home.css';
import Sidebar from "../Sidebar.js"
import LadderRanks from "./LadderRanks"
import { useAuth } from "../../contexts/AuthContext"
import MainUser from "../../Persistance/MainUser"
import { useHistory, useLocation } from "react-router-dom"


export default function ViewLadderSignedIn({ ladder }) {
    const { currentUser, logout } = useAuth()
    const [userDataLoaded, setUserDataLoaded] = useState(false)
    const [ladderChallengesFound, setladderChallengesFound] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const history = useHistory()
    const location = useLocation()


    async function userLoaded() {

        if (MainUser.getInstance().getUserID() == ""){
            await MainUser.getInstance().setUser(currentUser.uid);
            setUserDataLoaded(true);
            await ladder.loadAfterUserLoaded()
            setladderChallengesFound(true)
        }
        else{
            setUserDataLoaded(true);
            await ladder.loadAfterUserLoaded()
            setladderChallengesFound(true)
        }
    }

    useEffect(() => {
        let query = location.search.split('?')[1]
        if (query == "success"){
            setShowAlert(true)
        }

        userLoaded()
    },[]); 

    const removeAlert = () =>{ 
        setShowAlert(false)
        history.replace(ladder.name.replace(/\s/g, ''))
        
    }

    useEffect(() => {
        if (ladderChallengesFound){
            
        }
    },[ladderChallengesFound]); 

    if (!ladderChallengesFound){
        return (
            <div>
            <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
                <Row>
                    <Col md="auto">
                        <Sidebar></Sidebar>
                    </Col>
                    <Col>
                        <Row style={{ paddingTop: 20, paddingRight: 20}}> 
                            Loading...   
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
        )
    }

    return (
        <div>
            <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
                <Row>
                    <Col md="auto">
                        <Sidebar></Sidebar>
                    </Col>
                    <Col>
                        <Row style={{ paddingTop: 20, paddingRight: 20}}> 
                            <Container>
                                <Row>
                                <h1 className = "homeh2">{ladder.name}</h1>
                                </Row>
                                <Row>
                                <Alert show={showAlert} variant={'success'}>
                                    Successfully removed from ladder. <Alert.Link onClick={() => removeAlert()} >Remove</Alert.Link>
                                </Alert>
                                </Row>
                                <Row style={{ paddingTop: 20, paddingLeft: 20}}>
                                {
                                    ladderChallengesFound ?
                                    <LadderRanks ladder = {ladder}></LadderRanks>:
                                    <div>loading...</div>
                                }
                                </Row>
                            </Container>     
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    )

  
   
}
