import { useState, useMemo } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

// Group all IANA timezones by region using the Intl API
const grouped = Intl.supportedValuesOf('timeZone').reduce((acc, zone) => {
  const [region] = zone.split('/');
  if (!acc[region]) acc[region] = [];
  acc[region].push(zone);
  return acc;
}, {});

const regionOptions = Object.keys(grouped).sort();

// Detect local timezone and its region
const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
const localRegion = localTz.split('/')[0];

function getOffset(timeZone) {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'shortOffset',
  }).formatToParts(now);
  const tzPart = parts.find((p) => p.type === 'timeZoneName')?.value || '';
  // tzPart looks like "GMT", "GMT+3", "GMT-5", "GMT+5:30", etc.
  const match = tzPart.match(/GMT([+-]?\d+)?(?::(\d+))?/);
  if (!match) return 0;
  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  return hours + (hours < 0 ? -minutes : minutes) / 60;
}

export default function TimezoneSelector({ onOffsetChange, onCityChange }) {
  const [region, setRegion] = useState(localRegion);
  const [city, setCity] = useState(localTz);

  const cities = useMemo(() => grouped[region] || [], [region]);

  // Set initial offset on mount
  useState(() => {
    onOffsetChange(getOffset(localTz));
    onCityChange?.(localTz);
  });

  function handleRegionChange(e) {
    const newRegion = e.target.value;
    setRegion(newRegion);
    const newCities = grouped[newRegion] || [];
    if (newCities.length) {
      setCity(newCities[0]);
      onOffsetChange(getOffset(newCities[0]));
      onCityChange?.(newCities[0]);
    }
  }

  function handleCityChange(e) {
    const tz = e.target.value;
    setCity(tz);
    onOffsetChange(getOffset(tz));
    onCityChange?.(tz);
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box>
        <Typography variant="h6" sx={{ fontFamily: 'cursive', mb: 1 }}>
          Time Zone Selector
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: { xs: 110, sm: 140 }, flex: '1 1 auto' }}>
            <InputLabel sx={{ fontFamily: 'cursive' }}>Region</InputLabel>
            <Select
              value={region}
              label="Region"
              onChange={handleRegionChange}
              sx={{ fontFamily: 'cursive' }}
            >
              {regionOptions.map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: { xs: 140, sm: 180 }, flex: '1 1 auto' }}>
            <InputLabel sx={{ fontFamily: 'cursive' }}>City</InputLabel>
            <Select
              value={city}
              label="City"
              onChange={handleCityChange}
              sx={{ fontFamily: 'cursive' }}
            >
              {cities.map((tz) => (
                <MenuItem key={tz} value={tz}>
                  {tz.split('/').slice(1).join('/')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
}
