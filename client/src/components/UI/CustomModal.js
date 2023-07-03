import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { Button, Typography } from '@mui/material'

const CustomModal = (props) => {
  const boxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box sx={boxStyle}>
        <Typography style={{ marginBottom: '10px' }} variant="h5">
          {props.title}
        </Typography>
        {props.isLoading ? <div>Loading....</div> : props.children}
        {!props.isLoading && (
          <Button
            fullWidth
            variant="contained"
            onClick={props.onConfirm}
            style={{ marginTop: '10px' }}
          >
            {props.confirmButtonText ? props.confirmButtonText : 'Confirm'}
          </Button>
        )}
      </Box>
    </Modal>
  )
}

export default CustomModal
