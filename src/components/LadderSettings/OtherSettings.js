import React, { useState } from 'react'
import { Container, Row, Col, Button } from "react-bootstrap"
import firebase from 'firebase/app';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useHistory } from "react-router-dom";
import MainUser from "../../Persistance/MainUser"

export default function OtherSettings({ladder, setLoading, setError, setLoadingText}) {
    let history = useHistory();

    const submit = () => {
        confirmAlert({
          title: "Confirm",
          message: "Are you sure you want to delete this ladder?",
          buttons: [
            {
              label: "Yes",
              onClick: () => deleteLadder()
            },
            {
              label: "No"
            }
          ]
        });
      };

    const deleteLadder = () => {
        setLoadingText("Deleting Ladder")
        setLoading(true)
        const data = {
            ladderID: ladder.id,
        };

        const callableReturnMessage = firebase.functions().httpsCallable('deleteLadder');

        callableReturnMessage(data).then((result) => {
            MainUser.getInstance().refresh().then(() => {
                setLoading(false)
                setLoadingText("Authorising")
                history.push('/')
            }).catch((error) => {
                console.log(`error: ${JSON.stringify(error)}`);
                setLoading(false)
                });  

        }).catch((error) => {
            setLoading(false)
            setError(error)
        });
    }

    return (
        <div style={{paddingTop:20}}>
        <Container>
        <Row>
        <h3 style={{paddingBottom:10, paddingLeft: 10}}>Settings</h3>
        </Row>
        <Row>
            <Col>
                <h4>Permissions: {ladder.permission}</h4>
            </Col>
            <Col>
                <p>Change</p>
            </Col>
        </Row>
        <Row>
            <Col>
                <h4>Jump: {ladder.jump}</h4>
            </Col>
            <Col>
                <p>Change</p>
            </Col>
        </Row>
        <Row>
            <Col>
                <h4>Change Name</h4>
            </Col>
        </Row>
        <hr/>
        <Row>
            <Col>
            <Button variant="danger" onClick={() => submit()}>Delete Ladder</Button> 
            </Col>
        </Row>
        </Container>
        </div>
    )
}
