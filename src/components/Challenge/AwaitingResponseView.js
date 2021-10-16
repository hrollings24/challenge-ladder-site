import React from 'react'
import MainUser from '../../Persistance/MainUser'
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useHistory } from "react-router-dom"


export default function AwaitingResponseView({challenge, setSuccess, setError, setLoading}) {
    const history = useHistory()

    const db = firebase.firestore();

    const goHome = () =>{ 
        history.push({
            pathname: '/',
            search: '?success-challenge-decline',
          }) 
    }

    const acceptChallenge = () => {
      
    }

    const declineChallenge = () => {
        setLoading(true)
        //data = [toUserID, message, fromUserID, ladderID, challengeID]
        const data = {
            toUserID: challenge.userToChallenge.userID,
            message: MainUser.getInstance().username + " has declined your challenge",
            fromUserID: MainUser.getInstance().userID,
            ladderID: challenge.ladder,
            challengeID: challenge.id
        };

        console.log(data)

        const callableReturnMessage = firebase.functions().httpsCallable('declineChallenge');
        callableReturnMessage(data).then((result) => {
            if (result.data.title == "Success"){
                //change username
                MainUser.getInstance().refresh().then(() => {
                    setLoading(false)
                    goHome()
                })
            }
            else{
                setError(result.data.message)
                setLoading(false)
            }
        }).catch((error) => {
            setError(`error: ${JSON.stringify(error)}`)
            setLoading(false)
          });
    }

    if (challenge.status == "Awaiting Response" && challenge.userToChallenge.userID == MainUser.getInstance().userID){
        return (
            <div>
                Awaiting a response from the other user
            </div>
        )
    }

    return (
        <div>
            <p>You need to reply to this challenge</p>
            <p onClick={() => acceptChallenge()}>Accept</p>
            <p onClick={() => declineChallenge()}>Decline</p>
        </div>
    )
}
