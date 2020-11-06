import React from 'react';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core';
const useStyles = makeStyles({
  dialog: {
    
padding: 20
}
});


export default function Popup ({open, handleClose}){
  const classes = useStyles()
    return (
      <Dialog onClose={handleClose}  aria-labelledby="simple-dialog-title" maxWidth='xs' open={open} >      
      <DialogContent className={classes.dialog}>
      <Typography  >
      {open.message}
      </Typography>        
      </DialogContent>
  </Dialog>
    )
}
