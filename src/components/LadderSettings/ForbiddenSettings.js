import React from 'react'
import '../Ladder/Ladder.css'

export default function ForbiddenSettings() {
    return (
        <div>
            <h1 className = "h1-ladder">Forbidden</h1>
            <p className = "p-ladder-margin">You are not an admin of this ladder</p>
        </div>
    )
}
