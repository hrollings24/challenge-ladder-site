import LadderUserDisplayer from './LadderUserDisplayer'
import ViewRequests from './ViewRequests'
import React, { useState } from 'react'
import { Container, Row, Col, Button , Modal, Alert, Form} from "react-bootstrap"
import UserSearch from '../PopupModal/UserSearch'

export default function UserSettings(ladderParam) {
    let ladder = ladderParam.ladderParam
    const [showSearch, setShowSearch] = useState(false)

    const addUserClicked = () => {
        setShowSearch(true)
    }

    return (
        <div>
            <UserSearch showSearch={showSearch} setShowSearch={setShowSearch} ladderData={ladder} purpose={"user"}></UserSearch>   
            <div style={{paddingTop:20, paddingLeft: 10}}>
            <h3>Requests</h3>
            <ViewRequests ladderParam={ladder}></ViewRequests>
            <hr/>
            <Row>
                <Col>
                <h3>Current Users</h3>
                </Col>
                <Col>
                <h4 className="text-right" onClick={() => addUserClicked()} style={{cursor: "pointer"}}>Invite Users</h4>
                </Col>
            </Row>
            <LadderUserDisplayer ladderUserIds={ladder.positions}></LadderUserDisplayer>
        </div>
        </div>
    )
}
