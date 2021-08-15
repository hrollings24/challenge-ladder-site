import React, {useState} from 'react'
import LadderUserDisplayer from './LadderUserDisplayer'
import UserSearch from '../PopupModal/UserSearch'

export default function AdminSettings(ladderParam) {
    let ladder = ladderParam.ladderParam
    const [showSearch, setShowSearch] = useState(false)

    const addAdminClicked = () => {
        setShowSearch(true)
    }

    return (
        <div style={{paddingTop:20, paddingLeft: 10}}>
            <UserSearch showSearch={showSearch} setShowSearch={setShowSearch} ladderData={ladder} purpose={"admin"}></UserSearch>   
             <h3>Current Admins</h3>
            <p onClick={addAdminClicked}>Add New Admin</p>
            <LadderUserDisplayer ladderUserIds={ladder.adminIDs}></LadderUserDisplayer>
        </div>
    )
}
