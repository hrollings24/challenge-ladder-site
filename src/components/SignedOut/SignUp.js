import React, { useState, useEffect } from "react"
import HomeAwayLogo from '../../Images/HomeAwayLogo'
import "./HomeAway.css";
import { Container, Row, Col, Alert } from "react-bootstrap"
import ClimbingLadder from '../../Images/ClimbingLadder';
import NavBar from './NavBar';
import { useAuth } from "../../contexts/AuthContext"
import MainUser from "../../Persistance/MainUser"

export default function Signup() {
    const { currentUser, logout } = useAuth()
    const [userDataLoaded, setUserDataLoaded] = useState(false)
    const [usersName, serUsersName] = useState(null)


    async function userLoaded() {
        
        if (MainUser.getInstance().getUserID() == ""){
            await MainUser.getInstance().setUser(currentUser.uid);
            setUserDataLoaded(true);
            serUsersName(MainUser.getInstance().getFullName())
        }
        else{
            setUserDataLoaded(true);
            serUsersName(MainUser.getInstance().getFullName())
        }
    }

    useEffect(() => {
        if (currentUser != null){
            userLoaded()
        }


    },[]); 


    return (
        <div>
            <NavBar usersname={usersName}></NavBar>
            <Container fluid style={{ paddingLeft: 0, paddingRight: 0}}>
                <Row style={{ paddingTop: 20}}>
                    <Col>
                        Sign Up
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
