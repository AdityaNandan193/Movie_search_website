import React, { useState } from "react";

const Header = ({ setMovies }) => {
  const [searchText, setSearchText] = useState("");

  const changeHandler = (e) => {
    setSearchText(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!searchText) return;

    const url = `https://omdbapi.com?apikey=30d67521&s=${searchText}`;
    fetch(url)
      .then((resp) => resp.json())
      .then((data) => setMovies(data.Search));
  };

  return (
    <div className="alert alert-primary">
      <div className="container">
        <div className="row">
          <div className="col-4">
            <h3>Movie Search</h3>
          </div>
          <div className="col-8">
            <form onSubmit={submitHandler}>
              <input
                autoFocus
                className="form-control"
                type="search"
                placeholder="what movie are you looking for?"
                value={searchText}
                onChange={changeHandler}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
