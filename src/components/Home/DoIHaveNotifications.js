import React from 'react'
import MainUser from "../../Persistance/MainUser"
import './Home.css'
import { useHistory } from "react-router-dom"


export default function DoIHaveNotifications() {
    const history = useHistory()


    const routeChange = () =>{ 
        history.push("/notifications");
    }

    if (MainUser.getInstance().listOfNotes.length > 1){
        return (
            <div>
            <strong style={{fontSize: 20}}className="marginLeft">You have {MainUser.getInstance().listOfNotes.length} notifications</strong><text onClick={routeChange} style={{fontSize: 20}}> View Here</text>
            </div>
        )
    }

    if (MainUser.getInstance().listOfNotes.length == 1){
        return (
            <div>
                <strong>You have {MainUser.getInstance().listOfNotes.length} notification</strong><text onClick={routeChange}> View Here</text>
            </div>
        )
    }

    return (
           <div className="marginLeft">You have no notifications</div>
        )

}
