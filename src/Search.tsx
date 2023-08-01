import React from "react";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "./Search.css";
import SearchResults from "./SearchResults";
import dotenv from "dotenv";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
dotenv.config();
// https://codesandbox.io/s/silly-albattani-yk9z4
// thanks to this guy for how to do forms with Material UI

// TODO: Types To Make
// a like quote result one
// a params one?

dayjs.extend(utc);
dayjs.extend(timezone);

// make this so it takes the whole list of quotes? or ehh idk how much
// styling I need to do on those so whatever lol
// possibly extract out to separate file if needed??
// function QuoteDisplay(quoteObj: any) {
function QuoteDisplay(quoteObj: any) {
  const quote = quoteObj.quoteObj;
  // console.log(quote);
  // return <p className="results">{quoteObj.quote_text}</p>;
  return <p className="results">{quote.quote_text}</p>;
}

function Search() {
  interface Member {
    name: string;
    member_id: number;
  }

  interface Quotee {
    name: string;
    person_id: number;
  }

  const [error, setError] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [quotees, setQuotees] = useState<Quotee[]>([]);
  const [searched, setSearched] = useState(false);

  const minDate = new Date();

  const headerString = btoa(
    `${process.env.REACT_APP_AUTH_USERNAME}:${process.env.REACT_APP_AUTH_PASSWORD}`
  );

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/members`, {
      headers: {
        Authorization: `Basic ${headerString}`,
      },
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => setMembers(res));
    // have parameter for like top however many
    fetch(`${process.env.REACT_APP_API_BASE_URL}/quotees`, {
      headers: { Authorization: `Basic ${headerString}` },
    })
      .then((res) => res.json())
      .then((res) => setQuotees(res));
  }, []);

  // you don't actually need to put new guys in here apparently
  const initialValues = {
    keyword: "",
    member: null,
    quotee: null,
    limit: "on",
    sortby: "date",
    direction: "desc",
    case: "on",
  };

  // or have values be any?
  const submit = (values: any) => {
    console.log("form submitted");
    setIsLoading(true);
    setSearched(true);
    console.log(values);
    if (values.fromDate && values.fromDate.$d)
      values.fromDate = values.fromDate.$d.toISOString().split("T")[0];
    if (values.toDate && values.toDate.$d)
      values.toDate = values.toDate.$d.toISOString().split("T")[0];
    if (values.keyword) values.keyword = encodeURIComponent(values.keyword);
    const params: string = Object.entries(values)
      .filter(([key, val]) => val !== null && val !== "")
      .map(([key, val]) => `${key}=${val}`)
      .join("&");
    console.log(params);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/search?${params}`, {
      headers: {
        Authorization: `Basic ${headerString}`,
      },
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .then(() => setIsLoading(false));
  };

  if (error) {
    return <p>Error: {error}</p>;
  } else {
    return (
      <Container className="search-wrapper">
        <Formik initialValues={initialValues} onSubmit={submit}>
          {({ handleChange, values, setFieldValue }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Input
                    id="search-keyword"
                    name="keyword"
                    className="search-input"
                    placeholder="Keyword"
                    size="small"
                    onChange={handleChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    }
                  />
                </Grid>
                <Grid item xs={3} sm={2} md={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked
                        className="search-input"
                        id="case"
                        name="case"
                        onChange={handleChange}
                      />
                    }
                    label="Case"
                  />
                </Grid>
                <Grid item xs={4} md={3} lg={2}>
                  <Autocomplete
                    disablePortal
                    id="member-select"
                    // name="member"
                    className="search-input"
                    size="small"
                    options={members}
                    getOptionLabel={(option) => option.name}
                    onChange={(e, value) => {
                      console.log(value);
                      setFieldValue(
                        "member",
                        value !== null ? value.member_id : initialValues.member
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="member"
                        label="From member"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={4} md={3} lg={2}>
                  <Autocomplete
                    disablePortal
                    id="quotee-select"
                    className="search-input"
                    size="small"
                    options={quotees}
                    getOptionLabel={(option) => option.name}
                    onChange={(e, value) => {
                      console.log(value);
                      setFieldValue(
                        "quotee",
                        value !== null ? value.person_id : initialValues.quotee
                      );
                    }}
                    renderInput={(params) => (
                      <TextField {...params} name="quotee" label="Quotee" />
                    )}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <DatePicker
                    className="date-picker search-input"
                    label="From"
                    timezone="America/New_York"
                    minDate={dayjs("2019-10-31")}
                    maxDate={dayjs(Date.now())}
                    openTo="year"
                    views={["year", "month", "day"]}
                    onChange={(value) => setFieldValue("fromDate", value)}
                    onError={() => {
                      setFieldValue("fromDate", null);
                    }}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <DatePicker
                    className="date-picker search-input"
                    label="To"
                    timezone="America/New_York"
                    minDate={dayjs("2019-10-31")}
                    maxDate={dayjs(Date.now())}
                    openTo="year"
                    views={["year", "month", "day"]}
                    onChange={(value) => setFieldValue("toDate", value)}
                    onError={() => {
                      setFieldValue("toDate", null);
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    className="search-input"
                    name="sortby"
                    size="small"
                    defaultValue=""
                    onChange={handleChange}
                    select
                    label="Sort by..."
                  >
                    <MenuItem key={1} value="date">
                      Date
                    </MenuItem>
                    <MenuItem key={2} value="likes">
                      Likes
                    </MenuItem>
                  </TextField>
                </Grid>
                <Grid item>
                  <RadioGroup
                    row
                    defaultValue="desc"
                    name="direction"
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="asc"
                      control={<Radio />}
                      label="Asc"
                    />
                    <FormControlLabel
                      value="desc"
                      control={<Radio />}
                      label="Desc"
                    />
                  </RadioGroup>
                </Grid>
              </Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    className="search-input"
                    id="limit"
                    name="limit"
                    onChange={handleChange}
                  />
                }
                label="Limit"
              />
              <Button variant="contained" type="submit">
                Search
              </Button>
              <Button variant="outlined">
                <CloseIcon />
                Clear search
              </Button>
            </Form>
          )}
        </Formik>
        <SearchResults loading={loading} searched={searched} data={data} />
      </Container>
    );
  }
}

export default Search;
