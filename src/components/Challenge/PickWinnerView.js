import React from 'react'
import { confirmAlert } from 'react-confirm-alert';
import Challenge from '../../Persistance/Challenge'
import MainUser from '../../Persistance/MainUser'

export default function PickWinnerView({challenge, setSuccess, setError, setLoading}) {

    const confirmChallenge = (user) => {
        var username = user.username

        confirmAlert({
          title: "Confirm",
          message: "Confirm that " + username + " has won the challenge",
          buttons: [
            {
              label: "Yes",
              onClick: () => confirmChallengeWin(user)
            },
            {
              label: "No"
              // onClick: () => alert("Click No")
            }
          ]
        });
      };

    const confirmChallengeWin = (user) => {
        setLoading(true)
        challenge.setWinner(user.userID)

        //refresh challenge view
        challenge.refresh().then(() => {
            setLoading(false)
        })
    }

    return (
        <div>
            <h4>Pick winner</h4>
            <p onClick={() => confirmChallenge(challenge.userToChallenge)}>{challenge.userToChallenge.username}</p>
            <p onClick={() => confirmChallenge(MainUser.getInstance())}>{MainUser.getInstance().username}</p>
        </div>
    )
}
