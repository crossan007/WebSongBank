import React, { Component } from 'react';
import Song from "../Interfaces/Song";

const SongBlock: React.FunctionComponent<{song:Song}> = ({song}) => {
    
    console.log(song);
    
    if (song === undefined) {
    return <div></div>;
    }
    const displayStyle = {display: 'inline-block'};
    const singleSong = (
    <div>
        <h2 key={song.Title}>{song.Title}</h2>
        <div style={displayStyle}>
        <p>CCLI: {song.CCLINumber}</p>
        <p>Links:</p>
        <ul>
            {
            song.Links.map((link) => 
            <li><a href="{link.URL}">{link.Title}</a></li>
            )}
        </ul>
        </div>
        <div style={displayStyle}>
        {
            song.SongKeys.map((SongKey) => 
            <div>
                <h3>Song Key: {SongKey.Key}</h3>
                Preferred by:
                <ul> 
                {
                SongKey.PreferredBy.map((PreferredBy) => 
                <li>{PreferredBy}</li>
                )}
                </ul>
                Key Links:
                <ul>
                {
                    SongKey.Links.map((link) => 
                    <li><a href="{link.URL}">{link.Title}</a></li>
                    )}
                </ul>
            </div>
            )}
        </div>
    </div>
    );

    return singleSong;
}


export default SongBlock