import React, { useState, useEffect }from 'react'
import { Container, Row, Col, Alert } from "react-bootstrap"
import Avatar from 'react-avatar';
import Ladder from "../../Persistance/Ladder"
import LadderUser from "../../Persistance/LadderUser"
import LoadingOverlay from 'react-loading-overlay';

export default function LadderUserDisplayer(ladderUserIds, type) {
    const [userDataLoaded, setUserDataLoaded] = useState(false)
    const [ladderUsers, setLadderUsers] = useState([])

    useEffect(() => {
        startLoad()
    },[]); 

    useEffect(() => {
        if (ladderUsers.length == ladderUserIds.ladderUserIds.length){
            setUserDataLoaded(true)
        }
    },[ladderUsers]); 

    function startLoad(){
        setLadderUsers([])
        ladderUserIds.ladderUserIds.map(loadUser)
    }

    const loadUser = (ladderUserId) => {
        var userLadder = new LadderUser()
        userLadder.load(ladderUserId).then(() => {
            setLadderUsers( arr => [...arr, userLadder]);
        }).catch((error) => {
            console.error("Error getting user: ", error);
        });
    }

    const removeUser = (ladderUser) => {
        switch (type){
            case "admin":

                break
            case "user":

                break
        }

    }


    const renderRank = (ladderUser) => {
        return (
            <Container key={ladderUser.userID}>
                <Row md="auto">
                    <Col md="auto">
                        <Avatar round = {true} name={ladderUser.getFullName()} src={ladderUser.picture}/>
                    </Col>

                    <Col className="container-fluid mt-2">
                
                        <Row className = "rankText">
                            <Col className="container-fluid mt-2">
                                <h3>{ladderUser.getFullName()}</h3>
                                <h4>{ladderUser.username}</h4>
                            </Col>
                            <Col className="container-fluid mt-2">
                                <h4 style={{justifyContent: 'center', cursor: "pointer"}}>Remove</h4>
                            </Col>
                        </Row>  
                    </Col>
                </Row>

            </Container>    
        )
    }

    return (
        <div>
             <LoadingOverlay
                active={!userDataLoaded}
                spinner
                text={"Loading"}>
                    {ladderUsers.map(renderRank)}  
                </LoadingOverlay>
            
        </div>
    )
}
