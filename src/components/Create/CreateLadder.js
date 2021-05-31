import React from 'react'
import { Container, Row, Col } from "react-bootstrap"
import Sidebar from "../Sidebar.js"
import CreateForm from './CreateForm.js'


export default function CreateLadder() {
    return (
        <div>
            <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
                <Row>
                    <Col md="auto">
                        <Sidebar></Sidebar>
                    </Col>
                    <Col>
                        <Row style={{ paddingTop: 20, paddingRight: 20}}>   
                            <h1 className = "homeh2" >Create Ladder</h1>
                        </Row>
                        <Row>
                            <CreateForm></CreateForm>
                        </Row>
                        
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
