import React from 'react';
import ReactPlayer from 'react-player';
import debounce from 'lodash/debounce';
import BasePlayer from './BasePlayer.jsx';


/**
 * Each video/audio element has its own AVPlayer instance
 * that's always rendered on the page, and displayed when the
 * sequence's time is at the right position.
 */
export default class AVPlayer extends BasePlayer {
    constructor(props) {
        super(props);
        this.state = {duration: null};
        this.debouncedSeek = debounce(this.seekTo, 200, {
            leading: true,
            trailing: false
        });
    }
    render() {
        let url = this.props.data.source;
        if (this.props.data.host === 'youtube') {
            url = 'https://www.youtube.com/watch?v=' + this.props.data.source;
        }

        const volume = (this.props.hidden) ? 0 :
                       (this.props.data.volume / 100);

        // Start playing a few seconds before so everything is loaded in
        // time.
        const diff = this.props.data.start_time - this.props.time;
        const isAboutToPlay = diff > 0 && diff < 2;
        if (isAboutToPlay) {
            this.debouncedSeek(this.props.time / this.props.sequenceDuration);
        }
        const playing = isAboutToPlay ||
                        (!this.props.hidden && this.props.playing);

        return <ReactPlayer
                   ref={(ref) => this.player = ref}
                   width={480}
                   height={360}
                   url={url}
                   volume={volume}
                   hidden={this.props.hidden}
                   onDuration={this.onDuration.bind(this)}
                   onStart={this.onStart.bind(this)}
                   onPlay={this.onPlay.bind(this)}
                   playing={playing}
                   config={this.config}
               />;
    }
    pause() {
        if (this.player && this.player.player && this.player.player.pause) {
            this.player.player.pause();
        }
    }
    onDuration(duration) {
        this.setState({duration: duration});
    }
    onPlay() {
        if (!this.props.playing && !this.props.hidden) {
            this.pause();
        }
    }
    onStart() {
        const vid = this.props.data;
        if (vid.annotationStartTime && this.state.duration) {
            const percentage = vid.annotationStartTime / this.state.duration;
            this.player.seekTo(percentage);
        }
    }
    seekTo(percentage) {
        if (!this.player) {
            return;
        }

        const time = this.props.sequenceDuration * percentage;
        const e = this.props.data;
        const newPercentage = (
            time - e.start_time + (e.annotationStartTime || 0)
        ) / this.state.duration;

        // The percentage may be less than 0 if the selection starts
        // at point 0 of the video asset.
        // A value of 1 would mean the entire length of the video, so
        // ignore anything greater than 1.
        if (newPercentage > -1 && newPercentage <= 1) {
            this.player.seekTo(newPercentage);
        }
    }
}
