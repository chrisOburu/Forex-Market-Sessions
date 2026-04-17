import { Box } from '@mui/material';
import { SESSIONS_TIMEZONES, getIANAOffset } from '../hooks/useTime';
import { isSessionOpen } from '../hooks/useTime';


const SESSION_DURATION = 9; // hours
const sessionsMeta = [
  { key: 'Sydney', color: '#00008B' },
  { key: 'Tokyo', color: '#BC002D' },
  { key: 'London', color: '#012169' },
  { key: 'New York', color: '#B22234' },
];

function getSessionRange(sessionKey, userOffset) {
  const [ianaZone, openHour] = SESSIONS_TIMEZONES[sessionKey];
  const sessionTz = getIANAOffset(ianaZone);
  // Convert session's local open time to user's timezone
  let start = userOffset - sessionTz + openHour;
  let end = start + SESSION_DURATION;
  return { start, end };
}

export default function TimelineGrid({ offset }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const gridHeight = 470;
  const rowHeight = gridHeight / sessionsMeta.length;

  return (
    <Box sx={{ position: 'relative', label: 'TimelineGrid' }}>
      {/* Hour labels */}
      <Box sx={{ display: 'flex', label: 'HourLabels' }}>
        {hours.map((h) => (
          <Box
            key={h}
            sx={{
              flex: '1 1 0',
              textAlign: 'left',
              fontSize: 12,
              fontFamily: 'cursive',
              lineHeight: '20px',
            }}
          >
            {h}
          </Box>
        ))}
      </Box>

      {/* Grid cells */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(24, 1fr)',
          gap: '2px',
          bgcolor: 'rgb(7,7,7)',
          opacity: 0.3,
          borderRadius: '10px',
          height: gridHeight,
          label: 'GridCells',
        }}
      >
        {hours.map((h) => (
          <Box
            key={h}
            sx={{
              bgcolor: '#a5a1a1',
              borderRadius: '5px',
              label: 'GridCell',
            }}
          />
        ))}
      </Box>

      {/* Horizontal dividers between sessions */}
      {[1, 2, 3].map((i) => (
        <Box
          key={`divider-${i}`}
          sx={{
            position: 'absolute',
            top: 20 + i * rowHeight,
            left: 0,
            width: '100%',
            height: '1px',
            bgcolor: 'rgba(0,0,0,0.3)',
            zIndex: 6,
          }}
        />
      ))}

      {/* Session range bars */}
      {sessionsMeta.map((session, i) => {
        const { start, end } = getSessionRange(session.key, offset);
        const leftPct = (Math.max(0, start) / 24) * 100;
        const rightPct = (Math.min(24, end) / 24) * 100;
        const widthPct = rightPct - leftPct;
        const top = 20 + i * rowHeight + rowHeight * 0.15;
        const barHeight = rowHeight * 0.7;

        // Handle wrap-around (when start < 0 or end > 24)
        const bars = [];
        if (start < 0) {
          // Wrap portion at end of day
          bars.push({ left: ((24 + start) / 24) * 100, width: ((-start) / 24) * 100 });
          bars.push({ left: 0, width: (end / 24) * 100 });
        } else if (end > 24) {
          // Wrap portion at start of day
          bars.push({ left: leftPct, width: ((24 - start) / 24) * 100 });
          bars.push({ left: 0, width: ((end - 24) / 24) * 100 });
        } else {
          bars.push({ left: leftPct, width: widthPct });
        }

        // Find the index of the largest bar
        const largestIdx = bars.length > 1
          ? (bars[0].width >= bars[1].width ? 0 : 1)
          : 0;

        return bars.map((bar, j) => (
          <Box
            key={`${session.key}-${j}`}
            sx={{
              position: 'absolute',
              top,
              left: `${bar.left}%`,
              width: `${bar.width}%`,
              height: barHeight,
              bgcolor: session.color,
              opacity: 0.75,
              borderRadius: '4px',
              zIndex: 5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontFamily: 'cursive',
              fontSize: 13,
            }}
          >
            {j === largestIdx && (isSessionOpen(session.key) ? 'Open' : 'Closed')}
          </Box>
        ));
      })}

      {/* Current time pointer */}
      <TimePointer offset={offset} />
    </Box>
  );
}

function TimePointer({ offset }) {
  const now = new Date();
  const utcH = now.getUTCHours() + offset;
  const utcM = now.getUTCMinutes();
  const totalMinutes = ((utcH * 60 + utcM) % (24 * 60) + 24 * 60) % (24 * 60);
  const pct = (totalMinutes / (24 * 60)) * 100;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 20,
        left: `${pct}%`,
        width: 2,
        height: 470,
        bgcolor: 'red',
        zIndex: 10,
      }}
    />
  );
}
