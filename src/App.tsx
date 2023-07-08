import React from "react";
import Typography from "@mui/material/Typography";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./App.css";
import Search from "./Search";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Typography variant="h2" component="h1">
          IO Quote Board Database
        </Typography>
      </header>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Search></Search>
      </LocalizationProvider>
    </div>
  );
}

export default App;
