import React from 'react'
import { Card, Button, Alert, Container, Row, Col } from "react-bootstrap"
import { confirmAlert } from "react-confirm-alert";
import MainUser from '../../Persistance/MainUser';
import firebase from 'firebase/app'
import '@firebase/storage'


export default function FoundLadder({ladderData, setLoading, setSuccess, setError}) {

    const submit = () => {
        confirmAlert({
            title: "Confirm",
            message: "Are you sure you want to join this ladder?",
            buttons: [
            {
                label: "Yes",
                onClick: () => joinLadder()
            },
            {
                label: "No"
                // onClick: () => alert("Click No")
            }]
        });
    };

    const joinLadder = () => {
        setLoading(true)
        const dataToSend = {
            userID: MainUser.getInstance().userID,
            ladderID: ladderData.id
        };

        const callableReturnMessage = firebase.functions().httpsCallable('requestToJoinALadder');

        callableReturnMessage(dataToSend).then((result) => {
            setLoading(false)
            if (result.data.title == "Error"){
                setError(result.data.message)
            }
            else{
                setSuccess(result.data.message)
            }
        }).catch((error) => {
          console.log(`error: ${JSON.stringify(error)}`);
          setLoading(false)
          setError(`error: ${JSON.stringify(error)}`)
        });
    }


    return (
        <div>
            
            <Container>
            <Row>
            <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{ladderData.name}</Card.Title>
                <Card.Text>
                {ladderData.description}
                </Card.Text>
                <Card.Link onClick={() => submit()}>Join Ladder</Card.Link>
            </Card.Body>
            </Card>
            </Row>
            </Container>
        </div>
    )

  
}
