import React, { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import { Container, Row, Col } from "react-bootstrap"
import MainUser from "../../Persistance/MainUser"
import Sidebar from "../Sidebar.js"
import './findladder.css';

export default function FindLadder() {
    const { currentUser, logout } = useAuth()
    const history = useHistory()
    const [error, setError] = useState("")
    const [userDataLoaded, setUserDataLoaded] = useState(false)
    const [image, setImage] = useState({ preview: "", raw: "" });

    return (
        <div>
            <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
                <Row>
                    <Col md="auto">
                        <Sidebar></Sidebar>
                    </Col>

                    <Col>
                    <Row>
                        <h1>Find Ladders</h1>
                    </Row>
                    <Row>
                    <div class="search">
                        <input type="text" class="searchTerm" placeholder="Search for a ladder"></input>
                        <button type="submit" class="searchButton">
                            <i class="fa fa-search"></i>
                        </button>
                    </div>
                    </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
