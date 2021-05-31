import firebase from 'firebase/app';
import 'firebase/firestore';
import MainUser from "./MainUser"
import LadderUser from "./LadderUser"


export default class SystemNotification{

    fromUserRef = ""
    message = ""
    type = ""
    title = ""
    ladderRef = ""
    id = ""

    constructor(){}

    async load(data, noteID){
        this.id = noteID
        this.fromUserRef = data.fromUser
        this.message = data.message
        this.type = data.type
        this.title = data.title
        this.ladderRef = data.ladder
    }

    delete(){
        const db = firebase.firestore();
        const ref = db.collection('notifications').doc(this.id)
        ref.delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

}