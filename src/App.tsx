import React, { Component } from 'react';
// React Router QuickStart: https://reacttraining.com/react-router/web/guides/quick-start
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import './App.css';
import './Components/SongBlock';
import SongBlock from './Components/SongBlock';
import songs from './songs';


class App extends Component {
  
  render() {
    var URISongName = decodeURI(window.location.pathname.substr(1));
    var songIndex = songs.findIndex(function(song) {
      return song.Title === URISongName;
    });
    console.log(URISongName);
    return (
      <div className="App">
        <h1>Song Bank</h1>
        <div className="LeftSideBar">
          <div className="SongSetListDisplay">
            <h2>Song Set</h2>
          
          </div>
          <div className="SongBankListDisplay">
            <h2>Song Bank List</h2>
            <ul>
              {songs.map((song) =>
                <li key={song.Title}><a href={song.Title} >{song.Title}</a></li>
              )}
            </ul>
          </div>
        </div>
        <div className="RightSideBar">
          <div className ="CurrentSongDisplay">
          <SongBlock song={songs[1]} />,
          </div>
        </div>
      </div>
    );
  }
}

export default App;
