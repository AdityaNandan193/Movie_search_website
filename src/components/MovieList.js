import React from "react";
import MovieCard from "./MovieCard";

const MovieList = ({ movies }) => {
  return (
    <div className="container">
      <div className="row">
        {movies.map((m) => (
          <div className="col-3" key={m.imdbID}>
            <MovieCard movie={m} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
