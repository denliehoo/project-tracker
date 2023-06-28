import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'

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
        {props.isLoading ? <div>Loading....</div> : props.children}
      </Box>
    </Modal>
  )
}

export default CustomModal
