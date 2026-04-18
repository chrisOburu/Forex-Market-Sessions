import { Box, Typography } from '@mui/material';
import AnalogClock from './AnalogClock';
import { useTime, getIANAOffset } from '../hooks/useTime';

function formatUTCOffset(ianaZone) {
  const offset = getIANAOffset(ianaZone);
  const sign = offset >= 0 ? '+' : '-';
  const abs = Math.abs(offset);
  const h = Math.floor(abs);
  const m = Math.round((abs - h) * 60);
  return m > 0
    ? `UTC ${sign}${h}:${String(m).padStart(2, '0')}`
    : `UTC ${sign}${h}`;
}

export default function SessionCard({ name, timezone, flagSrc }) {
  const time = useTime(timezone);
  const utcLabel = formatUTCOffset(timezone);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        m: { xs: '4px', sm: '10px' },
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0C0404',
        bgcolor: '#e6e6e6',
        borderRadius: '5px',
        p: { xs: '6px', sm: '10px' },
        fontFamily: 'cursive',
        label: 'SessionCard',
      }}
    >
      {/* Desktop: analog clock */}
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <AnalogClock
          hourDeg={time.hourDeg}
          minDeg={time.minDeg}
          secDeg={time.secDeg}
          flagSrc={flagSrc}
        />
      </Box>

      {/* Mobile: flag image */}
      <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', alignItems: 'center', mr: '4px' }}>
        <Box
          component="img"
          src={flagSrc}
          alt={name}
          sx={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '2px solid darkgrey' }}
        />
      </Box>

      {/* Desktop text info */}
      <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', ml: '10px', minWidth: 120 }}>
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

      {/* Mobile compact text info */}
      <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', lineHeight: 1.2 }}>
        <Typography sx={{ fontWeight: 'bold', fontFamily: 'cursive', fontSize: 11 }}>
          {name}
        </Typography>
        <Box sx={{ color: '#36454F', fontSize: 13, fontFamily: 'cursive' }}>
          {time.hour}:{time.minutes}
        </Box>
        <Box sx={{ fontSize: 9, color: '#555D50', fontFamily: 'cursive' }}>
          {time.dayOfWeek} ({utcLabel})
        </Box>
      </Box>
    </Box>
  );
}
