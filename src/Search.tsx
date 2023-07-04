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

// function SearchForm() {

// }

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
    const [data, setData] = useState([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [quotees, setQuotees] = useState<Quotee[]>([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        fetch("http://localhost:4000/members")
            .then((res) => res.json())
            .then((res) => setMembers(res));
        // have parameter for like top however many
        fetch("http://localhost:4000/quotees")
            .then((res) => res.json())
            .then((res) => setQuotees(res));
    }, []);

    const initialValues = {
        keyword: "",
        member: null,
        quotee: null,
    };

    // or have values be any?
    const submit = (values: object) => {
        console.log("form submitted");
        console.log({ values });
        setIsLoading(true);
        fetch("http://localhost:4000/search")
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
                                <InputLabel htmlFor="search-keyword">
                                    Keyword
                                </InputLabel>
                                <Input
                                    id="search-keyword"
                                    name="keyword"
                                    className="search-input"
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
                                            value !== null
                                                ? value
                                                : initialValues.member
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
                                            value !== null
                                                ? value
                                                : initialValues.quotee
                                        );
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            name="quotee"
                                            label="Quotee"
                                        />
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
                {/* <Container id="search-results">
                    <p>{if (loading) return "Loading..."
                    else return data}</p>
                    if (loading) <p>Loading...</p>
                    else <p>{data}</p>
                </Container> */}
            </Container>
        );
    }
}

export default Search;
