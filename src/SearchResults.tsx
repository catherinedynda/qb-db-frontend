import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Collapse from "@mui/material/Collapse";
import Container from "@mui/material/Container";
import "./SearchResults.css";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Button from "@mui/material/Button";
import dotenv from "dotenv";
dotenv.config();

function SearchResults(props: any) {
    const [expandedId, setExpandedId] = useState(-1);
    const [likes, setLikes] = useState([]);

    const handleExpandClick = (id: number) => {
        console.log(id);
        setExpandedId(expandedId === id ? -1 : id);
        if (expandedId === -1) setLikes([]);
        fetch(`${process.env.REACT_APP_API_BASE_URL}/likes?quote_id=${id}`)
            .then((res) => res.json())
            .then((res) => setLikes(res));
    };

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
            // also like at least for desktop two in a row? just figure out how to do responsive stuff lol
            <Container>
                {/* TODO: we probably want some kind of custom data display component here in a list. figure that out later.
                idea: style the whole thing after groupme? */}
                <div>
                    <p>{data.length} results</p>
                    {data.map((quote: any) => {
                        return (
                            <Card
                                variant="outlined"
                                className="results"
                                key={quote.quote_id}
                                // style={{ backgroundColor: "lightgray" }}
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
                                <CardActions
                                    disableSpacing
                                    className="actions rightAlign"
                                >
                                    <Button
                                        onClick={() =>
                                            handleExpandClick(quote.quote_id)
                                        }
                                    >
                                        <FavoriteIcon /> See likes
                                    </Button>
                                </CardActions>
                                <Collapse in={expandedId === quote.quote_id}>
                                    <CardContent>
                                        {/* <Typography variant="body2">
                                            Likes go here
                                        </Typography> */}
                                        <ul>
                                            {likes.map((like: any) => {
                                                return (
                                                    <li key={like.member_id}>
                                                        {like.display_name}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </CardContent>
                                </Collapse>
                            </Card>
                        );
                    })}
                </div>
            </Container>
        );
    }
}

export default SearchResults;
