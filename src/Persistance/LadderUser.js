import firebase from 'firebase/app';
import 'firebase/firestore';
import User from './User.js'
import MainUser from './MainUser.js'


export default class LadderUser extends User{

    position = 0
    isMyself = false

    async load(withID){
        const db = firebase.firestore();
        let userRef = db.collection('users').doc(withID)

        let loaded = await userRef.get();
        this.firstName = loaded.data().firstName
        this.surname = loaded.data().surname
        this.userID = withID
        this.username = loaded.data().username
        this.picture = loaded.data().picture

    }

    async loadWithPosition(withID, positionNumber){
        this.position = positionNumber
        await this.load(withID)
        if (withID == MainUser.getInstance().userID){
            this.isMyself = true
            return true
        }
        return false
    }

}