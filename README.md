# IO Quote Board Frontend

This is the front end for searching the IO Quote Board database. Very much in progress.

This project made using Create React App and Material UI mostly.

# To Run

Make sure the backend is running. Also have the right URLs for it in the frontend (currently they're just localhost addresses that are manually typed in). Run `npm start` in the root folder. It should go.

# Roadmap

-   [ ] Hook up to running actual searches

    -   [x] Fix whatever's going on w/ displaying the data and having different components linked
    -   [x] Loading state
    -   [ ] Error state?
    -   [ ] Don't show 0 results on initial load

-   [x] Pagination for fetched quotes
-   [ ] Make display for fetched quotes
    -   [x] Basic display
    -   [x] Correctly sized avatar
    -   [ ] Show EST timezone on timestamps?
    -   [ ] Button to click that will fetch likes for that message
        -   [x] Show likes
        -   [ ] Fix likes display and alignment
-   [ ] Complete desired parts of form
    -   [ ] Date picker (from date to date?)
    -   [ ] More thorough and/or of different elements?
-   [ ] Think more about design
    -   [ ] Fix stuff running into each other, make it more of a responsive grid?
    -   [ ] Make pagination nicer
-   [ ] Make stats area? Separate page of app?
