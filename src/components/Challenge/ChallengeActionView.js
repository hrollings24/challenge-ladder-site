import React from 'react'
import AwaitingResponseView from './AwaitingResponseView'

export default function ChallengeActionView({challenge, setSuccess, setError, setLoading}) {
    
    if (challenge.status == "Awaiting Response"){
        return (
            <div>
                <AwaitingResponseView challenge={challenge} setSuccess={setSuccess} setError={setError} setLoading={setLoading}></AwaitingResponseView>
            </div>
        )
    }

    return (
        <div>
            
        </div>
    )

}
