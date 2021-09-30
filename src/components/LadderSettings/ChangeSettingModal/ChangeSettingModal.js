import React, { useState } from 'react'
import { Container, Row, Col, Button , Modal, Alert, Form} from "react-bootstrap"
import firebase from 'firebase/app'
import LoadingOverlay from 'react-loading-overlay';
import ChangeSettingForm from './ChangeSettingForm';
import {ReactSpinner} from 'react-spinning-wheel';
import 'react-spinning-wheel/dist/style.css';

export default function ChangeSettingModal({showModal, setShowModal, settingToChange, ladder}) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = React.useState("")
    const [error, setError] = React.useState("")

    const removeModal = () => {
        setShowModal(false)
    }

    const removeAlert = () =>{ 
        setSuccess("")        
    }

    const removeErrorAlert = () =>{ 
        setError("")        
    }

    console.log(loading)

    return (
        <div>
            <Modal show={showModal} onHide={removeModal}>
            <Modal.Header closeButton>
            <Modal.Title>Change {settingToChange}</Modal.Title>
            </Modal.Header>
                <Modal.Body>
                <Container style={{ paddingTop: 20, paddingRight: 20 }}>
                        <Alert show={error!=""} variant="danger" onClose={() => removeErrorAlert()} dismissible>
                            <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                            <p>
                            {error}
                            </p>
                        </Alert>
                        <Alert show={success!=""} variant="success" onClose={() => removeAlert()} dismissible>
                            <Alert.Heading>Success!</Alert.Heading>
                            <p>
                            {success}
                            </p>
                        </Alert>
                    </Container>  
                    { !loading ? <p></p> : <ReactSpinner />}            
                </Modal.Body>
            <ChangeSettingForm settingType={settingToChange} ladder={ladder} setLoading={setLoading} setError={setError} setSuccess={setSuccess}></ChangeSettingForm>
            <Modal.Footer></Modal.Footer>
            </Modal>
        </div>
    )
}
