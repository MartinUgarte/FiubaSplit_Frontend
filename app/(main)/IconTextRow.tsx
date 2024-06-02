import React, { ReactElement } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const IconTextRow = ({ icon, text, textColor }: {icon: ReactElement, text: string, textColor?: string}) => (
  <Box display='flex' flexDirection='row' sx={{marginBottom: 2}}>
    {icon}
    <Typography color={textColor ? textColor : '#487ba9'} sx={{marginLeft: 2}}>{text}</Typography>
  </Box>
);

export default IconTextRow;