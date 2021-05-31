import React from 'react';
import MainUser from "../../Persistance/MainUser"
import './Home.css';

function ChallengeAwaitingView() {

    if (MainUser.getInstance().getChallenges().length == 1){
        return (
            <h2>You have 1 ongoing challenge</h2>
        );
    }
  return (
    <h2>You have {MainUser.getInstance().getChallenges().length} ongoing challenges</h2>
  );
}

export default ChallengeAwaitingView;