import React, { Component } from 'react';
import { KMeans } from 'machinelearn/cluster';
import {KNeighborsClassifier} from 'machinelearn/neighbors';
import { number } from 'prop-types';

interface KeyFinderProps {
    notesList?:string[]
}

interface KeyFinderState {
    pitch: number,
    currentNote: string, 
    centsOff: number,
    detuneDirection: string,
    notesList:string[]
}

class KeyFinder extends React.Component<KeyFinderProps,KeyFinderState> {

    // The WebAudio API types are *interesting* to discover in TypeScript.  this helps: https://stackoverflow.com/questions/32797833/typescript-web-audio-api-missing-definitions

    noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    audioContext: AudioContext
    isPlaying: boolean
    analyser?: AnalyserNode
    rafID?: number
    buflen: number
    buf?: Float32Array
    previousPitches: Float32Array
    previousPitchSequence: number

    constructor(props: KeyFinderProps) {
        super(props);
        this.audioContext = new AudioContext();
        this.buflen = 256; 
        this.buf = new Float32Array( this.buflen );
        this.state = {
            pitch: 0,
            currentNote: "",
            centsOff: 0,
            detuneDirection: "",
            notesList: [""]

        }
    }

    FrequencyFromBuffer = (buf: Float32Array, sampleRate: number ) => {
        var MIN_SAMPLES = 0; 
        var GOOD_ENOUGH_CORRELATION = 0.99;
        var SIZE = buf.length;
        var MAX_SAMPLES = Math.floor(SIZE/2);
        var best_offset = -1;
        var best_correlation = 0;
        var rms = 0;
        var foundGoodCorrelation = false;
        var correlations = new Array(MAX_SAMPLES);
    
        for (var i=0;i<SIZE;i++) {
            var val = buf[i];
            rms += val*val;
        }
        rms = Math.sqrt(rms/SIZE);
        if (rms<0.01) // not enough signal
            return -1;
    
        var lastCorrelation=1;
        for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
            var correlation = 0;
    
            for (var i=0; i<MAX_SAMPLES; i++) {
                correlation += Math.abs((buf[i])-(buf[i+offset]));
            }
            correlation = 1 - (correlation/MAX_SAMPLES);
            correlations[offset] = correlation; // store it, for the tweaking we need to do below.
            if ((correlation>GOOD_ENOUGH_CORRELATION) && (correlation > lastCorrelation)) {
                foundGoodCorrelation = true;
                if (correlation > best_correlation) {
                    best_correlation = correlation;
                    best_offset = offset;
                }
            } else if (foundGoodCorrelation) {
                // short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
                // Now we need to tweak the offset - by interpolating between the values to the left and right of the
                // best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
                // we need to do a curve fit on correlations[] around best_offset in order to better determine precise
                // (anti-aliased) offset.
    
                // we know best_offset >=1, 
                // since foundGoodCorrelation cannot go to true until the second pass (offset=1), and 
                // we can't drop into this clause until the following pass (else if).
                var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];  
                console.log("f1 = " + sampleRate/(best_offset+(8*shift)) + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
                return sampleRate/(best_offset+(8*shift));
            }
            lastCorrelation = correlation;
        }
        if (best_correlation > 0.01) {
            console.log("f2 = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
            return sampleRate/best_offset;
        }
        return -1;
    //	var best_frequency = sampleRate/best_offset;
    }

    noteFromPitch = ( frequency: number) : number=> {
        var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
        return Math.round( noteNum ) + 69;
    }

    frequencyFromNoteNumber = ( note:number ) : number=> {
        return 440 * Math.pow(2,(note-69)/12);
    }

    centsOffFromPitch = ( frequency: number, note:number ) : number => {
        return Math.floor( 1200 * Math.log( frequency / this.frequencyFromNoteNumber( note ))/Math.log(2) );
    }

    getSmoothedPitch  = (newPitch:number) => {
        var smoothingBufferLength = 20
        if (this.previousPitches == undefined || newPitch == -1) {
            this.previousPitches = new Float32Array(smoothingBufferLength);
            this.previousPitchSequence = 0;
        }
        if (newPitch == -1)
        {
            return -1;
        }
        this.previousPitches[this.previousPitchSequence%smoothingBufferLength] = newPitch
        this.previousPitchSequence ++;
        var averagePitch = 0;
        for (var i=0;i<smoothingBufferLength;i++) {
            averagePitch+=this.previousPitches[i];
        }
        return averagePitch/smoothingBufferLength;

    }
    

    updatePitch  = () => {
        var cycles = new Array;
        this.analyser.getFloatTimeDomainData( this.buf );
        var ac = this.getSmoothedPitch(this.FrequencyFromBuffer( this.buf, this.audioContext.sampleRate ));
    
         if (ac == -1) {
            //detectorElem.className = "vague";
            this.setState({currentNote:"?"})
           
         } else {
             //detectorElem.className = "confident";
             var pitch = ac;
             var note =  this.noteFromPitch( pitch );
             var detune = this.centsOffFromPitch( pitch, note );
             this.setState(
                 {
                     pitch: pitch,
                     currentNote: this.noteStrings[note%12],
                     centsOff: detune,
                     detuneDirection: (detune < 0 ? "flat": "sharp")
                })
        }
    
        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = window.webkitRequestAnimationFrame;
        this.rafID = window.requestAnimationFrame( this.updatePitch );
    }

