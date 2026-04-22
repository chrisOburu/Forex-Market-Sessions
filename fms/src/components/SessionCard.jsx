import { Box, Typography } from '@mui/material';
import AnalogClock from './AnalogClock';
import { useTime } from '../hooks/useTime';

export default function SessionCard({ name, timezone, flagSrc,}) {
  const time = useTime(timezone);
  // const open = isSessionOpen(name);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        m: '10px',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0C0404',
        bgcolor: '#e6e6e6',
        borderRadius: '5px',
        p: '10px',
        fontFamily: 'cursive',
        label: 'SessionCard',
      }}
    >
      <AnalogClock
        hourDeg={time.hourDeg}
        minDeg={time.minDeg}
        secDeg={time.secDeg}
        flagSrc={flagSrc}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', ml: '10px', minWidth: 120 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontFamily: 'cursive' }}>
          {name}
        </Typography>
        <Box sx={{ display: 'flex', color: '#36454F', fontSize: 15, fontFamily: 'cursive' }}>
          <span>{time.hour}</span>
          <span>:</span>
          <span>{time.minutes}</span>
          <span style={{ marginLeft: 4 }}>{time.ampm}</span>
        </Box>
        <Box sx={{ fontSize: 12, color: '#555D50', fontStyle: 'italic', fontFamily: 'cursive' }}>
          {time.dayOfWeek} {time.month} {time.date}
        </Box>
      </Box>
    </Box>
  );
}