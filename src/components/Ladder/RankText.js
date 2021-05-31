import React from 'react'
import { useHistory } from "react-router-dom"
import MainUser from "../../Persistance/MainUser"
import firebase from 'firebase/app';
require("firebase/functions")

export default function RankText({ userandladder }) {
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

    const startChallenge = () =>{ 
        console.log("start challenge clicked")
        
    }

    const withdraw = () =>{ 

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
            showAlert()
          }
          else{
            goHome()
          }
        }).catch((error) => {
          console.log(`error: ${JSON.stringify(error)}`);
        });


    }

    if (ladderuser.isMyself){
        return (
            <h3 onClick={() => withdraw()}>Withdraw from Ladder</h3>
        )
    }

    if (ladder.challengesIHaveWithOtherUserIds.get(ladderuser.userID) != undefined){
        console.log(challengeref.challengedataref)
        return (
            <h3 onClick={() => routeChange(challengeref.challengedataref)}>View Challenge</h3>
        )
    }



    if ((ladderuser.position < ladder.myPosition) && (ladderuser.position >= ladder.myPosition-ladder.jump)){
        return (
            <h3 onClick={() => startChallenge()} >Start a challenge</h3>
        )
    }


    return (
        <h3>You cannot challenge this player</h3>
    )
}
