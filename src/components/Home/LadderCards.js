import React from 'react'
import MainUser from "../../Persistance/MainUser"
import { Card, Button, Alert, Container, Row, Col } from "react-bootstrap"
import { useHistory } from "react-router-dom"

export default function LadderCards() {
    const history = useHistory()

    const routeChange = (ladderurl) =>{ 
            history.push({
                pathname: ladderurl,
            })
    }

    const renderCards = (ladder) => {
        if (ladder.challengesIHaveWithOtherUserIds.size == 0){
            return (
                <Col className="container-fluid mt-2">
                <Card className="card h-100" onClick={() => routeChange(ladder.url)} style={{display: 'flex', flexDirection: 'row'}} key={ladder.id}>
                <Card.Body>
                    <Card.Title>{ladder.name}</Card.Title>
                    <Card.Subtitle className="d-flex">
                     <strong>{ladder.description}</strong>
                    </Card.Subtitle>
                    <Card.Text className="d-flex">
                    You have no ongoing challenges in this ladder. Start a challenge today!
                    </Card.Text>
                </Card.Body>
                </Card>
                </Col>
            )
        }

        if (ladder.challengesIHaveWithOtherUserIds.size == 1){
            return (
                <Col className="container-fluid mt-2">
                <Card className="card h-100" onClick={() => routeChange(ladder.url)} style={{display: 'flex', flexDirection: 'row'}} key={ladder.id}>
                <Card.Body>
                    <Card.Title>{ladder.name}</Card.Title>
                    <Card.Subtitle className="d-flex">
                     <strong>{ladder.description}</strong>
                    </Card.Subtitle>
                    <Card.Text className="d-flex">
                    You have a challenge in this ladder</Card.Text>
                </Card.Body>
                </Card>
                </Col>
            )
        }

        return (
            <Col className="container-fluid mt-2">
                <Card className="card h-100" onClick={() => routeChange(ladder.url)} style={{display: 'flex', flexDirection: 'row'}} key={ladder.id}>
                <Card.Body>
                    <Card.Title>{ladder.name}</Card.Title>
                    <Card.Subtitle className="d-flex">
                     <strong>{ladder.description}</strong>
                    </Card.Subtitle>
                    <Card.Text className="d-flex">
                    You have {ladder.challengesIHaveWithOtherUserIds.size} challenges in this ladder                    
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
                    {MainUser.getInstance().getLadders().map(renderCards)}
                    </Row>
                </Container>

            </div>
        </div>
    );
 

   
}
