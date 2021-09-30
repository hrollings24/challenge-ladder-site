import React, { useState, useEffect } from "react"
import { Container, Row, Col, Alert } from "react-bootstrap"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { TextField } from '@material-ui/core';
import { useForm, Controller } from "react-hook-form";
import firebase from 'firebase/app';
import 'firebase/firestore';


export default function ChangeSettingForm({settingType, ladder, setLoading, setError, setSuccess}) {
    const { handleSubmit, control } = useForm();

    const onSubmit = data => {
        setLoading(true)
        if (settingType == "jump"){
            const db = firebase.firestore();
            const ladderref = db.collection('ladders').doc(ladder.id);

            ladderref.update({jump: data.Jump}).then((result) => {
                setLoading(false)
                setSuccess("Jump successfully changed")
                ladder.refresh()
            }).catch((error) => {
              console.log(`error: ${JSON.stringify(error)}`);
              setLoading(false)
              setError(`error: ${JSON.stringify(error)}`)
            });
        }
        else if (settingType == "permission"){
            const db = firebase.firestore();
            const ladderref = db.collection('ladders').doc(ladder.id);

            ladderref.update({permission: data.permission}).then((result) => {
                setLoading(false)
                setSuccess("Permissions successfully changed")
                ladder.refresh()
            }).catch((error) => {
              console.log(`error: ${JSON.stringify(error)}`);
              setLoading(false)
              setError(`error: ${JSON.stringify(error)}`)
            });
        }
        else if (settingType == "name"){
            const db = firebase.firestore();
            const ladderref = db.collection('ladders').doc(ladder.id);

            ladderref.update({name: data.LadderName}).then((result) => {
                setLoading(false)
                setSuccess("Name successfully changed")
                ladder.refresh()
            }).catch((error) => {
              console.log(`error: ${JSON.stringify(error)}`);
              setLoading(false)
              setError(`error: ${JSON.stringify(error)}`)
            });
        }
    }

    const onError = (errors, e) => console.log(errors, e);

    const isInt = (value) => {
        return !isNaN(value) && 
               parseInt(Number(value)) == value && 
               !isNaN(parseInt(value, 10));
      }

    if (settingType == "jump"){
        return (
            <div>
                <Container>
                <form onSubmit={handleSubmit(onSubmit, onError)}>
                    <Col>
                
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
                    </Col>
                    <button type="submit">Submit</button>
                </form> 
                </Container>
            </div>
        )
    }

    else if (settingType == "permission"){
        return (
            <div>
                <Container>
                <form onSubmit={handleSubmit(onSubmit, onError)}>
                    <Col>
                
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
                    </Col>
                    <button type="submit">Submit</button>
                </form> 
                </Container>
            </div>
        )
    }

    else{
        return (
            <div>
                <Container>
                <form onSubmit={handleSubmit(onSubmit, onError)}>
                    <Col>
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
                    </Col>
                    <button type="submit">Submit</button>
                </form> 
                </Container>
            </div>
        )
    }

    
}
