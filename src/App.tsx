import React, { Component } from 'react';
// React Router QuickStart: https://reacttraining.com/react-router/web/guides/quick-start
import { BrowserRouter as Router, Route, Link, RouteProps, RouteComponentProps } from "react-router-dom";

import './App.css';
import './Components/SongBlock';
import SongBlock from './Components/SongBlock';
import Song from './Interfaces/Song';
import WebSongBankProps from "./Interfaces/WebSongBankProps"
import SongSetBlock from "./Components/SongSetBlock"
import WebSongBankState from "./Interfaces/WebSongBankState"

class App extends React.Component<WebSongBankProps, WebSongBankState> {

  constructor(props: WebSongBankProps) {
    super(props);

    this.state = {
      Songs: [],
      SongSets: [
      {
        Date: new Date(),
        Songs:[ 0 , 1],
        Title: "Test"
      },
      {
        Date: new Date(),
        Songs:[ 0 , 1],
        Title: "Test2"
      }
    ]
    }

  }

  componentDidMount() {
    fetch('/songs.json')
      .then(response => response.json())
      .then(data => {this.setState({Songs: data})});
  }

  render() {
    return (
      <Router>
        <div className="App">
          <div className="Header">
            <h1>Song Bank</h1>
          </div>
          <div className="LeftSideBar">
            <div className="SongSetListDisplay box">
              <SongSetBlock SongSets={this.state.SongSets}/>
            
            </div>
            <div className="SongBankListDisplay box">
              <h2>Song Bank List</h2>
              <ul>
                {this.state.Songs.map((song,  idx) =>
                  <li key={idx}>
                   <Link to={"/"+idx}  >{idx}: {song.Title}</Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="RightSideBar">
            <div className ="CurrentSongDisplay box">
              <Route path="/:id" render={(props)=>{
                if (this.state.Songs.length >0 ){ 
                  return <h1>{this.state.Songs[props.match.params.id].Title}</h1>
                 }
                 else {
                  return <h1>asdf</h1>
                 }
              }}/>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
