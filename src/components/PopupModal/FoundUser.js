import React, { useState, useEffect }from 'react'
import { Container, Row, Col, Button , Modal, Alert, Form} from "react-bootstrap"
import MainUser from "../../Persistance/MainUser"
import firebase from 'firebase/app';
import {ReactSpinner} from 'react-spinning-wheel';
import 'react-spinning-wheel/dist/style.css';

export default function FoundUser({userData, ladderData, setLoading, setSuccess, setError, purpose}) {

    const [finding, setFinding] = React.useState(false)

    const addAdmin = async (userData) => {

        setFinding(true)

        let dataToSend = {
            toUserID: userData.userID,
            message: MainUser.getInstance().username + " has invited you to be an admin of " + ladderData.name,
            ladderID: ladderData.id,
            type: "admin",
            title: "Admin Request Recieved",
            fromUser: MainUser.getInstance().userID,
            username: userData.username
        }
        console.log(dataToSend)

        const callableReturnMessage = firebase.functions().httpsCallable('addAdmin');

        setFinding(true)
        callableReturnMessage(dataToSend).then((result) => {
            console.log(result.data);
            setFinding(false)
            if (result.data.title == "Error"){
                setError(result.data.message)
            }
            else{
                setSuccess(result.data.message)
            }
        }).catch((error) => {
          console.log(`error: ${JSON.stringify(error)}`);
          setFinding(false)
          setError(`error: ${JSON.stringify(error)}`)
        });
    }

    const inviteUser = async (userData) => {

        setFinding(true)

        let dataToSend = {
            toUserID: userData.userID,
            message: MainUser.getInstance().username + " has invited you to join " + ladderData.name,
            ladderID: ladderData.id,
            type: "invite",
            title: "Invitation Recieved",
            fromUser: MainUser.getInstance().userID,
            username: userData.username
        }
        console.log(dataToSend)

        const callableReturnMessage = firebase.functions().httpsCallable('inviteUser');

        callableReturnMessage(dataToSend).then((result) => {
            console.log(result.data);
            setFinding(false)
            if (result.data.title == "Error"){
                setError(result.data.message)
            }
            else{
                setSuccess(result.data.message)
            }
        }).catch((error) => {
          console.log(`error: ${JSON.stringify(error)}`);
          setFinding(false)
          setError(`error: ${JSON.stringify(error)}`)
        });
    }

    const runBackend = async (userData) => {
        if (purpose == "user"){
            inviteUser(userData)
        }
        else{
            addAdmin(userData)
        }
    }


    const renderUser = (user) => {
        return (
            <div key={user.userID}>
                <Row style={{paddingTop:10}} className="align-items-center">
                    <Col>
                    <h3>{user.firstName} {user.surname}</h3>
                    </Col>
                    <Col>
                    { !finding ? <h4 className="text-right" onClick={() => runBackend(user)} style={{cursor: "pointer"}}>Add</h4> : <ReactSpinner />}            
                    </Col>
                </Row>
            </div>
        )
    }

    return (
        <div>
            {userData.map(renderUser)}    
        </div>
    )



    
}
