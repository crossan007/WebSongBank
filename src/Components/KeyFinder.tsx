import React, { Component } from 'react';

interface KeyFinderProps {
    currentNote: string, 
    notesList:string[]
}

class KeyFinder extends React.Component<KeyFinderProps> {

        // The WebAudio API types are *interesting* to discover in TypeScript.  this helps: https://stackoverflow.com/questions/32797833/typescript-web-audio-api-missing-definitions

    noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    audioContext: AudioContext
    isPlaying: boolean
    analyser?: AnalyserNode
    rafID?: number
    buflen: number
    buf?: Float32Array
    currentNote: string

    constructor(props: KeyFinderProps) {
        super(props);
        this.audioContext = new AudioContext();
        this.buf = new Float32Array( this.buflen );
    }

    autoCorrelate = (buf: Float32Array, sampleRate: number ) => {
        var MIN_SAMPLES = 0; 
        var GOOD_ENOUGH_CORRELATION = 0.9;
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
                return sampleRate/(best_offset+(8*shift));
            }
            lastCorrelation = correlation;
        }
        if (best_correlation > 0.01) {
            // console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
            return sampleRate/best_offset;
        }
        return -1;
    //	var best_frequency = sampleRate/best_offset;
    }

    noteFromPitch = ( frequency: number) => {
        var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
        return Math.round( noteNum ) + 69;
    }

    updatePitch  = () => {
        var cycles = new Array;
        this.analyser.getFloatTimeDomainData( this.buf );
        var ac = this.autoCorrelate( this.buf, this.audioContext.sampleRate );
    
         if (ac == -1) {
            //detectorElem.className = "vague";
           
         } else {
             //detectorElem.className = "confident";
             var pitch = ac;
           
             var note =  this.noteFromPitch( pitch );
             console.log(this.noteStrings[note%12]);
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

    render() {
        return (
            <h1>Key Finder<button onClick={() => this.startListening()} >Start Listening</button>
            <button >Capture Current Note</button>
            <button >Clear captured note</button>
            <span id="currentNote">Note: {this.currentNote}</span>
            <ul>

            </ul>
            </h1>
        );
    }

}


export default KeyFinder