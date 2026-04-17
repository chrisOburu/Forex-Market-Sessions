import { Box, Typography } from '@mui/material';

export default function DigitalClock({ hour, minutes, seconds, ampm }) {
  const digitSx = {
    width: 100,
    height: 40,
    bgcolor: 'slateblue',
    opacity: 0.8,
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 50,
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    fontFamily: 'cursive',
  };

  const labelSx = {
    height: 30,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    bgcolor: 'darkblue',
    opacity: 0.8,
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'cursive',
  };

  return (
    <Box sx={{ display: 'flex', gap: '5px' }}>
      <Box sx={{ textAlign: 'center', position: 'relative' }}>
        <Box sx={digitSx}>{hour}</Box>
        <Box sx={labelSx}>HH</Box>
      </Box>
      <Box sx={{ textAlign: 'center', position: 'relative' }}>
        <Box sx={digitSx}>{minutes}</Box>
        <Box sx={labelSx}>MM</Box>
      </Box>
      <Box sx={{ textAlign: 'center', position: 'relative' }}>
        <Box sx={digitSx}>{seconds}</Box>
        <Box sx={labelSx}>SS</Box>
      </Box>
      <Box sx={{ textAlign: 'center', position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            width: 60,
            height: 30,
            fontSize: 20,
            bgcolor: 'green',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'cursive',
          }}
        >
          {ampm}
        </Box>
      </Box>
    </Box>
  );
}
