import React, { useEffect }from 'react'
import { Card, Row, Col, Container} from "react-bootstrap"
import MainUser from "../../Persistance/MainUser"
import SystemNotification from "../../Persistance/SystemNotification"
import firebase from 'firebase/app';
import 'firebase/firestore';


export default function NotificationCards() {
   

    const renderCards = (notification) => {
        console.log(notification.title)

        
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
                        <Card.Link href="#">Accept</Card.Link>
                        <Card.Link href="#">Decline</Card.Link>
                    </div>
                )
            case 'invite':
                return (
                    <div>
                        <Card.Link onClick={acceptNormalInvite(notification)}>Accept</Card.Link>
                        <Card.Link href="#">Decline</Card.Link>
                    </div>
                )
            case 'admin':
                return (
                    <div>
                        <Card.Link href="#">Accept</Card.Link>
                        <Card.Link href="#">Decline</Card.Link>
                    </div>
                )
            case 'request':
                return (
                    <div>
                        <Card.Link href="#">Go To Request</Card.Link>
                    </div>
                )
            case 'challengeSelected':
                return (
                    <div>
                        <Card.Link href="#">View Challenge</Card.Link>
                        <Card.Link href="#">OK</Card.Link>
                    </div>
                )    
            default:
                return (
                    <div>
                        <Card.Link href="#">OK</Card.Link>
                    </div>
                )
                
        }
    }




    //Button functions

    const declineAdminInvite = (notification) => {
        //data = [oldNoteID: String, oldnoteToUser: String, oldNoteFromUser: String, ladderRef: String, username: String]
        const data = {
            oldNoteID: notification.id,
            oldnoteToUser: MainUser.getInstance().userID,
            oldNoteFromUser: notification.fromUser.id,
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
            oldNoteFromUser: notification.fromUser.id,
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
        
        const data = {
            fromUserID: MainUser.getInstance().userID,
            ladderID: notification.ladderRef.id,
            notificationID: notification.id,
            username: MainUser.getInstance().username,
            toUserID: notification.fromUser.id,
        };

        const callableReturnMessage = firebase.functions().httpsCallable('acceptAdminInvite');

        callableReturnMessage().then((result) => {
          console.log(result.data.output);
        }).catch((error) => {
          console.log(`error: ${JSON.stringify(error)}`);
        });

    }

    const acceptNormalInvite = (note) => {
        console.log(note)
        note.ladderRef.update({
            positions: firebase.firestore.FieldValue.arrayUnion(MainUser.getInstance().userID)
        })
       
        MainUser.getInstance().ref.update({
            ladders: firebase.firestore.FieldValue.arrayUnion(note.ladderRef)
        });
        removeNote(note)
    }


    const removeNote = (notification) => {
        notification.delete()
    }






    return (
        <div className="container-fluid py-2">
            <div className="d-flex flex-row flex-nowrap">
                <Container>
                    <Row>
                        {MainUser.getInstance().listOfNotes.map(renderCards)}
                  </Row>
                </Container>
            </div>
        </div>
    )
}