    gotStream = (stream: MediaStream )  => {
        // Create an AudioNode from the stream.
        var mediaStreamSource = this.audioContext.createMediaStreamSource(stream);
    
        // Connect it to the destination.
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        mediaStreamSource.connect( this.analyser );
        this.updatePitch();
    }

    getUserMedia = (dictionary: any, callback: (stream:any) => void ) => {
        try {
            navigator.getUserMedia(dictionary, callback, () =>  {alert('Stream generation failed.');});
        } catch (e) {
            alert('getUserMedia threw exception :' + e);
        }
    }

    toggleLiveInput = () => {
        this.audioContext = new AudioContext();
        if (this.isPlaying) {
            //stop playing and return
            this.analyser = null;
            this.isPlaying = false;
            if (!window.cancelAnimationFrame)
                window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
            window.cancelAnimationFrame( this.rafID );
        }
        this.getUserMedia(
            {
                "audio": {
                    "mandatory": {
                        "googEchoCancellation": "false",
                        "googAutoGainControl": "false",
                        "googNoiseSuppression": "false",
                        "googHighpassFilter": "false"
                    },
                    "optional": []
                },
            }, this.gotStream);
    }
    

    startListening = () => {
        this.toggleLiveInput();
    }

    captureCurrentNote = () => {
        var joined = this.state.notesList.concat(this.state.currentNote);
        this.setState({ 
            notesList: joined
        });
    }

    notesToArray(incomingArray: string[]) { 
        let returnArray:number[] = new Array(12);
        returnArray.fill(0,0,12)
        this.noteStrings.map((note,index) => { 
            if (incomingArray.includes(note)){
                returnArray[index]=1
            }
        } ) 
        return returnArray;
    }


    predict_key(Notes: string[]) {
        // we need an array of 12 keys - one for each key signatiure
        // each member array will contain 12 values (1) or (0) 
        // in the index representing 
        // the presence or absence of the note in the key
        // scales pulled from https://www.pianoscales.org/major.html
        // https://www.studybass.com/lessons/harmony/keys-in-music/
        //  [C, C#,D, D#,E ,F ,F#,G ,G#,A ,A#,B]
        const KeySignatures = [
            // key of C
            this.notesToArray(["C", "D", "E", "F", "G", "A", "B"]),
            // key of D
            this.notesToArray(["D", "E", "F#", "G", "A", "B", "C#"]),
            // key of E
            this.notesToArray(["E"," F#"," G#"," A"," B"," C#"," D#"]),
            // key of F
            this.notesToArray(["F"," G"," A"," Bb"," C"," D", "E"]),
            /// Key of G
            this.notesToArray(["G","A","B","C","D","E", "F#"]),
            // A
            this.notesToArray(["A","B","C#","D","E"," F#"," G#", "A" ]),
            // B
            this.notesToArray(["B","C#","D#","E","F#","G#","A#", "B"]),
            // c#
            this.notesToArray(["Db","Eb","F","Gb","Ab","Bb","C", "Db"]),
            // d#
            this.notesToArray(["Eb","F","G","Ab","Bb","C","D", "Eb"]),
            // F#
            this.notesToArray(["F#","G#","A#","B","C#","D#","F", "F#"]),
            // G#
            this.notesToArray(["Ab","Bb","C","Db","Eb","F","G", "Ab"]),
            //A#
            this.notesToArray(["Bb","C","D","Eb","F","G","A", "Bb"])


        ];
        const TrainingKeys = [
            "C",
            "D",
            "E",
            "F",
            "G",
            "A",
            "B",
            "C#",
            "D#",
            "F#",
            "G#",
            "A#"

        ]
    
        const incoming = this.notesToArray(Notes);//["D", "E", "F#", "G", "A", "B", "C#"]);
        let keyMatches:number[] = new Array(12);
        keyMatches.fill(0,0,12)
        
        KeySignatures.map((keySignature,ksindex) => {
            keySignature.map((note,keynoteindex) => {
                keyMatches[ksindex] += note * incoming[keynoteindex];
            });
        })
        if (Math.max(...keyMatches) >3 ) {
            console.log(keyMatches);
            var ksMatch = this.noteStrings[keyMatches.indexOf(Math.max(...keyMatches))];
            console.log(ksMatch);
            return ksMatch;
        }
        return "";
    }

    clearNotes = () => {
        var joined = new Array();
        this.setState({ 
            notesList: joined
        });
    }

    render() {
        
        return (
        <div>
            <h1>Key Finder</h1><button onClick={() => this.startListening()} >Start Listening</button>
            <button onClick={() => this.captureCurrentNote()}>Capture Current Note</button>
            <button onClick={() => this.clearNotes()}>Clear captured note</button>
            <br/>
            <span id="">Current pitch: {this.state.pitch}</span><br/>
            <span id="">Current Note: {this.state.currentNote}</span><br/>
            <span id="">Detune Direction: {this.state.detuneDirection}</span><br/>
            <span id="">Cents off: {this.state.centsOff}</span><br/>
            <div id="detuneVisualBox">
                <span id="detuneVisualMarker" style={{left:this.state.centsOff+50}}>|</span>
            </div>
            <span id="">Current predicted key: {this.predict_key(this.state.notesList)}</span>
            <br/>
            <span>Captured notes:</span>
            <ul className = "notesList">
                {
                this.state.notesList.map((note) => 
                <li>{note}</li>
                )}
            </ul>
        </div>
        );
    }

}


export default KeyFinder