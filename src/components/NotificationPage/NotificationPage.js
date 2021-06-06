import React, { useState, useEffect} from 'react'
import NotificationCards from './NotificationCards'
import { Card, Button, Alert, Container, Row, Col } from "react-bootstrap"
import Sidebar from "../Sidebar.js"
import MainUser from "../../Persistance/MainUser"
import { useAuth } from "../../contexts/AuthContext"
import LoadingOverlay from 'react-loading-overlay';


export default function NotificationPage() {

    const { currentUser, logout } = useAuth()
    const [error, setError] = useState("")
    const [userDataLoaded, setUserDataLoaded] = useState(false)
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState("")


    async function userLoaded() {
        
        if (MainUser.getInstance().getUserID() == ""){
            await MainUser.getInstance().setUser(currentUser.uid);
            setUserDataLoaded(true);
            setLoading(false)
        }
        else{
            setUserDataLoaded(true);
            setLoading(false)
        }
    }

    const removeAlert = () =>{ 
        setSuccess("")
        setError("")
    }

    useEffect(() => {
        userLoaded()
    },[]); 

    useEffect(() => {
        console.log(loading)
    },[loading])
    
    return (
        <div>
            <LoadingOverlay
                active={loading}
                spinner
                text='Loading'>
            <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
                <Row>
                    <Col md="auto">
                        <Sidebar></Sidebar>
                    </Col>
                    <Col style={{ paddingTop: 20, paddingRight: 20}}>
                        <h1>Notifications</h1>  
                        <Alert show={success!=""} variant={'success'}>
                            {success}<Alert.Link onClick={() => removeAlert()} >. Remove</Alert.Link>
                        </Alert>
                        <Alert show={error!=""} variant={'error'}>
                            {error}<Alert.Link onClick={() => removeAlert()} >. Remove</Alert.Link>
                        </Alert>
                        <NotificationCards setProcessingNote={setLoading} setError={setError} setSuccess={setSuccess}></NotificationCards>
                    </Col>
                </Row>
            </Container>
            </LoadingOverlay>
        </div>
    )
}
