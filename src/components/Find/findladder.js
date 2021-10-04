import React, { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import { Container, Row, Col, Alert } from "react-bootstrap"
import MainUser from "../../Persistance/MainUser"
import Sidebar from "../Sidebar.js"
import './findladder.css';
import { TextField } from '@material-ui/core';
import { useForm, Controller } from "react-hook-form";
import firebase from 'firebase/app'
import '@firebase/storage'
import axios from 'axios'
import { Hint } from 'react-autocomplete-hint';
import {ReactSpinner} from 'react-spinning-wheel';
import Ladder from "../../Persistance/Ladder"
import FoundLadder from "./FoundLadder"

export default function FindLadder() {
    const { currentUser, logout } = useAuth()
    const history = useHistory()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState("")
    const [ladderData, setLadderData] = useState();
    const { handleSubmit, control } = useForm();
    const [showResults, setShowResults] = useState(false)
    const [hintData, setHintData] = useState([])
    const [text, setText] = useState('')

    var ladderNames = []

    const removeErrorAlert = () =>{ 
        setError("")        
    }

    const removeAlert = () =>{ 
        setSuccess("")        
    }

    const onSubmit = async event => {
        if(event.key === "Enter"){
            setLoading(true)
            console.log(text)

            const snapshot = await firebase.firestore().collection('ladders').where('name', '==', text).where("permission", "in", ["Open", "Public, with Requests"]).get()
        

            if (snapshot.empty) {
                console.log('No matching documents.');
                setLoading(false)
                return;
            } 
            else{
                snapshot.forEach(doc => {
                    const lad = new Ladder()
                    lad.load(doc.data(), doc.ref).then(() => {
                        setLadderData(lad)
                        setShowResults(true)
                    })
                })
            }
            setLoading(false)
        }
    }

    const onError = (errors, e) => console.log(errors, e);

    const findLadders = async () => {

        const snapshot = await firebase.firestore().collection('ladders').where("permission", "in", ["Open", "Public, with Requests"]).get()
        var laddernamers = Array.from(snapshot.docs.map(doc => doc.data().name)) 
        setHintData(laddernamers)
    }

    useEffect(() => {
        findLadders()
      }, []);


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
                    </Row>
                    <Row>
                    <Hint options={hintData} allowTabFill>
                    <input type="text" onKeyDown={onSubmit} className='input-with-hint' value={text} onChange={e => setText(e.target.value)}/>     
                    </Hint>
                    </Row>
                    <Row>
                    {loading ? <ReactSpinner/> : <div></div>}
                    { showResults ? <FoundLadder ladderData={ladderData} setLoading={setLoading} setSuccess={setSuccess} setError={setError}></FoundLadder> : null }
                    </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

