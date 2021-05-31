import React from 'react'
import { Card, Button, Alert, Container, Row, Col } from "react-bootstrap"
import '../App.css';
import LogoImage from "./logo"
import MainUser from "../Persistance/MainUser"
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"

export default function Sidebar() {
    const { currentUser, logout } = useAuth()
    const history = useHistory()


    const moveToAccount = () =>{ 
        history.push('/account')
    }

    const moveToFind = () =>{ 
        history.push('/findladders')
    }


    const moveToCreate = () =>{ 
        history.push('/create')
    }


    return (
        <div className = "sidebar">
            <Container fluid>
                <Row className="justify-content-md-center" style={{ paddingTop: 20}}>
                    <LogoImage></LogoImage>
                </Row>
                <br></br>
                <Row style={{ paddingLeft: 20, paddingRight: 20 }}>
                    <h3 className = "h3"> Welcome, {MainUser.getInstance().getFullName()} </h3>
                    <h4 className = "h5" onClick = {logout}>Not {MainUser.getInstance().getFirstName()}? Log Out</h4>
                </Row> 
                <Row style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 20 }}>
                    <h4 className = "h4" onClick = {moveToFind} >Find Ladders</h4>
                </Row> 
                <Row style={{ paddingLeft: 20, paddingRight: 20}}>
                    <h4 className = "h4" onClick = {moveToCreate} >Create Ladders</h4>
                </Row> 
                <Row style={{ paddingLeft: 20, paddingRight: 20}}>
                    <h4 className = "h4" onClick = {moveToAccount} >View Account</h4>
                </Row> 
            </Container>
        </div>
    )
}
