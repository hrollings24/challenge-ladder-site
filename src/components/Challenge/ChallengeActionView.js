import React from 'react'
import MainUser from '../../Persistance/MainUser'
import PickWinnerView from './PickWinnerView'
import AwaitingResponseView from './AwaitingResponseView'
import RequiredAcceptanceView from './RequiredAcceptanceView'


export default function ChallengeActionView({challenge, setSuccess, setError, setLoading}) {
    
    console.log(challenge)
    if (challenge.status == "Awaiting Response"){
        return (
            <div>
                <AwaitingResponseView challenge={challenge} setSuccess={setSuccess} setError={setError} setLoading={setLoading}></AwaitingResponseView>
            </div>
        )
    }

    if (challenge.status == "ongoing" && challenge.winner == ""){
        return (
            <div>
                <PickWinnerView challenge={challenge} setSuccess={setSuccess} setError={setError} setLoading={setLoading}></PickWinnerView>
            </div>
        )
    }

    if (challenge.status == "ongoing" && challenge.winnerSelectedBy == MainUser.getInstance().userID){
        return (
            <div>
                Awaiting response from the other user
            </div>
        )
    }

    if (challenge.status == "ongoing" && challenge.winnerSelectedBy != MainUser.getInstance().userID){
        return (
            <div>
                <RequiredAcceptanceView challenge={challenge} setSuccess={setSuccess} setError={setError} setLoading={setLoading}></RequiredAcceptanceView>
            </div>
        )
    }

    return (
        <div>
            
        </div>
    )

}
