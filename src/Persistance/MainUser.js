import firebase from 'firebase/app';
import 'firebase/firestore';
import Ladder from './Ladder.js'
import Challenge from './Challenge.js'
import User from './User.js'
import SystemNotification from './SystemNotification.js'

export default class MainUser extends User{

    static myInstance = null;

   
    challengeRefList = [];
    challenges = [];
    ladderRefs = [];
    ladders = [];
    listOfChallenges = [];
    listOfNotes = [];
    ref = ""

    static getInstance() {
        if (MainUser.myInstance == null) {
            MainUser.myInstance = new MainUser();
        }
        return this.myInstance;
    }

    async setUser(userIDparam){
        this.userID = userIDparam
        const db = firebase.firestore();
        let userRef = db.collection('users').doc(userIDparam)
        let user = await userRef.get();
        this.ref = userRef
        this.challengeRefList = user.data().challenges;
        this.firstName = user.data().firstName;
        this.surname = user.data().surname;
        this.ladderRefs = user.data().ladders;
        this.picture = user.data().picture;
        this.username = user.data().username;
        await this.addLadders();
        await this.loadChallenges();
        await this.getNotes()
    }

    async getNotes(){
        this.listOfNotes = await this.getNotifications();
    }

    getChallenges(){
        return this.challenges
    }

    getLadderReferences(){
        return this.ladderRefs
    }

    async addLadders(){
        for (const ref of this.ladderRefs){
            let newLadder = new Ladder();
            await newLadder.loadLadder(ref)
            this.ladders.push(newLadder)
        };
    }

    getLadders(){
        return this.ladders
    }

    getFirstName(){
        return this.firstName
    }

    async loadChallenges(){
        for (const challengeRef of this.challengeRefList){
            let challenge = new Challenge();
            await challenge.load(challengeRef)
            this.listOfChallenges.push(challenge)
        };
    }

    getChallenges(){
        return this.listOfChallenges
    }

    async getNotifications(){

        var listOfNotes = []

        const db = firebase.firestore();
        const refToSearch = db.collection('users').doc(this.userID)
        let noteReferences = await db.collection('notifications').where('toUser', '==', refToSearch).get();
        
        noteReferences.forEach(function(note) {
            const data = note.data()
            let noteAsNote = new SystemNotification()
            noteAsNote.load(data, note.id)
            listOfNotes.push(noteAsNote)
        }, this);

        return listOfNotes

    }

  

}

