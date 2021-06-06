import firebase from 'firebase/app';
import 'firebase/firestore';
import MainUser from "./MainUser"
import LadderUser from "./LadderUser"

export default class Ladder{

    reference = "";
    name = "";
    positions = [];
    jump = 0;
    permission = "";
    requests = [];
    challengesIHaveWithOtherUserIds = new Map();
    adminIDs = [];
    id = ""
    description = ""
    positionsAsLoadedUsers = []
    myPosition = -1
    url = ""

    async loadLadder(withref){
        this.id = withref.id
        this.reference = withref
        let ladder = await withref.get();
        
        this.name = ladder.data().name;
        this.positions = ladder.data().positions;
        this.jump = ladder.data().jump;
        this.permission = ladder.data().permission;
        this.requests = ladder.data().positions;
        this.adminIDs = ladder.data().admins;
        this.description = ladder.data().description;
        this.url = ladder.data().url

        await this.loadAfterUserLoaded()

    }

    async load(withData, withRef){
        this.id = withRef.id
        this.reference = withRef
        
        this.name = withData.name;
        this.positions = withData.positions;
        this.jump = withData.jump;
        this.permission = withData.permission;
        this.requests = withData.positions;
        this.adminIDs = withData.admins;
        this.description = withData.description;
        this.url = withData.url


           
    }

    async loadAfterUserLoaded(){

            this.positionsAsLoadedUsers = []
            this.challengesIHaveWithOtherUserIds.clear()
            var count = 1
            for (const position of this.positions){
                let ladUser = new LadderUser()
                let isMe = await ladUser.loadWithPosition(position, count)
                if (isMe){
                    this.myPosition = count
                }
                this.positionsAsLoadedUsers.push(ladUser)
                count++
            }    

            const db = firebase.firestore();
            const challengeCollection = db.collection('challenge');
    
            const findingChallenges = await challengeCollection.where('user1', '==', MainUser.getInstance().getUserID()).where('ladder', '==', this.id).get();        
            findingChallenges.forEach(function(challenge) {
                const challengedataref = challenge.ref.id
                this.challengesIHaveWithOtherUserIds.set(challenge.data().user2, {challengedataref});
            }, this);
        
            const findingChallenges2 = await challengeCollection.where('user2', '==', MainUser.getInstance().getUserID()).where('ladder', '==', this.id).get();
            findingChallenges2.forEach(function(challenge) {
                const challengedataref = challenge.ref.id
                this.challengesIHaveWithOtherUserIds.set(challenge.data().user1, {challengedataref});
            }, this);
    
    
            return this.challengesIHsaveWithOtherUserIds
        

    }

    refresh(){

    }

}