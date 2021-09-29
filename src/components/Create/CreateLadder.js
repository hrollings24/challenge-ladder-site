import React, { useState, useEffect } from "react"
import { Container, Row, Col, Alert } from "react-bootstrap"
import Sidebar from "../Sidebar.js"
import CreateForm from './CreateForm.js'
import LoadingOverlay from 'react-loading-overlay';


export default function CreateLadder() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const removeErrorAlert = () =>{ 
        setError("")        
    }

    return (

        <LoadingOverlay
        active={loading}
        spinner
        text='Loading'>
        <div>
            <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
                <Row>
                    <Col md="auto">
                        <Sidebar></Sidebar>
                    </Col>
                    <Col>
                        <Row style={{ paddingTop: 20, paddingRight: 20}}>   
                            <h1 className = "homeh2" >New Ladder</h1>
                        </Row>
                        <Row style={{paddingRight: 20}}>   
                            <h4>Got an exciting idea for a new ladder? Perfect! Complete this page to create a brand new ladder, then start adding people right away</h4>
                        </Row>
                        <Alert show={error!=""} variant="danger" onClose={() => removeErrorAlert()} dismissible>
                                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                                    <p>
                                    {error}
                                    </p>
                                </Alert>
                        <Row style={{ paddingTop: 20, paddingRight: 20}}>
                            <Col style={{ paddingLeft: 60, paddingRight: 60}}>   
                            <CreateForm setLoading={setLoading} setError={setError}></CreateForm>
                            </Col>
                        </Row>
                        
                    </Col>
                </Row>
            </Container>
        </div>
        </LoadingOverlay>
    )
}
