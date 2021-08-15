import React from 'react'
import { Container, Row, Col, Button } from "react-bootstrap"

export default function OtherSettings(ladderParam) {
    let ladder = ladderParam.ladderParam

    return (
        <div style={{paddingTop:20}}>
        <Container>
        <Row>
        <h3 style={{paddingBottom:10, paddingLeft: 10}}>Settings</h3>
        </Row>
        <Row>
            <Col>
                <h4>Permissions: {ladder.permission}</h4>
            </Col>
            <Col>
                <p>Change</p>
            </Col>
        </Row>
        <Row>
            <Col>
                <h4>Jump: {ladder.jump}</h4>
            </Col>
            <Col>
                <p>Change</p>
            </Col>
        </Row>
        <Row>
            <Col>
                <h4>Change Name</h4>
            </Col>
        </Row>
        <hr/>
        <Row>
            <Col>
            <Button variant="danger">Delete Ladder</Button> 
            </Col>
        </Row>
        </Container>
        </div>
    )
}
