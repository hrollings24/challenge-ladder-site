import React from 'react'
import AwaitingResponseView from './AwaitingResponseView'

export default function ChallengeActionView({challenge, notification}) {
    
    if (challenge.status == "Awaiting Response"){
        return (
            <div>
                <AwaitingResponseView challenge={challenge} notification={notification}></AwaitingResponseView>
            </div>
        )
    }

    return (
        <div>
            
        </div>
    )

}
