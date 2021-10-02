import React from 'react'
import ViewInvites from './ViewInvites'

export default function InviteSettings({ladder, setLoading}) {
    return (
        <div style={{paddingTop:20, paddingLeft: 10}}>
            <h3>Invites</h3>
            <ViewInvites ladder={ladder} setLoading={setLoading}></ViewInvites>
        </div>
    )
}
