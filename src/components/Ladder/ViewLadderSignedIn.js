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

export default function ViewLadderSignedIn(laddername) {
    const { currentUser, logout } = useAuth()
    const [userDataLoaded, setUserDataLoaded] = useState(false)
    const history = useHistory()
    const location = useLocation()
    const [ladder, setLadder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ladderLoading, setLadderLoading] = useState(true);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const [showSearch, setShowSearch] = useState(false)

    const addUserClicked = () => {
        setShowSearch(true)
    }

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
            console.log(lad)
            setLadder(lad)
            await lad.loadAfterUserLoaded()  
            
        }
        setLadderLoading(false)

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
        console.log(ladder)
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

    const gotoSettings = () =>{ 
        history.push({
            pathname: ladder.url + "/admin",
        })
    }

    return (
        <div>
            <UserSearch showSearch={showSearch} setShowSearch={setShowSearch} ladderData={ladder} purpose={"user"}></UserSearch>   
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
                                    !ladderLoading ?
                                    <h1 className = "h1-ladder" className = "capitalize">{ladder.name}</h1>:
                                    <div></div>
                                }
                                </Row>
                                <Row>
                                {
                                    !ladderLoading ?
                                    <div>
                                    {
                                        ladder.amIAdmin() ?
                                        <h3 className= "h3-ladder" onClick={gotoSettings}>Settings</h3>:
                                        <h3 className="text-right" onClick={() => addUserClicked()} style={{cursor: "pointer"}}>Invite</h3>
                                    }</div>:
                                    <div>
                                    </div>
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
                                    !ladderLoading ?
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
