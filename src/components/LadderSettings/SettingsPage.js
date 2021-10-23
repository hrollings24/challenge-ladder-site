import React, { useState, useEffect } from 'react'
import AdminSettings from './AdminSettings'
import UserSettings from './UserSettings'
import OtherSettings from './OtherSettings'
import { Tab, Tabs, Container, Row, Col, Alert } from "react-bootstrap"
import LoadingOverlay from 'react-loading-overlay';
import InviteSettings from './InviteSettings'


export default function SettingsPage({ladder, setLoading, setLoadingText, selectedTab}) {
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState("")

    const removeErrorAlert = () =>{ 
        setError("")        
    }

    const removeSuccessAlert = () =>{ 
        setSuccess("")        
    } 

    return (
        <div>
        
            <Alert show={error!=""} variant="danger" onClose={() => removeErrorAlert()} dismissible>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>
                {error}
                </p>
            </Alert>
            <Alert show={success!=""} variant={'success'}>
                {success} <Alert.Link onClick={() => removeSuccessAlert()}>Remove</Alert.Link>
            </Alert>
            <Container>
                <Row>
                    <h1 style={{paddingBottom:20}}>{ladder.name}</h1>
                </Row>
                <Row>
                    <Col>
                        <Tabs defaultActiveKey={selectedTab} id="settingstab" transition={false}>
                        <Tab eventKey="laddersettings" title="Settings">
                            <OtherSettings ladder={ladder} setLoading={setLoading} setError={setError} setLoadingText={setLoadingText}/>
                        </Tab>
                        <Tab eventKey="admins" title="Admins">
                            <AdminSettings ladder={ladder} setError={setError} setLoading={setLoading}/>
                        </Tab>
                        <Tab eventKey="users" title="Users">
                            <UserSettings ladder={ladder} setLoading={setLoading} setSuccess={setSuccess} setError={setError}/>
                        </Tab>
                        <Tab eventKey="invites" title="Invites">
                            <InviteSettings ladder={ladder} setLoading={setLoading}/>
                        </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </Container>

        </div>
    )
}
