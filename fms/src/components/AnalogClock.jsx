import { Box } from '@mui/material';

const clockSize = 90;

export default function AnalogClock({ hourDeg, minDeg, secDeg, flagSrc }) {
  const arrowBase = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom center',
    borderRadius: '50% 50% 0 0',
    boxShadow: '1px 1px 2px rgba(0,0,0,0.7)',
    zIndex: 3,
  };

  return (
    <Box
      sx={{
        width: clockSize,
        height: clockSize,
        borderRadius: '50%',
        bgcolor: 'lightgray',
        border: '5px solid darkgrey',
        boxShadow: '1px 1px 4px rgba(0,0,0,.7)',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Numbers */}
      {[
        { label: '12', top: 6, left: '50%', transform: 'translateX(-50%)' },
        { label: '3', right: 6, top: '50%', transform: 'translateY(-50%)' },
        { label: '6', bottom: 6, left: '50%', transform: 'translateX(-50%)' },
        { label: '9', left: 6, top: '50%', transform: 'translateY(-50%)' },
      ].map((n) => (
        <Box
          key={n.label}
          sx={{
            position: 'absolute',
            fontSize: 10,
            fontWeight: 'bold',
            color: 'rgb(240,240,140)',
            textShadow: '1px 1px 2px rgba(0,0,0,.7)',
            zIndex: 3,
            top: n.top,
            left: n.left,
            right: n.right,
            bottom: n.bottom,
            transform: n.transform,
          }}
        >
          {n.label}
        </Box>
      ))}

      {/* Center dot */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 15,
          height: 15,
          bgcolor: 'darkgreen',
          borderRadius: '50%',
          zIndex: 4,
        }}
      />

      {/* Hour hand */}
      <Box
        sx={{
          ...arrowBase,
          width: 5,
          height: 30,
          bgcolor: 'white',
          ml: '-2.5px',
          transform: `rotate(${hourDeg}deg)`,
        }}
      />
      {/* Minute hand */}
      <Box
        sx={{
          ...arrowBase,
          width: 5,
          height: 40,
          bgcolor: 'white',
          ml: '-2.5px',
          transform: `rotate(${minDeg}deg)`,
        }}
      />
      {/* Second hand */}
      <Box
        sx={{
          ...arrowBase,
          width: 5,
          height: 40,
          bgcolor: 'goldenrod',
          ml: '-2.5px',
          transform: `rotate(${secDeg}deg)`,
        }}
      />

      {/* Flag */}
      {flagSrc && (
        <Box
          component="img"
          src={flagSrc}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            width: 40,
            height: 40,
            objectFit: 'cover',
            opacity: 0.9,
          }}
        />
      )}
    </Box>
  );
}
