# City Select

### What is it?
A city review site that helps users better plan their next vacation or move.

Check it out [here](https://city-select.herokuapp.com/)! (Note: the site is hosted for free on Heroku so it may take a few seconds to restart after a period of inactivity)
 
### User stories
- Unaccustomed users are greeted by a landing page that gives a short explanation of the website and a link to view all the cities
- Travelers can quickly check different cities to learn more about it and see if there are comments about good places to visit
- Travelers can share hot tips about where to stay, what to see, and what to do
- Residents can let others know what it's like to live in a city or area
- Relocators can check up on various cities to see what would be the best fit for them, based on a general description and other users' comments
- Users can sign-up for an account in order to post, edit, and delete comments and city pages
- Flash message inform users of the required authentication or authorization for editing content

### Technologies Used
Primarily made with MongoDB, Express.js, and Node.js (MEN stack).

I also make use of npm, ejs, mongoose, a modular file structure, and RESTful routing.

Passport, passport-local, and passport-local-mongoose handle the authentication and authorization.

The web app is run through Heroku and the database is hosted on mLab.

### To-do
* ~~Refactor the code with ES6 syntax~~
* ~~Deploy the app~~
* ~~Repopulate the database (now hosted on mLab instead of locally)~~
* add API to show city-relevant data on the city show page (weather, climate, tripadvisor recommendations, cost of living,  etc.)
* add google map API
* add a rating system for the cities
* ~~optimize landing page image for viewport size~~

![screenshot of the landing page](https://github.com/gvenezia/myWebsite/blob/master/images/citySelect.png)
