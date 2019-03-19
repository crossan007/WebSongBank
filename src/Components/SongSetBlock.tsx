import React, { Component } from 'react';
import Song from "../Interfaces/Song";
import SongSet from "../Interfaces/SongSet";



const SongSetBlock: React.FunctionComponent<{SongSets:SongSet[]}> = ({SongSets}) => {
    
    console.log(SongSets);
    
    if (SongSets === undefined) {
    return <div></div>;
    }
    const displayStyle = {display: 'inline-block'};
    const singleSong = (
        <ul className="nav">
            {
            SongSets.map((SongSet) => 
            <li><a href="{SongSet.Title}">{SongSet.Title}</a></li>
            )}
        </ul>
    );

    return singleSong;
}


export default SongSetBlock