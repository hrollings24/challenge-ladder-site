import React, { useState, useEffect } from "react"
import Ladder from "../../Persistance/Ladder"
import 'firebase/firestore';
import { useAuth } from "../../contexts/AuthContext"
import ViewLadderSignedIn from './ViewLadderSignedIn'
import ViewLadderOutsider from './ViewLadderOutsider'
import firebase from "firebase";
import LoadingOverlay from 'react-loading-overlay';
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "../Sidebar";
import MainUser from "../../Persistance/MainUser";

export default function ViewLadder(props) {
    const { currentUser } = useAuth()
    const [ladder, setLadder] = useState(null);
    const [loading, setLoading] = useState(true);


    var refsAsArray = []
   
    //check ladder exists
    const findLadder = async () => {
        console.log("finding ladder")
        const db = firebase.firestore();
        const ladderRefs = await db.collection('ladders').where("url", "==", props.location.pathname.replace('/', '')).get()  
        
        ladderRefs.forEach(function(doc) {
            refsAsArray.push(doc)
        });

        console.log(refsAsArray.length)

        for (const docu of refsAsArray){
            const lad = new Ladder()
            await lad.load(docu.data(), docu)
            if (currentUser != null){
                await loadUser()
                await lad.loadAfterUserLoaded()
            }
            console.log(lad)
            setLadder(lad)
            setLoading(false)

            console.log(ladder)
        }

        if (refsAsArray.length == 0){
            if (currentUser != null){
                await loadUser()
            }
        }
        setLoading(false)
    }

    const loadUser = async () => {  

        if (MainUser.getInstance().getUserID() == ""){
            await MainUser.getInstance().setUser(currentUser.uid);
        }
    }

    useEffect(() => {
        findLadder()
    },[]); 


    return (
        <LoadingOverlay
        active={loading}
        spinner
        text='Loading'>
            <div>{currentUser != null ? 
                <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <Row>
                        <Col md="auto">
                            <Sidebar></Sidebar>
                        </Col>
                        {loading ? 
                        <div></div> : 
                        <div>{ladder == null ? <div>404 NOT FOUND</div> : 
                                <ViewLadderSignedIn ladder = {ladder} setLoading={setLoading}></ViewLadderSignedIn>}
                        </div>}
                    </Row> 
                </Container>: 
                <div>{loading ? 
                    <div></div> : 
                    <div>{ladder == null ? <div>404 NOT FOUND</div> : 
                            <ViewLadderOutsider ladder = {ladder}></ViewLadderOutsider>}
                    </div>}
                </div>}
            </div>
        </LoadingOverlay>
    )
}
