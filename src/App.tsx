import React, { Component } from 'react';
// React Router QuickStart: https://reacttraining.com/react-router/web/guides/quick-start
import { BrowserRouter as Router, Route, Link, RouteProps, RouteComponentProps } from "react-router-dom";

import './App.css';
import './Components/SongBlock';
import SongBlock from './Components/SongBlock';
import songs from './songs';

function  Child( match: RouteComponentProps ) {
  let mparams = match.match.params as any;
  console.log(mparams["id"]);
  return (
     <SongBlock song={songs[mparams["id"]]} />
  );
}


class App extends Component {
  render() {

    return (
      <Router>
        <div className="App">
          <div className="Header">
            <h1>Song Bank</h1>
          </div>
          <div className="LeftSideBar">
            <div className="SongSetListDisplay box">
              <h2>Song Set</h2>
            
            </div>
            <div className="SongBankListDisplay box">
              <h2>Song Bank List</h2>
              <ul>
                {songs.map((song,  idx) =>
                  <li key={idx}>
                   <Link to={"/"+idx}  >{idx}: {song.Title}</Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="RightSideBar">
            <div className ="CurrentSongDisplay box">
              <Route path="/:id" component={Child} />
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
