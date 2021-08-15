import React, { useState } from 'react'
import { Container, Row, Col, Button , Modal, Alert, Form} from "react-bootstrap"
import firebase from 'firebase/app'
import FoundUser from './FoundUser'
import LoadingOverlay from 'react-loading-overlay';
import LadderUser from '../../Persistance/LadderUser';

export default function UserSearch({showSearch, setShowSearch, ladderData, purpose}) {
    const [textFieldValue, setTextFieldValue] = useState("")
    const [showResults, setShowResults] = React.useState(false)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = React.useState("")
    const [error, setError] = React.useState("")

    const removeAlert = () =>{ 
        setSuccess("")        
    }

    const removeErrorAlert = () =>{ 
        setError("")        
    }

    const removeModal = () => {
        setShowSearch(false)
    }

    const handleChangeFor = () => {
        setShowSearch(false)
    }

    const handleSubmit = (event) => {
        setUsers([]);
        event.preventDefault()
        const db = firebase.firestore();

        db.collection("users").where("username", "==", textFieldValue)
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.size == 0){
                console.log("no users found")
            }
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                var userLadder = new LadderUser()
                userLadder.loadWithIDAndData(doc.data(), doc.id)
                setUsers(users => [...users, userLadder]);
            });
            console.log(users)
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
        setShowResults(true)

    }

    return (
        <div>
            <LoadingOverlay
                active={loading}
                spinner
                text={"Sending Request"}>
                    <Modal show={showSearch} onHide={removeModal}>
                    <Modal.Header closeButton>
                    <Modal.Title>Search for User</Modal.Title>
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
                        <form onSubmit={handleSubmit}>
                        <input
                        type="text"
                        value={textFieldValue}
                        onChange={e => setTextFieldValue(e.target.value)}
                        />
                        <input type="submit" value="Submit" />
                        </form>
                        { showResults ? <FoundUser userData={users} ladderData={ladderData} setLoading={setLoading} setSuccess={setSuccess} setError={setError} purpose={purpose}></FoundUser> : null }
                        </Modal.Body>
                    <Modal.Footer></Modal.Footer>
                    </Modal>
                </LoadingOverlay>

            
        </div>
    )
}