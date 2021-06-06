import React from 'react'

export default function SettingsPage(ladderParam) {
    let ladder = ladderParam.ladder
    return (
        <div>
            <h1>{ladder.name}</h1>
        </div>
    )
}
