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
        flexDirection: { xs: 'column', md: 'row' },
        //alignItems: 'flex-start',
        textAlign: { xs: 'center', md: 'left' },
        m: { xs: 1, md: "10px" },
        fontSize: { xs: "0.5rem", md: "1rem" },
        fontWeight: 'bold',
        color: '#0C0404',
        bgcolor: '#e6e6e6',
        borderRadius: '5px',
        p: { xs: '1px', md: "10px" },
        //fontFamily: 'cursive',
        label: 'SessionCard',
      }}
    >
      <AnalogClock
        hourDeg={time.hourDeg}
        minDeg={time.minDeg}
        secDeg={time.secDeg}
        flagSrc={flagSrc}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', ml: { xs: 0, md: 2}}}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: { xs: "0.5rem", md: "1rem" } }}>
          {name}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, color: '#36454F', fontSize: { xs: "0.5rem", md: "1rem" } }}>
          <span>{time.hour}</span>
          <span>:</span>
          <span>{time.minutes}</span>
          <span style={{ marginLeft: 4 }}>{time.ampm}</span>
        </Box>
        <Box sx={{ fontSize: { xs: "0.3rem", md: "0.75rem" }, color: '#555D50', fontStyle: 'italic' }}>
          {time.dayOfWeek} {time.month} {time.date}
        </Box>
      </Box>
    </Box>
  );
}