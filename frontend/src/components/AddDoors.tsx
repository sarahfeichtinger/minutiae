import React from 'react';
import Button from '@material-ui/core/Button';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Checkbox } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import axios from 'axios';
import { getDoors } from '../shared/API';
import { useQuery } from 'react-query';
import AddIcon from '@material-ui/icons/Add';
import Loading from './Loading';

type Door = {
  id: number;
  doorName: string;
  IPAddress: string;
  color: string;
}

type GetDoorsResponse = {
  doors: Door[];
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
export default function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const { data, isLoading } = useQuery(getDoors.name, getDoors); //isLoading

  console.log(data);
  if(isLoading){
    console.log("is Loading ...");
    <Loading />
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let array = data?.doors;
 
  if (array === undefined) {
    array = [];
  }
  return (
    <div>
      <Button variant="contained" color="inherit" onClick={handleClickOpen} data-cy="addDoorbtn">
        <AddIcon />
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create new User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select the doors please:
          </DialogContentText>
          <Autocomplete
            multiple
            options = {array}
            disableCloseOnSelect
            getOptionLabel={(option) => option.doorname}
            renderOption={(option, { selected }) => (
            <React.Fragment>
              <Checkbox
               icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
          {option.doorname}
        </React.Fragment>
      )}
      style={{ width: 500 }}
      renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
        <TextField {...params} variant="outlined" label="Doors" placeholder="" fullWidth />
      )}
    />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit" data-cy="addDoorCancel">
            Cancel
          </Button>
          <Button onClick={handleClose} color="inherit" data-cy="addDoorSave">save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );



};
