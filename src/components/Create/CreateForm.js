import React from 'react'
import { TextField } from '@material-ui/core';
import { useForm, Controller } from "react-hook-form";
import { Card, Row, Col, Container, Button} from "react-bootstrap"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MainUser from "../../Persistance/MainUser";
import firebase from 'firebase/app';
import { useHistory, useLocation } from "react-router-dom"


export default function CreateForm({setLoading, setError}) {
    const { handleSubmit, control } = useForm();

    const history = useHistory()

    const routeChange = (ladderurl) =>{ 
        console.log(ladderurl)
            history.push({
                pathname: ladderurl,
            })
    }

    const onSubmit = data => {
        
        //call create ladder
        //data = [permission, name, requests, jump, includeMe, description, currentUserId]
        setLoading(true)

        let dataToSend = {
            permission: data.permission,
            name: data.LadderName,
            requests: [],
            jump: data.Jump,
            includeMe: data.IncludeMe,
            description: data.Description,
            currentUserId: MainUser.getInstance().userID
        }
        console.log(dataToSend)

        const callableReturnMessage = firebase.functions().httpsCallable('createLadder');

        callableReturnMessage(dataToSend).then((result) => {
            console.log(result.data);
            setLoading(false)
            if (result.data.title == "Error"){
                setError(result.data.message)
            }
            else{
                //go to ladder
                routeChange(data.LadderName.replace(/\s/g,''))
            }
        }).catch((error) => {
          console.log(`error: ${JSON.stringify(error)}`);
          setLoading(false)
          setError(`error: ${JSON.stringify(error)}`)
        });
    }

    const onError = (errors, e) => console.log(errors, e);

    const isInt = (value) => {
        return !isNaN(value) && 
               parseInt(Number(value)) == value && 
               !isNaN(parseInt(value, 10));
      }

    return (
        <Card>
        <Card.Header as="h5">My New Ladder</Card.Header>
        <Container style={{ paddingTop: 10, paddingRight: 20, paddingLeft: 40}}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
        
        <Row>
        <Controller
        name="LadderName"
        control={control}
        defaultValue=""
        rules={{ required: 'Name is required',  minLength: {
            value: 8,
            message: 'Must be at least 8 characters long'
          } }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              label="Ladder Name"
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
        </Row>

        <Row style={{ paddingTop: 20}}>
        <Controller
        name="Description"
        control={control}
        defaultValue=""
        rules={{ required: true,  minLength: {
            value: 32,
            message: 'Must be at least 32 characters long'
          } }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              label="Description"
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
        </Row>

        <Row style={{ paddingTop: 20}}>
        <Controller
        name="Jump"
        control={control}
        defaultValue=""
        rules={{ required: true,  min: {
            value: 1,
            message: 'Must be at least 1'
          }, validate: isInt  }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              label="Jump"
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
        </Row>

        <Row style={{ paddingTop: 20}}>
        <Controller
        name="IncludeMe"
        control={control}
        defaultValue=""
        rules={{ required: false }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormControlLabel onChange={onChange} control={<Checkbox name="checkedA" />} label="Include Yourself" />
          )}
        />
        </Row>

        <Row style={{ paddingTop: 20}}>
        <Controller
        name="permission"
        control={control}
        defaultValue=""
        rules={{ required: "Permissions is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormControl>
            <InputLabel htmlFor="grouped-native-select">Permissions</InputLabel>
            <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            onChange={onChange}
            value={value}
            helperText={error ? error.message : null}
          >
            <MenuItem value={"Open"}>Open</MenuItem>
            <MenuItem value={"Public, with Requests"}>Public, with Requests</MenuItem>
            <MenuItem value={"Invitation"}>Invitation</MenuItem>
            <MenuItem value={"Invitation by Admins Only"}>Invitation by Admins Only</MenuItem>
          </Select>      </FormControl>)}
        />
        </Row>

        <button type="submit">Submit</button>
      </form> 
      </Container>
      </Card>   
    );
}
