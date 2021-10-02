import React, { useState, useEffect }from 'react'
import { Container, Row, Col, Alert } from "react-bootstrap"
import Avatar from 'react-avatar';
import Ladder from "../../Persistance/Ladder"
import LadderUser from "../../Persistance/LadderUser"
import LoadingOverlay from 'react-loading-overlay';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import MainUser from "../../Persistance/MainUser"
import firebase from 'firebase/app';
import { useHistory } from "react-router-dom"

require("firebase/functions")


export default function LadderUserDisplayer({ladderUserIds, type, ladder, setLoading, setError, setLadder}) {
    const [userDataLoaded, setUserDataLoaded] = useState(false)
    const [ladderUsers, setLadderUsers] = useState([])
    const history = useHistory()


    useEffect(() => {
        startLoad()
    },[]); 

    useEffect(() => {
        if (ladderUsers.length == ladderUserIds.length){
            setUserDataLoaded(true)
        }
    },[ladderUsers]); 

    function startLoad(){
        console.log(ladderUserIds)
        setLadderUsers([])
        ladderUserIds.map(loadUser)
    }

    const loadUser = (ladderUserId) => {
        var userLadder = new LadderUser()
        userLadder.load(ladderUserId).then(() => {
            setLadderUsers( arr => [...arr, userLadder]);
        }).catch((error) => {
            console.error("Error getting user: ", error);
        });
    }

    function removeUser(ladderUser){
        switch (type){
            case "admin":
                deleteAdmin(ladderUser)
                break
            case "user":
                deleteUser(ladderUser)
                break
            case "invite":
                removeInvite(ladderUser)
                break
        }

    }


    const removeInvite = async (ladderUser) =>{
        setLoading(true)

        const db = firebase.firestore();
        const noteRef = db.collection('notifications')
        const ladderRef = db.collection('ladders').doc(ladder.id)
        const userRef = db.collection('users').doc(ladderUser.userID)

        const snapshot = await noteRef.where('type', '==', 'invite').where('ladder', '==', ladderRef).where('toUser', '==', userRef).get()
        
        if (snapshot.empty) {
            console.log('No matching documents.');
            return;
        } 
        else{
            snapshot.forEach(doc => {
                doc.ref.delete().then((result) => {
                    ladder.refresh().then(() => {
                        setLoading(false)                
                    })
                })
            })
        }
        setLoading(false)
    }


    const deleteUser = (ladderUser) => {
        console.log(ladderUser.getFullName())

        setLoading(true)
        const data = {
            userIDToDelete: ladderUser.userID,
            ladderID: ladder.id,
            message: "You have been removed from " + ladder.name + " by an admin",
            type: "message",
            fromUser: MainUser.getInstance().userID,
            isAdmin: ladder.adminIDs.includes(MainUser.getInstance().userID)
        };

        const callableReturnMessage = firebase.functions().httpsCallable('deleteUserFromAdmin');

        callableReturnMessage(data).then((result) => {
            ladder.refresh().then(() => {
                setLoading(false)                
            })
            
        }).catch((error) => {
            setLoading(false)
            setError(error)
        });
        
    }  

    const deleteAdmin = (ladderUser) => {
        console.log(ladderUser.getFullName())

        try{
            deleteAdminFromLadder(ladderUser)
        }
        catch (error){
            setError(error)
        }
        
    }

    function deleteAdminFromLadder(ladderUser){
        if (ladderUser.userID == MainUser.getInstance().userID){
            if (ladder.adminIDs.length == 1){
                if (ladder.positions.length == 0){
                    //delete ladder
                    deleteLadder()
                }
                else{
                    throw "You must add another admin before you can remove yourself"
                }
            }
            else{
                //remove admin (admin is themselves - go back to ladder page)
                //admin is not themselves - remove the admin!
                setLoading(true)
                ladder.removeAdmin(ladderUser.userID).then(() => {
                    ladder.refresh().then(() => {
                        console.log(ladder.adminIDs)
                        //GO BACK
                        setLoading(false)
                        history.goBack()
                        
                    })
                }).catch((error) => {
                    setLoading(false)
                    setError("An Internal error occured")
                });
            }
        }
        else{
            //admin is not themselves - remove the admin!
            setLoading(true)
            ladder.removeAdmin(ladderUser.userID).then(() => {
                ladder.refresh().then(() => {
                    console.log(ladder.adminIDs)
                    startLoad()
                    setLoading(false)
                })
            }).catch((error) => {
                setLoading(false)
                setError("An Internal error occured")
            });
        }
    }


    const deleteLadder = () => {
        setLoading(true)
        const data = {
            ladderID: ladder.id,
        };

        const callableReturnMessage = firebase.functions().httpsCallable('deleteLadder');

        callableReturnMessage(data).then((result) => {
            MainUser.getInstance().refresh().then(() => {
                setLoading(false)
                history.push('/')
            }).catch((error) => {
                console.log(`error: ${JSON.stringify(error)}`);
                setLoading(false)
                });  

        }).catch((error) => {
            setLoading(false)
            setError(error)
        });
    }



    const renderRank = (ladderUser) => {
        return (
            <Container key={ladderUser.userID}>
                <Row md="auto">
                    <Col md="auto">
                        <Avatar round = {true} name={ladderUser.getFullName()} src={ladderUser.picture}/>
                    </Col>

                    <Col className="container-fluid mt-2">
                
                        <Row className = "rankText">
                            <Col className="container-fluid mt-2">
                                <h3>{ladderUser.getFullName()}</h3>
                                <h4>{ladderUser.username}</h4>
                            </Col>
                            <Col className="container-fluid mt-2">
                                {type == "invite" ?
                                <div><h4 onClick={() => submit(ladderUser)}>Delete</h4>
                                </div> : 
                                <div><h4 onClick={() => submit(ladderUser)}>Remove</h4>
                                </div>
                                }
                            </Col>
                        </Row>  
                    </Col>
                </Row>

            </Container>    
        )
    }


    const submit = (ladderUser) => {
        confirmAlert({
          title: "Confirm",
          message: "Are you sure you want to remove this " + type + "?",
          buttons: [
            {
              label: "Yes",
              onClick: () => removeUser(ladderUser)
            },
            {
              label: "No"
              // onClick: () => alert("Click No")
            }
          ]
        });
      };

    return (
        <div>
             <LoadingOverlay
                active={!userDataLoaded}
                spinner
                text={"Loading"}>
                    {ladderUsers.map(renderRank)}  
                </LoadingOverlay>
            
        </div>
    )
}
