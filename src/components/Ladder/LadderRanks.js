import React from 'react'
import './Ladder.css';
import { Container, Row, Col, ListGroup } from "react-bootstrap"
import RankText from './RankText'
import Avatar from 'react-avatar';

export default function LadderRanks({ ladder, setLoading, setError, setSuccess}) {

    const renderRank = (ladderUser) => {
        let userandladder = [ladderUser, ladder]
        return (
            <Container key={ladderUser.userID}>
                <Row md="auto">
                    <Col md="auto">
                        <Avatar round = {true} name={ladderUser.getFullName()} src={ladderUser.picture}/>
                    </Col>

                    <Col className="container-fluid mt-2">
                
                        <Row className = "rankText">
                            <Col  md="auto">
                                <h3>{ladderUser.position}</h3>
                            </Col>
                            <Col className="container-fluid mt-2">
                                <h3>{ladderUser.getFullName()}</h3>
                                <h4>{ladderUser.username}</h4>
                            </Col>

                            <Col className="container-fluid mt-2">
                                <RankText userandladder = {userandladder} setLoading = {setLoading} setError={setError} setSuccess={setSuccess}></RankText>
                            </Col>

                        </Row>  
                        
                    </Col>
                </Row>

            </Container>    
        )
    }
    return (
        <div>
            {ladder.positionsAsLoadedUsers.map(renderRank)}    
        </div>
    )
}
