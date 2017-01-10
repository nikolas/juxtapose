import React from 'react';
import ReactPlayer from 'react-player';
import BasePlayer from './BasePlayer.jsx';
import {createCollectionWidget} from './mediathreadCollection.js';
import {editAnnotationWidget} from './mediathreadCollection.js';

export default class SpineDisplay extends BasePlayer {
    constructor(props) {
        super(props);
        this.id = 'jux-spine-video';
    }
    render() {
        if (!this.props.spineVid) {
            return <div className="jux-spine-display">
              <div className="help-text">
              <button className="add-spine" onClick={this.onClickReviseSpine}></button>
              <h1>Add a primary video</h1>
              <p className="instructions">{this.props.instructions}</p>
              </div>
            </div>;
        }

        let url = null;
        if (this.props.spineVid.host === 'youtube') {
            url = 'https://www.youtube.com/watch?v=' +
                  this.props.spineVid.url;
        } else if (this.props.spineVid.host === 'vimeo') {
            url = 'https://www.vimeo.com/watch?v=' + this.props.spineVid.url;
        } else {
            url = this.props.spineVid.url;
        }

        let reviseButton = '';
        let editSpineButton = '';
        if (!this.props.readOnly) {
            reviseButton =
                <button className="btn btn-default jux-spine-revise"
                        title="Revise primary video"
                        onClick={this.onClickReviseSpine}>
                <span className="glyphicon glyphicon-refresh"
                    aria-hidden="true"></span>
                </button>;
            editSpineButton =
                <button className="btn btn-default jux-spine-edit"
                        title="Edit primary video"
                        onClick={this.onClickEditSpine.bind(this)}>
                <span className="glyphicon glyphicon-pencil"
                    aria-hidden="true"></span>
                </button>;
        }

        return <div className="jux-spine-display">
                <ReactPlayer
                    id={this.id}
                    ref={(ref) => this.player = ref}
                    width={480}
                    height={360}
                    playing={this.props.playing}
                    onEnded={this.props.onEnded}
                    url={url}
                    onStart={this.onStart.bind(this)}
                    onDuration={this.props.onDuration}
                    onProgress={this.props.onProgress}
                    onPlay={this.props.onPlay}
                    onPause={this.props.onPause}
                    progressFrequency={50}
                    youtubeConfig={this.youtubeConfig}
                    vimeoConfig={this.vimeoConfig}
                />
                {reviseButton}
                {editSpineButton}
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
    onClickEditSpine(e) {
        let caller = {
            'type': 'spine',
        };
        editAnnotationWidget(
            this.props.spineVid.assetId,
            this.props.spineVid.annotationId,
            this.props.spineVid.annotationDuration === undefined,
            caller);
    }
}
