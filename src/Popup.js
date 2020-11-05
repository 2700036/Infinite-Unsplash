import React from 'react';
import Modal from '@material-ui/core/Modal';

export default function Popup ({open, handleClose}){
    return (
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {<>
            <h2 id="simple-modal-title">Text in a modal</h2>
      <p id="simple-modal-description">
        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      </p>
      </>
      }
      </Modal>
    )
}
