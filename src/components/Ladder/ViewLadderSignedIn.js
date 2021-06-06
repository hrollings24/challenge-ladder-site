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
    const [showAlert, setShowAlert] = useState(false)
    const history = useHistory()
    const location = useLocation()
    const [ladder, setLadder] = useState(null);
    const [loading, setLoading] = useState(true);


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
        let query = location.search.split('?')[1]
        if (query == "success"){
            setShowAlert(true)
        }
        else{
            startLoad()
        }

    },[]); 

    const removeAlert = () =>{ 
        setShowAlert(false)
        history.replace(ladder.name.replace(/\s/g, ''))
        
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
                            <Row style={{ paddingTop: 20, paddingRight: 20}}> 
                                <Container>
                                    <Row>
                                    {
                                        !loading ?
                                        <h1 className = "homeh2">{ladder.name}</h1>:
                                        <div></div>
                                    }
                                    </Row>
                                    <Row>
                                    <Alert show={showAlert} variant={'success'}>
                                        Successfully removed from ladder. <Alert.Link onClick={() => removeAlert()} >Remove</Alert.Link>
                                    </Alert>
                                    </Row>
                                    <Row style={{ paddingTop: 20, paddingLeft: 20}}>
                                    {
                                        !loading ?
                                        <LadderRanks ladder = {ladder} loading = {loading} setLoading = {setLoading}></LadderRanks>:
                                        <div></div>
                                    }
                                    </Row>
                                </Container>     
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </LoadingOverlay>
        </div>
    )

  
   
}
