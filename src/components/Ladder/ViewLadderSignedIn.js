import React, { useState, useEffect }from 'react'
import { Container, Row, Col, Alert } from "react-bootstrap"
import '../Home/Home.css';
import './Ladder.css';
import Sidebar from "../Sidebar.js"
import LadderRanks from "./LadderRanks"
import { useAuth } from "../../contexts/AuthContext"
import MainUser from "../../Persistance/MainUser"
import { useHistory, useLocation } from "react-router-dom"
import LoadingOverlay from 'react-loading-overlay';
import Ladder from "../../Persistance/Ladder"
import firebase from 'firebase/app';
import UserSearch from '../PopupModal/UserSearch';

export default function ViewLadderSignedIn({ladder, setLoading}) {
    const { currentUser, logout } = useAuth()
    const history = useHistory()
    const location = useLocation()
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const [showSearch, setShowSearch] = useState(false)

    const addUserClicked = () => {
        setShowSearch(true)
    }

    useEffect(() => {
    },[]); 

    const removeAlert = () =>{ 
        setSuccess("")        
    }

    const removeErrorAlert = () =>{ 
        setError("")        
    }

    const gotoSettings = () =>{ 
        history.push({
            pathname: ladder.url + "/admin",
        })
    }

    return (
        <div>
            <UserSearch showSearch={showSearch} setShowSearch={setShowSearch} ladderData={ladder} purpose={"user"}></UserSearch>   
            <Col>
                <Container style={{ paddingTop: 20, paddingRight: 20 }}>
                    <Row>
                        <h1 className = "h1-ladder" className = "capitalize">{ladder.name}</h1>:
                    </Row>
                    <Row>             
                    {
                        ladder.amIAdmin() ?
                        <h3 className= "h3-ladder" onClick={gotoSettings}>Settings</h3>:
                        <h3 className="text-right" onClick={() => addUserClicked()} style={{cursor: "pointer"}}>Invite</h3>
                    }
                    </Row>
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
                    <Row style={{ paddingTop: 20, paddingLeft: 20}}>
                        <LadderRanks ladder = {ladder} setLoading = {setLoading} setSuccess={setSuccess} setError={setError}></LadderRanks>
                    </Row>
                </Container>     
            </Col>
        </div>
    )

  
   
}
