import React, { useState } from 'react'
import { Container, Row, Col, Button } from "react-bootstrap"
import firebase from 'firebase/app';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useHistory } from "react-router-dom";
import MainUser from "../../Persistance/MainUser"
import ChangeSettingModal from './ChangeSettingModal/ChangeSettingModal';

export default function OtherSettings({ladder, setLoading, setError, setLoadingText}) {
    let history = useHistory();
    const [showModal, setShowModal] = React.useState(false)
    const [settingToChange, setSettingToChange] = React.useState("")


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


    const changeJump = () => {
        console.log("Jump clicked!")
        setSettingToChange("jump")
        setShowModal(true)
    }

    const changePermissions = () => {
        console.log("permissions clicked!")
        setSettingToChange("permission")
        setShowModal(true)
    }

    const changeName = () => {
        console.log("name clicked!")
        setSettingToChange("name")
        setShowModal(true)
    }

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
        <ChangeSettingModal showModal={showModal} setShowModal={setShowModal} settingToChange={settingToChange} ladder={ladder}></ChangeSettingModal>   
        <Container>
        <Row>
        <h3 style={{paddingBottom:10, paddingLeft: 10}}>Settings</h3>
        </Row>
        <Row>
            <Col>
                <h4>Permissions: {ladder.permission}</h4>
            </Col>
            <Col>
                <p onClick={() => changePermissions()}>Change</p>
            </Col>
        </Row>
        <Row>
            <Col>
                <h4>Jump: {ladder.jump}</h4>
            </Col>
            <Col>
                <p onClick={() => changeJump()}>Change</p>
            </Col>
        </Row>
        <Row>
            <Col>
                <h4>Name: {ladder.name}</h4>
            </Col>
            <Col>
                <p onClick={() => changeName()}>Change</p>
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
