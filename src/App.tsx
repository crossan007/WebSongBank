
import React, { Component } from 'react';
// React Router QuickStart: https://reacttraining.com/react-router/web/guides/quick-start
import { BrowserRouter as Router, Route, Link, RouteProps, RouteComponentProps } from "react-router-dom";

import './App.css';
import './Components/SongBlock';
import SongBlock from './Components/SongBlock';
import Song from './Interfaces/Song';
import SongSet from "./Interfaces/SongSet";
import SongSetBlock from "./Components/SongSetBlock"
import { Dispatch, bindActionCreators} from 'redux';
import * as songActions from "./redux/actions/songActions";
import { connect } from "react-redux";

import AppState from "./Interfaces/AppState";

interface WebSongBankProps {
  actions: any
  Songs: Song[]
  SongSets: any
}


class App extends React.Component<WebSongBankProps>{

  componentDidMount() {
    const {Songs, SongSets, actions } = this.props;
    console.log("loading songs");
    if (Songs.length === 0) {
      console.log(actions);
      actions.loadSongs().catch( (error:any) => {
        alert("Loading Songs failed" + error);
      });
    }


  }

  render() {
    const {Songs, SongSets } = this.props;
    console.log(this.props);
    const songList = Songs === undefined || Songs.length === 0 ? (<div/>) : (
      <ul> {
        Songs.map((song,  idx) =>
        <li key={idx}>
          <Link to={String(idx)}  >{idx}: {song.Title}</Link>
        </li>
        )} 
      </ul>
    )

    return (
      <div className="App">
        <div className="Header">
          <h1>Song Bank</h1>
        </div>
        <div className="LeftSideBar">
          <div className="SongSetListDisplay box">
            <SongSetBlock SongSets={SongSets}/>
          
          </div>
          <div className="SongBankListDisplay box">
            <h2>Song Bank List</h2>
              { songList }
          </div>
        </div>
        <div className="RightSideBar">
          <div className ="CurrentSongDisplay box">
            <Route path="/:id" render={(props)=>{
              if (Songs.length >0 && Songs[props.match.params.id] != undefined){ 
                return <h1>{Songs[props.match.params.id].Title}</h1>
                }
                else {
                return <h1>asdf</h1>
                }
            }}/>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: AppState)  {
  return {
    Songs: state.Songs,
    SongSets: state.SongSets
  }
}

function mapDispatchToProps(dispatch:Dispatch) {
  return {
    actions: {
      loadSongs: bindActionCreators(songActions.loadSongs, dispatch),
    }
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(App);
