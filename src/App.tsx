import React, { useState } from "react";
import bcrypt from "bcryptjs";
import Typography from "@mui/material/Typography";
import "./App.css";
import Dialog from "@mui/material/Dialog";
import Search from "./Search";
import dotenv from "dotenv";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
dotenv.config();

function App() {
  const [verified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [incorrect, setIncorrect] = useState(false);

  const validatePassword = () => {
    // e.preventDefault();
    // const password = prompt("Enter site password: ");
    // const password = document.getElementById("password").value;
    console.log(`password entered: ${password}`);
    const hash = process.env.REACT_APP_PW_HASH_FULL;
    bcrypt.compare(password as string, hash as string, (err, res) => {
      console.log(`compare result with password ${password}: ${res}`);
      if (res === true) setIsVerified(true);
      else setIncorrect(true);
    });
  };

  const hash = process.env.REACT_APP_PW_HASH_FULL;

  return (
    <div className="App">
      <header className="App-header">
        <Typography variant="h2" component="h1">
          IO Quote Board Database
        </Typography>
      </header>
      {verified ? (
        <Search />
      ) : (
        <Dialog className="password" open={!verified}>
          <DialogTitle>Authentication</DialogTitle>
          <DialogContentText className="password">
            Password needed to view this content.
          </DialogContentText>
          {incorrect ? (
            <TextField
              error
              className="password"
              type="password"
              label="Password"
              variant="standard"
              helperText="Incorrect password, try again"
              onChange={(e) => setPassword(e.target.value)}
            />
          ) : (
            <TextField
              className="password"
              type="password"
              label="Password"
              variant="standard"
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
          <DialogActions>
            <Button variant="outlined" onClick={validatePassword}>
              Submit password
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

export default App;
