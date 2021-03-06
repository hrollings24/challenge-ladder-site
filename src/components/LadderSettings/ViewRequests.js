import React from 'react'
import LadderUserDisplayer from './LadderUserDisplayer'

export default function ViewRequests({ladder, setLoading, setSuccess, setError}) {

    if (ladder.permission == "Open"){
        return (
            <div>
                Your Ladder is set to open. To enable requests, change the permission settings.
            </div>
        )
    }

    if (ladder.permission == "Invitation" || ladder.permission == "Invitation by Admins Only"){
        return (
            <div>
                Your Ladder is set to invitation only. To enable requests, change the permission settings.
            </div>
        )
    }

    if (ladder.requests.length == 0){
        return (
            <div>
                You have no requests
            </div>
        )
    }

    return (
        <div>
            <LadderUserDisplayer ladderUserIds={ladder.requests} type={"request"} setLoading={setLoading} ladder={ladder} setSuccess={setSuccess} setError={setError}></LadderUserDisplayer>
        </div>
    )
}
