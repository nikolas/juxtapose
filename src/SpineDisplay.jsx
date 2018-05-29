import React from 'react';
import ReactPlayer from 'react-player';
import BasePlayer from './BasePlayer.jsx';
import {createCollectionWidget} from './mediathreadCollection.js';
import {editAnnotationWidget} from './mediathreadCollection.js';
import {decodeQuotes} from './utils.js';

export default class SpineDisplay extends BasePlayer {
    constructor(props) {
        super(props);
        this.id = 'jux-spine-video';
    }
    render() {
        if (!this.props.spineVid) {
            const instructions = decodeQuotes(this.props.instructions);
            return <div className="jux-spine-display">
              <div className="help-text">
              <button className="add-spine" onClick={this.onClickReviseSpine}></button>
              <h1>Add a primary video</h1>
              <p className="instructions">{instructions}</p>
              </div>
            </div>;
        }

        let url = null;
        if (this.props.spineVid.host === 'youtube') {
            url = 'https://www.youtube.com/watch?v=' +
                  this.props.spineVid.url;
        } else {
            url = this.props.spineVid.url;
        }

        let spineVolume = 80;
        if (this.props.spineVid) {
            spineVolume = this.props.spineVid.volume;
        }

        let spineControls = '';
        if (!this.props.readOnly) {
            let volumeIcon = <span className="glyphicon glyphicon-volume-up"
                                aria-hidden="true"></span>;
            if (spineVolume === 0) {
                volumeIcon = <span className="glyphicon glyphicon-volume-off"
                                aria-hidden="true"></span>;
            } else if (spineVolume <= 50) {
                volumeIcon = <span className="glyphicon glyphicon-volume-down"
                                aria-hidden="true"></span>;
            }
            spineControls =
                <div className="jux-spine-controls">
                    <button className="btn btn-default jux-spine-revise"
                            title="Revise primary video"
                            onClick={this.onClickReviseSpine}>
                        <span className="glyphicon glyphicon-refresh"
                              aria-hidden="true"></span>
                    </button>
                    <button className="btn btn-default jux-spine-edit"
                            title="Edit primary video"
                            onClick={this.onClickEditSpine.bind(this)}>
                        <span className="glyphicon glyphicon-pencil"
                              aria-hidden="true"></span>
                    </button>
                    <button className="btn btn-default jux-spine-vol-display"
                            title="Toggle volume"
                            onClick={this.onVolumeToggle.bind(this)}>
                        {volumeIcon}
                    </button>
                    <input type="range" min="0" max="100"
                           className="jux-spine-vol-input"
                           value={spineVolume}
                           onChange={this.onVolumeChange.bind(this)} />
                </div>;
        }

        const volume = this.props.spineVid.volume / 100;

        return <div className="jux-spine-display">
                <ReactPlayer
                    id={this.id}
                    ref={(c) => this.player = c}
                    width={480}
                    height={360}
                    volume={volume}
                    playing={this.props.playing}
                    onEnded={this.props.onEnded}
                    url={url}
                    onStart={this.onStart.bind(this)}
                    onDuration={this.props.onDuration}
                    onProgress={this.props.onProgress}
                    onPlay={this.props.onPlay}
                    onPause={this.props.onPause}
                    config={this.config}
                />
                {spineControls}
        </div>;
    }
    onStart() {
        if (this.props.spineVid.annotationStartTime && this.props.duration) {
            const percentage = this.props.spineVid.annotationStartTime /
                this.props.duration;
            this.player.seekTo(percentage);
        }
    }
    onClickReviseSpine() {
        let caller = {
            'type': 'spine',
            'timecode': 0
        };
        createCollectionWidget('video', true, caller);
    }
    onClickEditSpine() {
        let caller = {
            'type': 'spine',
        };
        editAnnotationWidget(
            this.props.spineVid.assetId,
            this.props.spineVid.annotationId,
            this.props.spineVid.annotationDuration === undefined,
            caller);
    }
    onVolumeChange(e) {
        const volume = parseInt(e.target.value, 10);
        this.props.onVolumeChange(volume);
    }
    onVolumeToggle() {
        this.props.onVolumeToggle();
    }
}
