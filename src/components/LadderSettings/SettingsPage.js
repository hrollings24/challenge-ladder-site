import React, { useState } from 'react'
import AdminSettings from './AdminSettings'
import UserSettings from './UserSettings'
import OtherSettings from './OtherSettings'
import { Tab, Tabs, Container, Row, Col, Alert } from "react-bootstrap"
import LoadingOverlay from 'react-loading-overlay';
import InviteSettings from './InviteSettings'


export default function SettingsPage({ladder, setLoading, setLoadingText}) {
    const [error, setError] = useState(false)

    const removeErrorAlert = () =>{ 
        setError("")        
    }

    return (
        <div>
        
            <Alert show={error!=""} variant="danger" onClose={() => removeErrorAlert()} dismissible>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>
                {error}
                </p>
            </Alert>
            <Container>
                <Row>
                    <h1 style={{paddingBottom:20}}>{ladder.name}</h1>
                </Row>
                <Row>
                    <Col>
                        <Tabs defaultActiveKey="laddersettings" id="settingstab" transition={false}>
                        <Tab eventKey="laddersettings" title="Settings">
                            <OtherSettings ladder={ladder} setLoading={setLoading} setError={setError} setLoadingText={setLoadingText}/>
                        </Tab>
                        <Tab eventKey="admins" title="Admins">
                            <AdminSettings ladder={ladder} setError={setError} setLoading={setLoading}/>
                        </Tab>
                        <Tab eventKey="users" title="Users">
                            <UserSettings ladder={ladder} setLoading={setLoading}/>
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
