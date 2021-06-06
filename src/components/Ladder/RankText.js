import React from 'react'
import { useHistory } from "react-router-dom"
import MainUser from "../../Persistance/MainUser"
import firebase from 'firebase/app';
require("firebase/functions")

export default function RankText({ userandladder, loading, setLoading, setSuccess, setError}) {
    const history = useHistory()
    const ladderuser = userandladder[0]
    const ladder = userandladder[1]

    const challengeref = ladder.challengesIHaveWithOtherUserIds.get(ladderuser.userID)

    const goHome = () =>{ 
        history.push({
            pathname: '/',
            search: '?success',
          }) 
    }

    const showAlert = () =>{ 
        history.push({
            search: '?success',
          }) 
    }

    const routeChange = (challengeref) =>{ 
        history.push({
            pathname: '/challenge',
            search: '?query=' + challengeref,
          }) 
    }

    const startChallenge = async () =>{ 
        console.log("start challenge clicked")
        setLoading(true)
        //data = [toUser, fromUser, ladderID, message, ladderName]
        const challengeData = {
            ladderID: ladder.id,
            toUser: ladderuser.userID,
            fromUser: MainUser.getInstance().userID,
            message: MainUser.getInstance().username + " has challenged you in " + ladder.name,
            ladderName: ladder.name
        };

        const callableReturnMessage = firebase.functions().httpsCallable('createChallenge');
        callableReturnMessage(challengeData).then((result) => {
            if (result.data.title != 'Error'){
                //refresh ladder
                MainUser.getInstance().refresh().then(() => {
                    setSuccess(result.data.message)
                    ladder.loadAfterUserLoaded().then(() => {
                        setLoading(false)
                    })
                }).catch((error) => {
                    console.log(`error: ${JSON.stringify(error)}`);
                    setLoading(false)
                    });  
            }
            else{
                setError(result.data.message)
                setLoading(false)
            }
        }).catch((error) => {
          console.log(`error: ${JSON.stringify(error)}`);
          setError(error)
          setLoading(false)
        });

    }

    const withdraw = async () => {

        setLoading(true)
        const amIAdmin = ladder.adminIDs.includes(MainUser.getInstance().userID)
        const withdrawData = {
            ladderID: ladder.id,
            userID: MainUser.getInstance().userID,
            isAdmin: amIAdmin
        };

        const callableReturnMessage = firebase.functions().httpsCallable('withdrawUserFromLadder');

        callableReturnMessage(withdrawData).then((result) => {
            console.log(result.data);
            if(amIAdmin){
                MainUser.getInstance().refresh().then(() => {
                    setSuccess("Withdrawn from Ladder")
                    setLoading(false)
                }).catch((error) => {
                    console.log(`error: ${JSON.stringify(error)}`);
                    setLoading(false)
                    });
            }
            else{
                MainUser.getInstance().refresh().then(() => {
                    showAlert()
                    setLoading(false)
                    goHome()
                }).catch((error) => {
                    console.log(`error: ${JSON.stringify(error)}`);
                    setLoading(false)
                    });
            }
        }).catch((error) => {
          console.log(`error: ${JSON.stringify(error)}`);
          setLoading(false)
        });
    }

    if (ladderuser.isMyself){
        return (
            <h3 onClick={() => withdraw()} style={{cursor: "pointer"}} >Withdraw from Ladder</h3>
        )
    }

    if (ladder.challengesIHaveWithOtherUserIds.get(ladderuser.userID) != undefined){
        console.log(challengeref.challengedataref)
        return (
            <h3 onClick={() => routeChange(challengeref.challengedataref)} style={{cursor: "pointer"}} >View Challenge</h3>
        )
    }



    if ((ladderuser.position < ladder.myPosition) && (ladderuser.position >= ladder.myPosition-ladder.jump)){
        return (
            <h3 onClick={() => startChallenge()} style={{cursor: "pointer"}} >Start a challenge</h3>
        )
    }


    return (
        <h3>You cannot challenge this player</h3>
    )
}
