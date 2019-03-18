import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import './App.css';
import './Components/SongBlock';
import SongBlock from './Components/SongBlock';



const songs = [ 
  {
    Title: "Test song",
    Authors: [
      "Bethel",
    ],
    CCLINumber: "8675309",
    SongKeys: [
      {
        PreferredBy: [
          "Matt",
          "Dan"
        ],
        Key: "F",
        Links: [
          {
            URL: "http://LinkToTheSongInE",
            Title: "The Song in F"
          }
        ]
      },
      {
        PreferredBy: [
          "Michale",
        ],
        Key: "G",
        Links: [
            {
              URL: "http://LinkToTheSongInB",
              Title: "The Song in G"
            }
        ]

      }
    ],
    Links: [
        {
          URL: "http://Youtube",
          Title: "The original song"
        }
    ]
  },
  {
    Title: "The other simple test song",
    Authors: [
      "Bethel",
      "Matt maher",
      "The other Matt (Redmond)"
    ],
    CCLINumber: "8675309",
    SongKeys: [
      {
        PreferredBy: [
          "Anna",
          "Lindsey"
        ],
        Key: "E",
        Links: [
          {
            URL: "http://LinkToTheSongInE",
            Title: "The Song in E"
          }
        ]
      },
      {
        PreferredBy: [
          "Michale",
          "Matt",
          "Amanda"
        ],
        Key: "B",
        Links: [
            {
              URL: "http://LinkToTheSongInB",
              Title: "The Song in B"
            }
        ]

      }
    ],
    Links: [
        {
          URL: "http://Youtube",
          Title: "The original song"
        },
        {
          URL: "http://CCLI",
          Title: "SongSelect Link"
        },
        {
          URL: "http://Youtube",
          Title: "SomeAuthor'sHomePageWithAStory"
        }
    ]
  }
];

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
          <SongBlock song={songs[0]} />,
          </div>
        </div>
      </div>
    );
  }
}

export default App;
