import React, { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Container, Row, Col, Button , Modal, Alert} from "react-bootstrap"
import MainUser from "../../Persistance/MainUser"
import Sidebar from "../Sidebar.js"
import '../images.css';
import 'antd/dist/antd.css'; 
import firebase from 'firebase/app'
import '@firebase/storage'
import { useHistory, useLocation } from "react-router-dom"
import LoadingOverlay from 'react-loading-overlay';
import Avatar from 'react-avatar';
import { confirmAlert } from "react-confirm-alert";
import { TextField } from '@material-ui/core';
import {ReactSpinner} from 'react-spinning-wheel';


export default function Account() {
    const { currentUser, logout } = useAuth()
    const history = useHistory()
    const [error, setError] = useState("")
    const [userDataLoaded, setUserDataLoaded] = useState(false)
    const [image, setImage] = useState({ preview: "", raw: "" })
    const [profileImage, setProfileImage] = useState(null);
    const [show, setShow] = useState(false);
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [usernameLoading, setUsernameLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const location = useLocation()
    const [loading, setLoading] = useState(true);
    const [loadingText, setLoadingText] = useState("Loading");


    useEffect(() => {
        // visible true -> false
        if (loading) {
          //setTimeout(() => setLoaded(true), 250); // 0.25초 뒤에 해제
          //debugger;
          setTimeout(() => setLoading(false), 10000); // 10초 뒤에
        }
    
        //setLoaded(loaded);
      }, [loading]);

    const [newProfileImage, setNewProfileImage] = useState(null);

    const newImageUploaded = e => {
        console.log(e.target.files)
        if (e.target.files[0]){
            setNewProfileImage(e.target.files[0])
        }
    }


    const handleUsernameChange = () => {
        //check username in backend
        const db = firebase.firestore();
        setUsernameLoading(true)
        const data = {
            username: username
        };

        const callableReturnMessage = firebase.functions().httpsCallable('checkUsername');
        callableReturnMessage(data).then((result) => {
            if (result.data){
                //change username

                var ref = db.collection("users").doc(MainUser.getInstance().userID)
                ref.update({username: username}).then((result) => {
                    setShowSuccessAlert(true)
                    setUsernameLoading(false)
                    MainUser.getInstance().refresh()
                }).catch((error) => {
                  console.log(`error: ${JSON.stringify(error)}`);
                  setUsernameLoading(false)
                  setError(`error: ${JSON.stringify(error)}`)
                });
            }
            else{
                setError("Username already taken")
            }
            setUsernameLoading(false)
          }).catch((error) => {
            setUsernameLoading(false)
            setError(`error: ${JSON.stringify(error)}`)
          });
    }

    const handleUpload = () => {
        console.log(newProfileImage)
        const storage = firebase.storage()
        const storageRef = storage.ref();
        const uploadTask = storageRef.child(`profileimages/${newProfileImage.name}`).put(newProfileImage)
        uploadTask.on(
            "state_changed",
            snapshot => {},
            error => {
                console.log(error)
            },
            () => {
                storage
                .ref("profileimages")
                .child(newProfileImage.name)
                .getDownloadURL()
                .then(url => {
                    setProfileImage(url)
                    handleClose()
                })
            }
        )
    }

    const showAlert = () =>{ 
        history.push({
            search: '?success',
          }) 
    }

    const showErrorAlert = () =>{ 
        history.push({
            search: '?error',
          }) 
    }

    const removeAlert = () =>{ 
        setShowSuccessAlert(false)
        setError("")
        history.replace("account".replace(/\s/g, ''))
    }


    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleUsernameShow = () => setShowUsernameModal(true);
    const handleUsernameClose = () => setShowUsernameModal(false);

    const handleSave = () => {

        setLoadingText("Saving Changes")
        setLoading(true)

        const accountData = {
            userID: MainUser.getInstance().userID,
            picture: profileImage
        };

        const callableReturnMessage = firebase.functions().httpsCallable('saveAccountChanges');
        callableReturnMessage(accountData).then((result) => {
            console.log(result.data);
            setLoading(false)
            setLoadingText("Loading")
            setShowSuccessAlert(true)
          }).catch((error) => {
              showErrorAlert()
              setLoadingText("Loading")
              setLoading(false)
            console.log(`error: ${JSON.stringify(error)}`);
          });

    }

    async function userLoaded() {
        
        if (MainUser.getInstance().getUserID() == ""){
            await MainUser.getInstance().setUser(currentUser.uid);
            setUserDataLoaded(true);
            setLoading(false)
            setProfileImage(MainUser.getInstance().picture)
        }
        else{
            setUserDataLoaded(true);
            setLoading(false)
        }
    }

    useEffect(() => {
        let query = location.search.split('?')[1]
        if (query == "success"){
            setShowSuccessAlert(true)
        }

        userLoaded()
    },[]); 

    const deleteAccount = () => {
        confirmAlert({
          title: "Confirm",
          message: "Are you sure you want to delete your account?",
          buttons: [
            {
              label: "Yes",
              onClick: () => deleteConfirmed()
            },
            {
              label: "No"
              // onClick: () => alert("Click No")
            }
          ]
        });
      };

      const goHome = () =>{ 
        history.push('/')
      }

    const deleteConfirmed = () => {
        setLoading(true)
        setLoadingText("Loading")

        const accountData = {
            userID: MainUser.getInstance().userID,
        };

        const callableReturnMessage = firebase.functions().httpsCallable('deleteUser');
        callableReturnMessage(accountData).then((result) => {
            setLoading(false)
            goHome()
          }).catch((error) => {
              showErrorAlert()
              setLoadingText("Loading")
              setLoading(false)
            console.log(`error: ${JSON.stringify(error)}`);
          });
    }


    return (
        <div>
            <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Change Profile Picture</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input type="file" onChange={newImageUploaded}></input>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
            <Button variant="primary" onClick={handleUpload}>
                Upload
            </Button>
            </Modal.Footer>
            </Modal>

            <Modal show={showUsernameModal} onHide={handleUsernameClose}>
            <Modal.Header closeButton>
            <Modal.Title>Change Username</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                {usernameLoading ? <ReactSpinner/> : <div></div>}
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleUsernameClose}>
                Cancel
            </Button>
            <Button variant="primary" onClick={handleUsernameChange}>
                Change
            </Button>
            </Modal.Footer>
            </Modal>

            <LoadingOverlay
                active={loading}
                spinner
                text={loadingText}>
                <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <Row>
                        <Col md="auto">
                            <Sidebar></Sidebar>
                        </Col>

                        <Col>
                            <Row style={{ paddingTop: 20, paddingRight: 20}}>   
                                <h1 className = "homeh2" >Your Account</h1>
                            </Row>
                            <Alert show={showSuccessAlert} variant={'success'}>
                                Changes successfully saved <Alert.Link onClick={() => removeAlert()} >Remove</Alert.Link>
                            </Alert>
                            <Alert show={error!=""} variant={'error'}>
                                Error: {error} <Alert.Link onClick={() => removeAlert()} >Remove</Alert.Link>
                            </Alert>
                            <Row style={{ paddingTop: 20, paddingRight: 20}}>
                                <Col md="auto">
                                    <Row>
                                        <Avatar round = {true} name={MainUser.getInstance().getFullName()} src={profileImage}/>
                                    </Row> 
                                    <Row style={{paddingTop: 20}}>
                                    <Button variant="primary" onClick={handleShow}>
                                        Change Image
                                    </Button>
                                    </Row>
                                    <Row style={{paddingTop: 20}}>
                                    <Button variant="primary" onClick={handleUsernameShow}>
                                        Change Username
                                    </Button>
                                    </Row>
                                </Col>
                                <Col md="auto" style={{paddingRight: 20}}>
                                    <Row style={{paddingRight: 20}}>
                                        <h3>{MainUser.getInstance().getFullName()}</h3>
                                    </Row>
                                    <Row style={{paddingRight: 20}}>
                                        <h4>{MainUser.getInstance().username}</h4>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{paddingTop: 20, paddingBottom: 20}}>
                                <Button variant="primary" onClick={handleSave}>
                                    Save
                                </Button>
                            </Row> 
                            <hr/>
                            <Row style={{paddingTop: 20}}>
                                <Button variant="danger" onClick={deleteAccount}>
                                    Delete Account
                                </Button>
                            </Row> 
                        </Col>
                    </Row>
                </Container>
            </LoadingOverlay>
        </div>
    )
}
