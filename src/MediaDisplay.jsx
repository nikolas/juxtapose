import React from 'react';
import ReactPlayer from 'react-player'

/**
 * Derive the currently playing item given the current time
 * and the track state.
 */
export function getCurrentItem(data, currentTime) {
    for (let e of data) {
        if (currentTime >= e.start_time && currentTime <= e.end_time) {
            return e;
        }
    }
    return null;
}


export default class MediaDisplay extends React.Component {
    constructor(props) {
        super(props)
        this.className = 'jux-media-video';
    }
    renderVideo(data) {
        let url = null;
        if (data.host === 'youtube') {
            url = 'https://www.youtube.com/watch?v=' + data.source;
        } else if (data.host === 'vimeo') {
            url = 'https://www.vimeo.com/watch?v=' + data.source;
        } else {
            url = data.source;
        }

        return <ReactPlayer
            id={this.id}
            ref={(ref) => this.player = ref}
            width={480}
            height={360}
            playing={this.props.playing}
            url={url}
            onDuration={this.props.onDuration}
            onProgress={this.props.onProgress}
            progressFrequency={100}
        />;
    }
    renderImage(data) {
        return <img src={data.source} />;
    }
    nowDisplay(data, currentTime) {
        const e = getCurrentItem(data, currentTime);
        if (e && e.type === 'vid') {
            return this.renderVideo(e);
        } else if (e && e.type === 'img') {
            return this.renderImage(e);
        }
        return '';
    }
    render() {
        if (this.props.data.length < 1) {
            return <div className="jux-media-display">
              <div className="help-text">
                  <h1>Place secondary elements</h1>
                  <p className="instructions">
                      Click the tracks below to add<br />
                      <span className="media-track-icon"></span>
                      media and
                      <span className="text-track-icon"></span>
                      text elements.
                      <br />
                      There must be at least one media or text element
                      in order for this response to be submitted.
                      <br /><br />
                      {this.props.instructions}
                  </p>
              </div>
            </div>;
        }

        let c = this.nowDisplay(this.props.data, this.props.time);
        return <div className="jux-media-display">{c}</div>;
    }
    updateVidPosition(percentage) {
        const time = this.props.duration * percentage;
        const e = getCurrentItem(this.props.data, time);
        if (this.player && e && e.type === 'vid') {
            const newPercentage = (time - e.start_time) / this.props.duration;
            this.player.seekTo(newPercentage);
        }
    }
}
