import React, { useState, useEffect} from 'react'
import NotificationCards from './NotificationCards'
import { Card, Button, Alert, Container, Row, Col } from "react-bootstrap"
import Sidebar from "../Sidebar.js"
import MainUser from "../../Persistance/MainUser"
import { useAuth } from "../../contexts/AuthContext"


export default function NotificationPage() {

    const { currentUser, logout } = useAuth()
    const [error, setError] = useState("")
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

    
    return (
        <div>
            <div>
            <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
                <Row>
                    <Col md="auto">
                        <Sidebar></Sidebar>
                    </Col>
                    <Col style={{ paddingTop: 20, paddingRight: 20}}>
                        <h1>Notifications</h1>  
                        <NotificationCards></NotificationCards>
                    </Col>
                </Row>
            </Container>
        </div>
        </div>
    )
}
