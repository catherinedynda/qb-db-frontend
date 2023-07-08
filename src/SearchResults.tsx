import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Collapse from "@mui/material/Collapse";
import Container from "@mui/material/Container";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "./SearchResults.css";
import dotenv from "dotenv";
dotenv.config();
// https://stackoverflow.com/questions/58953627/react-and-material-ui-how-can-i-expand-only-one-single-card
// for the expansion stuff

const processTime = (time: any) => {
  let date = new Date(time);
  return date.toLocaleString("en-US", { timeZone: "America/New_York" });
};

function SearchResults(props: any) {
  // TODO: page doesn't reset when there's new data...
  // possibly set page as a prop...? then the pagination is controlled by parent component
  const [expandedId, setExpandedId] = useState(-1);
  const [likes, setLikes] = useState([]);
  const [page, setPage] = useState(1);

  const itemsPerPage = 10;

  const headerString = btoa(
    `${process.env.AUTH_USERNAME}:${process.env.AUTH_PASSWORD}`
  );

  // figure out why it does it like that?
  props = props.props;
  const { loading, searched, data } = props;
  console.log(data);
  if (data.length) {
    console.log(typeof data.time);
  }

  const handlePageChange = (event: any, value: number) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleExpandClick = (id: number) => {
    console.log(id);
    setExpandedId(expandedId === id ? -1 : id);
    if (expandedId === -1) setLikes([]);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/likes?quote_id=${id}`, {
      headers: {
        Authorization: `Basic ${headerString}`,
      },
    })
      // fetch(`http://localhost:4000/likes?quote_id=${id}`)
      .then((res) => res.json())
      .then((res) => setLikes(res));
  };

  if (loading) {
    return (
      <Container>
        {/* TODO: add a spinny thing or something */}
        <p key={props.loading}>Loading...</p>
      </Container>
    );
  } else if (!searched) {
    return (
      <Container>
        <p>
          <em>Search results appear here</em>
        </p>
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
          <Pagination
            count={Math.ceil(data.length / 10)}
            page={page}
            onChange={handlePageChange}
          />
          {data
            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
            .map((quote: any) => {
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
                    <Typography variant="body1">{quote.quote_text}</Typography>
                    <Typography variant="caption" className="timestamp">
                      <em>{processTime(quote.time)}</em>
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing className="actions rightAlign">
                    <Button onClick={() => handleExpandClick(quote.quote_id)}>
                      <FavoriteIcon /> See likes
                    </Button>
                  </CardActions>
                  <Collapse in={expandedId === quote.quote_id}>
                    <CardContent>
                      <ul>
                        {likes.map((like: any) => {
                          return (
                            <li key={like.member_id}>{like.display_name}</li>
                          );
                        })}
                      </ul>
                    </CardContent>
                  </Collapse>
                </Card>
              );
            })}
          <Pagination
            count={Math.ceil(data.length / 10)}
            page={page}
            onChange={handlePageChange}
          />
        </div>
      </Container>
    );
  }
}

export default SearchResults;
