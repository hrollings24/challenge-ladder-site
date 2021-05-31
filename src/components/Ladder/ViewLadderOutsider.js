import React from 'react'
import LadderRanks from './LadderRanks'
import { Container, Row, Col } from "react-bootstrap"

export default function ViewLadderOutsider({ ladder }) {

    return (
        <div>
            <h1>{ladder.name}</h1>
            <Container>
                <Row style={{ paddingTop: 20, paddingLeft: 20}}>
                    <LadderRanks ladder = {ladder}></LadderRanks>
                </Row>
            </Container>
        </div>
    )
}
