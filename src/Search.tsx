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
              <Stack direction="row">
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
                    <TextField {...params} name="member" label="From member" />
                  )}
                />
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
                {/* </FormControl> */}
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
              </Stack>
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
        {/* <p>{data}</p> */}
        {/* <ul>
                    {data.map((quote: any) => {
                        return <li key={quote.quote_id}>{quote.quote_text}</li>;
                    })}
                </ul> */}
        {/* <div>
                    {data.map((quote: any) => {
                        // return <p className="results">{quote.quote_text}</p>;
                        return <QuoteDisplay quoteObj={quote} />;
                    })}
                </div> */}
        {/* <SearchResults loading={loading} data={data} /> */}
        <SearchResults
          props={{ loading: loading, searched: searched, data: data }}
        />
      </Container>
    );
  }
}

export default Search;
