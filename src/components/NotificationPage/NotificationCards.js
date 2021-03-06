import React, { useEffect }from 'react'
import { Card, Row, Col, Container} from "react-bootstrap"
import MainUser from "../../Persistance/MainUser"
import SystemNotification from "../../Persistance/SystemNotification"
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useHistory } from "react-router-dom";


export default function NotificationCards({setProcessingNote, setError, setSuccess}) {
    const history = useHistory();


    const renderCards = (notification) => {
        return (
            <Col className="container-fluid mt-4">
                <Card style={{display: 'flex', flexDirection: 'row'}} key={notification.title}>
                <Card.Body>
                    <Card.Title>{notification.title}</Card.Title>
                    <Card.Text className="d-flex">
                    {notification.message}
                    </Card.Text>
                    {returnButtons(notification)}
                </Card.Body>
                </Card>
            </Col>

        )
    }   

    function returnButtons(notification){
        switch (notification.type){
            case 'message':
                return (
                    <Card.Link onClick={() => removeNote(notification)} >OK</Card.Link>
                )
            case 'challenge':
                return (
                    <div>
                        <Card.Link onClick={() => { acceptChallenge(notification)}}>Accept</Card.Link>
                        <Card.Link onClick={() => { declineChallenge(notification)}}>Decline</Card.Link>
                    </div>
                )
            case 'invite':
                return (
                    <div>
                        <Card.Link onClick={() => { acceptNormalInvite(notification) }}>Accept</Card.Link>
                        <Card.Link onClick={() => { declineNormalInvite(notification) }}>Decline</Card.Link>
                    </div>
                )
            case 'admin':
                return (
                    <div>
                        <Card.Link onClick={() => { acceptAdminInvite(notification) }}>Accept</Card.Link>
                        <Card.Link onClick={() => { declineAdminInvite(notification) }}>Decline</Card.Link>
                    </div>
                )
            case 'request':
                return (
                    <div>
                        <Card.Link onClick={() => gotoRequest(notification)}>Go To Request</Card.Link>
                    </div>
                )
            case 'challengeSelected':
                return (
                    <div>
                        <Card.Link onClick={() => viewChallenge(notification)} >View Challenge</Card.Link>
                        <Card.Link onClick={() => removeNote(notification)} >OK</Card.Link>
                    </div>
                )    
            default:
                return (
                    <div>
                        <Card.Link onClick={() => removeNote(notification)} >OK</Card.Link>
                    </div>
                )
                
        }
    }




    //Button functions

    const viewChallenge = (notification) => {
        history.push("challenge?query=" + notification.challengeRef.id)
    }

    const declineAdminInvite = (notification) => {
        //data = [oldNoteID: String, oldnoteToUser: String, oldNoteFromUser: String, ladderRef: String, username: String]
        const data = {
            oldNoteID: notification.id,
            oldnoteToUser: MainUser.getInstance().userID,
            oldNoteFromUser: notification.fromUserRef.id,
            ladderRef: notification.ladderRef,
            username: MainUser.getInstance().username,
        };

        const callableReturnMessage = firebase.functions().httpsCallable('rejectAdminInvite');

        callableReturnMessage().then((result) => {
          console.log(result.data.output);
        }).catch((error) => {
          console.log(`error: ${JSON.stringify(error)}`);
        });

    }

    const declineNormalInvite = (notification) => {
        //data = [oldNoteID: String, oldnoteToUser: String, oldNoteFromUser: String, ladderRef: String, username: String]
        const data = {
            oldNoteID: notification.id,
            oldnoteToUser: MainUser.getInstance().userID,
            oldNoteFromUser: notification.fromUserRef.id,
            ladderRef: notification.ladderRef,
            username: MainUser.getInstance().username,
        };

        const callableReturnMessage = firebase.functions().httpsCallable('rejectNormalInvite');

        callableReturnMessage().then((result) => {
          console.log(result.data.output);
        }).catch((error) => {
          console.log(`error: ${JSON.stringify(error)}`);
        });

    }

    const acceptAdminInvite = (notification) => {
        console.log(notification)
        setProcessingNote(true)

        const data = {
            fromUserID: MainUser.getInstance().userID,
            ladderID: notification.ladderRef.id,
            notificationID: notification.id,
            username: MainUser.getInstance().username,
            toUserID: notification.fromUserRef.id,
        };

        const callableReturnMessage = firebase.functions().httpsCallable('acceptAdminInvite');

        callableReturnMessage(data).then((result) => {
          console.log(result.data.output);
          setProcessingNote(false)

        }).catch((error) => {
          console.log(`error: ${JSON.stringify(error)}`);
        });

    }

    const acceptNormalInvite = async (note) => {
        console.log("Accepting invite...")
        setProcessingNote(true)
        await note.ladderRef.update({
            positions: firebase.firestore.FieldValue.arrayUnion(MainUser.getInstance().userID)
        })
       
        await MainUser.getInstance().ref.update({
            ladders: firebase.firestore.FieldValue.arrayUnion(note.ladderRef)
        });
        await removeNote(note)
        await MainUser.getInstance().refresh()
        setSuccess("Invite accepted")
        setProcessingNote(false)

    }

    const declineChallenge = (notification) => {
        setProcessingNote(true)

        //data = [toUserID, message, fromUserID, ladderID, challengeID]
        const data = {
            toUserID: notification.fromUserRef.id,
            message: MainUser.getInstance().username + " has declined your challenge",
            fromUserID: MainUser.getInstance().userID,
            ladderID: notification.ladderRef.id,
            challengeID: notification.challengeRef.id
        };

        console.log(data)

        const callableReturnMessage = firebase.functions().httpsCallable('declineChallenge');
        callableReturnMessage(data).then((result) => {
            if (result.data.title == "Success"){
                //change username
                MainUser.getInstance().refresh().then(() => {
                    setProcessingNote(false)
                    setSuccess("Challenge declined")
                })
            }
            else{
                setError(result.data.message)
                setProcessingNote(false)
            }
        }).catch((error) => {
            setError(`error: ${JSON.stringify(error)}`)
            setProcessingNote(false)
          });
    }

    const acceptChallenge = (notification) => {
        setProcessingNote(true)
        //data = [toUserID, message, fromUserID, ladderID, challengeID]
        const data = {
            toUser: notification.fromUserRef.id,
            message: MainUser.getInstance().username + " has accepted your challenge",
            fromUser: MainUser.getInstance().userID,
            ladderID: notification.ladderRef.id,
            challengeID: notification.challengeRef.id
        };

        console.log(data)

        const callableReturnMessage = firebase.functions().httpsCallable('acceptChallenge');
        callableReturnMessage(data).then((result) => {
            if (result.data.title == "Success"){
                MainUser.getInstance().refresh().then(() => {
                    setProcessingNote(false)
                    setSuccess("Challenge accepted")
                })
            }
            else{
                setError(result.data.message)
                setProcessingNote(false)
            }
        }).catch((error) => {
            setError(`error: ${JSON.stringify(error)}`)
            setProcessingNote(false)
        });
    }


    const removeNote = async (notification) => {
        setProcessingNote(true)
        await notification.delete()
        await MainUser.getInstance().refresh()
        setProcessingNote(false)
    }

    const gotoRequest = async (notification) => {
        //Get ladder url
        var ladder = await notification.ladderRef.get();
        history.push("/" + ladder.data().url + "/admin?=requests");
    }

    return (
        <div className="container-fluid py-2">
            <div className="d-flex flex-row flex-nowrap">
                <Container>
                    <Row>
                        {
                            MainUser.getInstance().listOfNotes.length > 0 ?
                            <div>
                                {MainUser.getInstance().listOfNotes.map(renderCards)}
                            </div>:
                            <div>
                                <h3>You have no notifications</h3>
                            </div>
                        }
                    </Row>
                </Container>
            </div>
        </div>
    )
}
