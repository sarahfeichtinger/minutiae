import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Avatar, Button, Card, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AddDoors from "./AddDoors";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import { useQuery } from "react-query";
import {  useParams } from "react-router-dom";
import { deleteFinger, getAdminProfile, getUserDetail } from "../shared/API";
import { NewUserFormRouteProps } from '../shared/API';
import Loading from "./Loading";
import { Door } from "../shared/API";
import keyimg from '../pages/blackkey.png';
import DeleteFinger from "./DeleteFinger";

type Inputs = {
  username: string,
  firstname: string,
  lastname: string,
  role: string,
  password: string | undefined,
  email: string,
  phonenumber: string,
};

type Finger = {
  id: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
      fontSize: 14,

    },
    root: {
      flexGrow: 3,
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
    paper: {
      padding: theme.spacing(3),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    pos: {
      marginBottom: 12,
    },
  }),
);


const roles = [
    {
      value: 'Admin',
      label: 'Admin',
    },
    {
      value: 'User',
      label: 'User',
    },
  ];

  

export default function NewUserForm() {
  const { data, refetch } = useQuery(getAdminProfile.name, getAdminProfile); 

  const uuid = data?.uuid;
  const { register, handleSubmit, control, formState: { errors } } = useForm<Inputs>(
    {
      defaultValues: {
        username: data?.username,
        firstname: data?.firstname,
        lastname: data?.lastname,
        role: data?.role,
        email: data?.email,
        phonenumber: data?.phonenumber,
      }
    }
  );

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    
    // debugger;
     const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${uuid}`, {
       method: 'PATCH',
       headers: { 
           'Content-Type': 'application/json',
           "Access-Control-Allow-Credentials": "true",
           "Access-Control-Allow-Origin": "http://localhost:3000",
       
       },
       credentials: "include",
       body: JSON.stringify(data)
     });
     const jsonData = await response.json();
 
     if(response.ok){
       alert("updated");
      // window.location.href=`/new-user/${data.username}`;
     } else {
       alert("nicht ok");
        alert(response.statusText);
     }
    }


  const [currency, setCurrency] = useState('Admin');
  const [editable, setEditable] = useState(false);
  const [passwordChange, setPasswordChange] = useState(false);

  const classes = useStyles();
  const params = useParams<NewUserFormRouteProps>();


  const handleChangeCurrency = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrency(event.target.value);
  };



  let name1: string = data?.username ?? "default name";
  
  let changedFields = {username: false,
    firstname: false,
    lastname: false,
    role: false,
    email: false,
    phonenumber: false,
      password: false
  }


function changeEditableState(){
  setEditable(!editable);
  console.log(editable);
}

function handlePasswordChange(){
  setPasswordChange(!passwordChange);
}







  return (
    <div style={{ padding:'0.5%', margin:'0.5%'}}>    
        <Link to='/management' style={{color:'black', textDecoration:'none'}}><Button variant='contained' style={{margin:'1%',backgroundColor:'#9bbda3', textAlign:'center'}} startIcon={<ArrowBackIcon />}>back</Button></Link>

    <Button onClick={changeEditableState}>edit</Button>
    <form onSubmit={handleSubmit(onSubmit)}>

    <Table style={{width:'40%', maxWidth:'40%', float:'left'}}>
      <TableBody>
        <TableRow>
          <TableCell>
            Username:
          </TableCell>
          <TableCell>

          {editable ?<Controller
            name="username"
            control={control}
            defaultValue={data?.username}
            rules={{ required: 'Username required' }}
            render={({ field: { onChange, value } }) => (
              <TextField
              fullWidth
              defaultValue={data?.username}
              {...register("username")}
              label="username"
              variant='outlined'
              value={value}
              onChange={onChange}
              />

            )}
          />: <h3>{data?.username}</h3> }
          {errors.username  && <span style={{color:'red'}}>Please enter a unique username </span>}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            Firstname:
          </TableCell>
          <TableCell>
            {editable ?<Controller
              name="firstname"
              control={control}
              defaultValue={data?.firstname}
              render={({ field: { onChange, value } }) => (
                <TextField
                fullWidth
                defaultValue={data?.firstname}
                {...register("firstname")}
                label="firstname"
                variant='outlined'
                value={value}
                onChange={onChange}
                />

              )}
            />: <h3>{data?.firstname}</h3> }          
            </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            Lastname:
          </TableCell>
          <TableCell>
            {editable ?<Controller
                name="lastname"
                control={control}
                defaultValue={data?.lastname}
                render={({ field: { onChange, value } }) => (
                  <TextField
                  fullWidth
                  defaultValue={data?.lastname}
                  {...register("lastname")}
                  label="lastname"
                  variant='outlined'
                  value={value}
                  onChange={onChange}
                  />
                )}
              />: <h3>{data?.lastname}</h3> }          
              </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            Role:
          </TableCell>
          <TableCell>
            {editable ? <TextField  {...register("role")} fullWidth style={{fontSize:'1vw'}} id="role" margin="dense" select variant='outlined' label="Role" value={currency} onChange={handleChangeCurrency} >
              {roles.map((option) => (
                <MenuItem key={option.value} value={option.value}  >
                    {option.label}
                </MenuItem> ))
              } </TextField> : <h3>{data?.role}</h3>
            }
          </TableCell>
        </TableRow>
        <TableRow>
              <TableCell>
                Password:
              </TableCell>
              <TableCell>
                {editable && data?.role==="Admin" ?<Controller
                  name="password"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                        fullWidth
                        label="password"
                        variant='outlined'
                        onChange={() => {changedFields.password = !changedFields.password;onChange()}}
                    />
                    )}
                  />: <h3>{(data?.role==="Admin") ? "***" : ""}</h3> }
         </TableCell>
              </TableRow>
        <TableRow>
          <TableCell>
            Email:
          </TableCell>
          <TableCell>
            {editable ?<Controller
              name="email"
              control={control}
              defaultValue={data?.email}
              render={({ field: { onChange, value } }) => (
                <TextField
                  fullWidth
                  defaultValue={data?.email}
                  {...register("email")}
                  label="email"
                  variant='outlined'
                  value={value}
                  onChange={onChange}
                />
                )}
              />: <h3>{data?.email}</h3> }             
            {errors.email  && <span style={{color:'red'}}>Please enter a valid email </span>}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            Phonenumber:
          </TableCell>
          <TableCell>
            {editable ?<Controller
              name="phonenumber"
              control={control}
              defaultValue={data?.phonenumber}
              render={({ field: { onChange, value } }) => (
                <TextField
                  fullWidth
                  defaultValue={data?.phonenumber}
                  {...register("phonenumber")}
                  label="phonenr"
                  variant='outlined'
                  value={value}
                  onChange={onChange}
                />
            )}
              />: <h3>{data?.phonenumber}</h3> } 
          </TableCell>
        </TableRow>
      </TableBody>
      
    </Table>
    <div hidden={!editable}>
        <Button  type="submit" variant='contained' style={{float:'right', display:'inline-block'}} >Save</Button>
        </div>

       

<div style={{float:'left', width:'40%', marginLeft:'10%'}}>
              
              {data?.finger === null ? <Link to={`/fingerprintscan/${data?.uuid}`} ><Button variant='outlined' fullWidth style={{fontSize:'1.5vw',textDecoration:'none'}} startIcon={<FingerprintIcon style={{color: 'red',fontSize:'2vw', padding:'2%'}} />}>add</Button></Link>: <DeleteFinger uuid={uuid} refetch={refetch}/> }
              <br></br>
            <div className={classes.root} style={{width:'95%', display: 'inline-block',backgroundColor:'#A9C6B0', position:'relative', padding:'3%', marginTop:'10%'}}>
                <AddDoors />
                Door Access:
                <br></br>
                <ul>
                {data?.accesses.map((door: Door) =>(
                      <><img src={keyimg} alt='key' width={'4%'} style={{float:'left', marginRight:'2%'}}/>
                      <li style={{listStyle: 'none' }}>{door.doorname}</li>
                      <br></br></>
                  ))}
                </ul>
              </div>

    </div>
    </form>
    </div>
  );
}