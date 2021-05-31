import firebase from 'firebase/app';
import 'firebase/firestore';

export default class User{
    userID = "";
    firstName = "";
    surname = "";
    username = "";
    picture = ""

    getFullName(){
        return this.firstName + " " + this.surname
    }

    getUserID(){
        return this.userID
    }

    getReference(){
        const db = firebase.firestore();
        return db.collection('users').doc(this.userID)
    }
}