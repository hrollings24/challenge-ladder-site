import React from 'react'
import AdminSettings from './AdminSettings'
import UserSettings from './UserSettings'
import OtherSettings from './OtherSettings'
import { Tab, Tabs, Container, Row, Col } from "react-bootstrap"


export default function SettingsPage(ladderParam) {
    let ladder = ladderParam.ladderParam
    return (
        <div>
            <Container>
                <Row>
                    <h1 style={{paddingBottom:20}}>{ladder.name}</h1>
                </Row>
                <Row>
                    <Col>
                        <Tabs defaultActiveKey="laddersettings" id="settingstab" transition={false}>
                        <Tab eventKey="laddersettings" title="Settings">
                            <OtherSettings ladderParam={ladder}/>
                        </Tab>
                        <Tab eventKey="admins" title="Admins">
                            <AdminSettings ladderParam={ladder}/>
                        </Tab>
                        <Tab eventKey="users" title="Users">
                            <UserSettings ladderParam={ladder}/>
                        </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
