import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import "./SearchResults.css";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

function SearchResults(props: any) {
    // figure out why it does it like that?
    props = props.props;
    const { loading, data } = props;
    console.log(data);
    if (data.length) {
        console.log(typeof data.time);
    }

    if (loading) {
        return (
            <Container>
                {/* TODO: add a spinny thing or something */}
                <p key={props.loading}>Loading...</p>
            </Container>
        );
    } else {
        return (
            // OOOH implement paginated results?? bc sometimes there's a LOT lmao
            <Container>
                {/* TODO: we probably want some kind of custom data display component here in a list. figure that out later.
                idea: style the whole thing after groupme? */}
                <div>
                    <p>{data.length} results</p>
                    {data.map((quote: any) => {
                        // return <p className="results">{quote.quote_text}</p>;
                        return (
                            // <Paper
                            //     className="results"
                            //     key={quote.quote_id}
                            //     // elevation={3}
                            //     variant="outlined"
                            // >
                            //     {quote.quote_text}
                            // </Paper>
                            <Card
                                variant="outlined"
                                className="results"
                                key={quote.quote_id}
                                style={{ backgroundColor: "lightgray" }}
                            >
                                <CardHeader
                                    avatar={
                                        <Avatar>
                                            <img src={quote.avatar_image}></img>
                                        </Avatar>
                                    }
                                    title={quote.member_name}
                                />
                                <CardContent>
                                    <Typography variant="body1">
                                        {quote.quote_text}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        className="timestamp"
                                    >
                                        <em>{quote.time}</em>
                                    </Typography>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </Container>
        );
    }
}

export default SearchResults;
