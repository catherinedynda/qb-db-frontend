import React from "react";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import SearchIcon from "@mui/icons-material/Search";
import "./Search.css";
import SearchResults from "./SearchResults";
import dotenv from "dotenv";
dotenv.config();
// https://codesandbox.io/s/silly-albattani-yk9z4
// thanks to this guy for how to do forms with Material UI

// TODO: Types To Make
// a like quote result one
// a params one?

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
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    console.log(process.env.REACT_APP_API_BASE_URL);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/members`)
      // fetch("http://localhost:4000/members")
      .then((res) => res.json())
      .then((res) => setMembers(res));
    // have parameter for like top however many
    fetch(`${process.env.REACT_APP_API_BASE_URL}/quotees`)
      // fetch("http://localhost:4000/quotees")
      .then((res) => res.json())
      .then((res) => setQuotees(res));
  }, []);

  const initialValues = {
    keyword: "",
    member: null,
    quotee: null,
  };

  // or have values be any?
  const submit = (values: any) => {
    console.log("form submitted");
    // console.log({ values });
    setIsLoading(true);
    setSearched(true);
    console.log(values);
    const params: string = Object.entries(values)
      .filter(([key, val]) => val !== null && val !== "")
      .map(([key, val]) => `${key}=${val}`)
      .join("&");
    console.log(params);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/search?${params}`)
      // fetch(`http://localhost:4000/search?${params}`)
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
              </Stack>
              <Button variant="contained" type="submit">
                Search
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
