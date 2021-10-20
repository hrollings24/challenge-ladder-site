import React, { useState, useEffect } from "react"
import MainUser from "../../Persistance/MainUser"
import { Container, Row, Col, Alert } from "react-bootstrap"
import { confirmAlert } from "react-confirm-alert"
import Ladder from "../../Persistance/Ladder"
import firebase from 'firebase/app'
import '@firebase/storage'
import { useHistory } from "react-router-dom";

export default function RequiredAcceptanceView({challenge, setSuccess, setError, setLoading}) {
    const [winnerUser, setWinnerUser] = useState(true)
    const [loserUser, setLoserUser] = useState(true)
    let history = useHistory();


    const confirmWinnerAction = async () => {
        setLoading(true)

        console.log(winnerUser)
        const db = firebase.firestore();

        //get ladder
        let newLadder = new Ladder();
        await newLadder.loadLadder(db.collection("ladders").doc(challenge.ladder))

        let winnerPos = newLadder.positions.indexOf(winnerUser.userID)
        let loserPos = newLadder.positions.indexOf(loserUser.userID)
        
        if (winnerPos > loserPos){
            newLadder.positions.splice(winnerPos, 1);
            newLadder.positions.splice(loserPos, 1);
            newLadder.positions.splice(loserPos, 0, winnerUser.userID);
            newLadder.positions.splice(loserPos+1, 0, loserUser.userID);
            newLadder.reference.update({"positions" : newLadder.positions})
        }


        const callableReturnMessage = firebase.functions().httpsCallable('deleteChallenge');
        callableReturnMessage(challenge.id).then((result) => {
            MainUser.getInstance().refresh().then(() => {
                setLoading(false)
                successConfirmed()
            })
          }).catch((error) => {
            setError(`error: ${JSON.stringify(error)}`)
              setLoading(false)
            console.log(`error: ${JSON.stringify(error)}`);
          });

    }

    const denyWinnerAction = () => {
        setLoading(true)
        challenge.removeWinners()
         //refresh challenge view
         challenge.refresh().then(() => {
            setLoading(false)
        })
    }

    const denyWinner = () => {
        confirmAlert({
          title: "Confirm",
          message: "Confirm you want to deny the result of this challenge",
          buttons: [
            {
              label: "Yes",
              onClick: () => denyWinnerAction()
            },
            {
              label: "No"
              // onClick: () => alert("Click No")
            }
          ]
        });
      };

      const confirmWinner = () => {
        confirmAlert({
          title: "Confirm",
          message: "Confirm that " + winnerUser.username + " has won the challenge",
          buttons: [
            {
              label: "Yes",
              onClick: () => confirmWinnerAction()
            },
            {
              label: "No"
              // onClick: () => alert("Click No")
            }
          ]
        });
      };

      const successConfirmed = () => {
        confirmAlert({
          title: "Success",
          message: "The challenge was completed",
          buttons: [
            {
              label: "Close",
              onClick: () => history.goBack()
            },
          ]
        });
      };

    useEffect(() => {
        console.log(challenge)
        if (challenge.winner == challenge.userToChallenge.userID){
            setWinnerUser(challenge.userToChallenge)
            setLoserUser(MainUser.getInstance())

        }
        else{
            setWinnerUser(MainUser.getInstance())
            setLoserUser(challenge.userToChallenge)
        }
        
    },[]); 

  
    return (
        <div>
            <Row>
                Confirm that {winnerUser.firstName} has won the challenge
            </Row>
            <Row>
                <p onClick={() => confirmWinner()}>Confirm</p>
            </Row>
            <Row>
                <p onClick={() => denyWinner()}>Deny</p>
            </Row>
        </div>
    )

    
}
