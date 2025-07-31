# MovieMeter 🎬

## Project Description

**MovieMeter** is an interactive web application that visualizes movie data, allowing users to explore the ten top-rated movies based on user reviews, and options to filter by genre if desired to personalize the view.

The application is based on a movie dataset that I sourced from [Kaggle](https://www.kaggle.com/datasets). A simplified Movie Database API, where users can retrieve information about movies, cast, and ratings. The dataset includes: metadata for 1,000 movies (titles, genres, release year, production data, descriptions etc.), user ratings, actors and more.

These files were used to populate a custom REST API that I have built as a backend, which serves the data to the frontend. As I had previously and recently built this API, I decided to use it as my backend for this project. Also, I find movie data to be fun and inspiring to use and work with.

The project aims to provide quick, visually appealing insight into which movies are most appreciated by other users. This is useful for users looking for movie recommendations or general entertainment insights.

## Core Technologies

- **Node.js** & **Express** – For the backend to serve data via a custom API. I had used it to build the API previously.
- **MongoDB** & **Mongoose**– I find it an intuitive, stable and reliable source to store, process and query data, using mongoose to interact with it.
- **Chart.js** – For rendering interactive bar charts. Decided to try it through recommendation from teachers and fellow students.
- **HTML/CSS/JavaScript** – For a basic application like this, I built the client interface using native web technologies.
- **Vite** – For smooth frontend development and module loading.
- **Helmet** – To help secure the application through setting HTTP headers.
- **Canva** – Used for creating the project logo. Fun, intuitive and creative tool with many options to enhance your projects.
- **Prettier** - For seamless code formatting to improve code readability throughout the project.

## How to Use

Upon visiting the application, a bar chart displaying the ten most highly rated movies in the database is presented to the user, along with a brief description. Hovering over a movie shows the average rating and the number of votes for the movie. The application is meant as an inspiration to anyone looking to explore a bunch of movies to find something to watch that other people have liked.

To further customize the experience, the user is able to filter movies by a genre that is appreciated or interesting.

A search field is visible but not yet functional. Future development aims to implement this, along with other additional features such as more filters, charts etc. related to movies.

## Link to the Deployed Application

The application can be accessed here:
**[https://wt2-moviemeter.onrender.com/](https://wt2-moviemeter.onrender.com/)**

## Additional features

I have implemented all of the mandatory requirements for the assignment.

## Acknowledgements

I want to thank the teachers and fellow students for inspiration and helpful tips.
Besides the course material, ChatGPT, Stack Overflow, YouTube tutorials and W3Schools have also been helpful in inspiring and guiding my work forward, along with tutorials on the techniques I used to solve the assignment.
