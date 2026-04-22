import { useState, useRef, useEffect } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import TimezoneSelector from "./components/TimezoneSelector";
import DigitalClock from "./components/DigitalClock";
import SessionCard from "./components/SessionCard";
import TimelineGrid from "./components/TimelineGrid";
//import HourLabels from './components/HourLabels';
import { useTime, SESSIONS_TIMEZONES } from "./hooks/useTime";
import { tzToCountryCode } from "./utils/tzCountry";
import "./App.css";

import auFlag from "./assets/au.svg";
import jpFlag from "./assets/jp.svg";
import gbFlag from "./assets/gb.svg";
import usFlag from "./assets/us.svg";

const sessions = [
  { name: "Sydney", key: "Sydney", flag: auFlag, color: "#6b22b3" },
  { name: "Tokyo", key: "Tokyo", flag: jpFlag, color: "#ce2e71" },
  { name: "London", key: "London", flag: gbFlag, color: "#0bbfff" },
  { name: "New York", key: "New York", flag: usFlag, color: "#56c51f" },
];

function App() {
  const [offset, setOffset] = useState(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    }).formatToParts(new Date());
    const tzPart = parts.find((p) => p.type === "timeZoneName")?.value || "";
    const match = tzPart.match(/GMT([+-]?\d+)?(?::(\d+))?/);
    if (!match) return 0;
    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    return hours + (hours < 0 ? -minutes : minutes) / 60;
  });
  const time = useTime(offset);
  const [selectedCity, setSelectedCity] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const countryCode = tzToCountryCode(selectedCity);

  const cardsColumnRef = useRef(null);
  const [cardsColumnHeight, setCardsColumnHeight] = useState(490);
  useEffect(() => {
    const el = cardsColumnRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setCardsColumnHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Paper
      elevation={3}
      sx={{
        width: "90%",
        minHeight: "auto",
        mx: "auto",
        mt: "30px",
        borderRadius: "10px",
        p: "10px",
        fontFamily: "cursive",
        position: "relative",
        // bgcolor: '#f8f4f4',
        label: "AppContainer",
      }}
    >
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ mb: 2 }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            mt: 1,
            fontWeight: "bold",
            fontFamily: "cursive",
            width: "100%",
          }}
        >
          Forex Market Sessions
        </Typography>

        {/* Controls row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: { xs: "center", md: "space-between" },
            alignItems: "center",
            gap: { xs: 2, md: 0 },
            mb: 1,
            width: "100%",
          }}
        >
          <TimezoneSelector
            offset={offset}
            onOffsetChange={setOffset}
            onCityChange={setSelectedCity}
          />
          <DigitalClock
            hour={time.hour}
            minutes={time.minutes}
            seconds={time.seconds}
            ampm={time.ampm}
            countryCode={countryCode}
          />
        </Box>
      </Grid>

      {/* Sessions + Timeline */}
      <Box sx={{ display: "flex", flexDirection: "row", gap: 0, label: "MainContent" }}>
        {/* Session cards column */}
        <Box
          ref={cardsColumnRef}
          sx={{
            width: { xs: "20%", md: 280 },
            flexShrink: 0,
            pt: { xs: "12px", md: "10px" },
            label: "SessionCardsColumn",
          }}
        >
          {sessions.map((s) => (
            <SessionCard
              key={s.key}
              name={s.name}
              timezone={SESSIONS_TIMEZONES[s.key][0]}
              flagSrc={s.flag}
              // color={s.color}
            />
          ))}
        </Box>

        {/* Timeline column */}
        <Box sx={{ flex: 1, mr: "20px", label: "TimelineColumn" }}>
          {/* <HourLabels /> */}
          <TimelineGrid offset={offset} totalHeight={cardsColumnHeight} />
        </Box>
      </Box>
    </Paper>
  );
}

export default App;
