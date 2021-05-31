import firebase from 'firebase/app';
import 'firebase/firestore';
import MainUser from "./MainUser"
import LadderUser from "./LadderUser"


export default class Challenge{

    userToChallenge = new LadderUser()
    ladder = ""
    ladderName = ""
    status = ""
    user1 = ""
    user2 = ""
    winner = ""
    winnerSelectedBy = ""
    id = ""

    async load(withReference){
        let getChallenge = await withReference.get();
        this.id = withReference.id
        let data = getChallenge.data()
        this.ladder = data.ladder
        this.ladderName = data.ladderName
        this.status = data.status
        this.user1 = data.user1
        this.user2 = data.user2
        this.winner = data.winner
        this.winnerSelectedBy = data.winnerSelectedBy
        if (MainUser.getInstance().userID == data.user1){
            await this.userToChallenge.load(data.user2)
        }
        else{
            await this.userToChallenge.load(data.user1)
        }


    }

    getUserToChallengeName(){
        return this.getUserToChallengeName
    }

}