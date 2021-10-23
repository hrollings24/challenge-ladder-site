import React, { useState, useEffect }from 'react'
import { Container, Row, Col, Alert } from "react-bootstrap"
import '../Home/Home.css';
import Sidebar from "../Sidebar.js"
import { useAuth } from "../../contexts/AuthContext"
import MainUser from "../../Persistance/MainUser"
import { useHistory, useLocation } from "react-router-dom"
import LoadingOverlay from 'react-loading-overlay';
import Ladder from "../../Persistance/Ladder"
import firebase from 'firebase/app';
import SettingsPage from './SettingsPage';
import '../Ladder/Ladder.css'
import ForbiddenSettings from './ForbiddenSettings';

export default function LadderSettings(props) {
    const { currentUser, logout } = useAuth()
    const [userDataLoaded, setUserDataLoaded] = useState(false)
    const history = useHistory()
    const location = useLocation()
    const [ladder, setLadder] = useState();
    const [loading, setLoading] = useState(true);
    const [ladderLoading, setLadderLoading] = useState(true);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [authorised, setAuthorised] = useState("");
    const [authorisedText, setAuthorisedText] = useState("Authorising");
    const [defaultTab, setDefaultTab] = useState("laddersettings");


    const laddername = props.location.pathname


    var refsAsArray = []

    const loadLadder = async () => {  
        const db = firebase.firestore();
        let name = laddername.split('/')
        let url = ""
        if (name[0] == ""){
            url = name[1]
            if (props.location.search == "?=requests"){
                setDefaultTab("users")
            }
        }
        else{
            url = name[0]
            if (props.location.search == "?=requests"){
                setDefaultTab("users")
            }
        }
        const ladderRefs = await db.collection('ladders').where("url", "==", url).get()  
        
        ladderRefs.forEach(function(doc) {
            refsAsArray.push(doc)
        });

        for (const docu of refsAsArray){
            const lad = new Ladder()
            await lad.load(docu.data(), docu)
            await lad.loadAfterUserLoaded()  
            setLadder(lad)
            if (lad.amIAdmin()){
                setAuthorised(true)
            }
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
                text={authorisedText}>
                <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <Row>
                        <Col md="auto">
                            <Sidebar></Sidebar>
                        </Col>
                        <Col>
                            <Container style={{ paddingTop: 20, paddingRight: 20 }}>
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
                            </Container>  
                            {
                                loading ?
                                <div></div> :
                                <div>
                                    {
                                        authorised ?
                                        <div>
                                        <SettingsPage ladder={ladder} setLoading={setLoading} setLoadingText={setAuthorisedText} selectedTab={defaultTab}></SettingsPage> </div>:
                                        <ForbiddenSettings></ForbiddenSettings>
                                    } 
                                </div>
                            }
                             
                        </Col>
                    </Row>
                </Container>
            </LoadingOverlay>
        </div>
    )
}
