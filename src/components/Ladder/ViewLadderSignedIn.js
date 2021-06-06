import React, { useState, useEffect }from 'react'
import { Container, Row, Col, Alert } from "react-bootstrap"
import '../Home/Home.css';
import Sidebar from "../Sidebar.js"
import LadderRanks from "./LadderRanks"
import { useAuth } from "../../contexts/AuthContext"
import MainUser from "../../Persistance/MainUser"
import { useHistory, useLocation } from "react-router-dom"
import LoadingOverlay from 'react-loading-overlay';
import Ladder from "../../Persistance/Ladder"
import firebase from 'firebase/app';


export default function ViewLadderSignedIn(laddername) {
    const { currentUser, logout } = useAuth()
    const [userDataLoaded, setUserDataLoaded] = useState(false)
    const history = useHistory()
    const location = useLocation()
    const [ladder, setLadder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");


    var refsAsArray = []

    const loadLadder = async () => {  
        const db = firebase.firestore();
        console.log(laddername.laddername.replace('/', ''))
        const ladderRefs = await db.collection('ladders').where("url", "==", laddername.laddername.replace('/', '')).get()  
        
        ladderRefs.forEach(function(doc) {
            refsAsArray.push(doc)
        });

        for (const docu of refsAsArray){
            const lad = new Ladder()
            await lad.load(docu.data(), docu)
            setLadder(lad)
            await lad.loadAfterUserLoaded()  
        }
    }

    const loadUser = async () => {  

        if (MainUser.getInstance().getUserID() == ""){
            await MainUser.getInstance().setUser(currentUser.uid);
            setUserDataLoaded(true);
        }
        else{
            setUserDataLoaded(true);
        }
    }

    async function startLoad(){
        await loadUser()
        await loadLadder()
        setLoading(false)
    }

    useEffect(() => {
        startLoad()
    },[]); 

    const removeAlert = () =>{ 
        setSuccess("")        
    }

    const removeErrorAlert = () =>{ 
        setError("")        
    }

    return (
        <div>
            <LoadingOverlay
                active={loading}
                spinner
                text="Loading">
                <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <Row>
                        <Col md="auto">
                            <Sidebar></Sidebar>
                        </Col>
                        <Col>
                            <Container style={{ paddingTop: 20, paddingRight: 20 }}>
                                <Row>
                                {
                                    !loading ?
                                    <h1 className = "homeh2">{ladder.name}</h1>:
                                    <div></div>
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
                                {
                                    !loading ?
                                    <LadderRanks ladder = {ladder} loading = {loading} setLoading = {setLoading} setSuccess={setSuccess} setError={setError}></LadderRanks>:
                                    <div></div>
                                }
                                </Row>
                            </Container>     
                        </Col>
                    </Row>
                </Container>
            </LoadingOverlay>
        </div>
    )

  
   
}
