// import classes from "./CenteredBoxInLayout.module.css";

import { Box } from '@mui/material'

const CenteredBoxInLayout = (props) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="85vh"
    >
      <div>{props.children}</div>
    </Box>
  )
}

export default CenteredBoxInLayout
