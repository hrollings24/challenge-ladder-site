import React from 'react'
import MainUser from "../../Persistance/MainUser"
import { Card, Row, Col, Container} from "react-bootstrap"
import { useHistory } from "react-router-dom"


export default function ChallengeCards() {
    const history = useHistory()


    const routeChange = (challenge) =>{ 
        history.push({
            pathname: '/challenge',
            search: '?query=' + challenge.id,
            state: { detail: challenge }
          }) 
    }

    const renderCards = (challenge) => {
            return (
                <Col onClick={() => routeChange(challenge)}  className="container-fluid mt-2">
                <Card style={{display: 'flex', flexDirection: 'row'}} key={challenge.id}>
                <Card.Body>
                    <Card.Title>{challenge.userToChallenge.getFullName()}</Card.Title>
                    <Card.Subtitle className="d-flex">
                     <strong>{challenge.ladderName}</strong>
                    </Card.Subtitle>
                    <Card.Text className="d-flex">
                     <strong>status: </strong>{challenge.status}
                    </Card.Text>
                </Card.Body>
                </Card>
                </Col>
            )
    }
   
    return (
        <div className="container-fluid py-2">
            <div className="d-flex flex-row flex-nowrap">
                <Container>
                    <Row>
                        {MainUser.getInstance().getChallenges().map(renderCards)}
                  </Row>
                </Container>
            </div>
        </div>
    );
 

   
}
