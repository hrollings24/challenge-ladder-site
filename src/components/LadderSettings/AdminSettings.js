import React, {useState} from 'react'
import LadderUserDisplayer from './LadderUserDisplayer'
import UserSearch from '../PopupModal/UserSearch'
import { Container, Row, Col, Alert } from "react-bootstrap"
import LoadingOverlay from 'react-loading-overlay';


export default function AdminSettings({ladder, setError, setLoading}) {
    const [showSearch, setShowSearch] = useState(false)


    const addAdminClicked = () => {
        setShowSearch(true)
    }


    return (

        <div style={{paddingTop:20, paddingLeft: 10}}>
            <UserSearch showSearch={showSearch} setShowSearch={setShowSearch} ladderData={ladder} purpose={"admin"}></UserSearch>   
             <h3>Current Admins</h3>
            <p onClick={addAdminClicked}>Add New Admin</p>
            <LadderUserDisplayer ladderUserIds={ladder.adminIDs} type={"admin"} ladder={ladder} setLoading={setLoading} setError={setError}></LadderUserDisplayer>
        </div>
    )
}
