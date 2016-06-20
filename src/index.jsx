import React from 'react';
import ReactDOM from 'react-dom';

function pad2(number) {
    return (number < 10 ? '0' : '') + number;
}

function formatDuration(seconds) {
    var minutes = pad2(Math.floor(seconds / 60));
    var seconds = pad2(Math.round(seconds - minutes * 60));
    return minutes + ':' + seconds;
}

class SpineVideo extends React.Component {
    constructor() {
        super();
        this.id = 'jux-spine-video';
        this.state = {duration: null, time: null};
    }
    render() {
        return <div>
            <video id={this.id}
                   ref={(ref) => this.el = ref}
                   width="297"
                   onTimeUpdate={this.handleTimeUpdate.bind(this)}
                   onLoadedMetadata={this.handleLoadedMetadata.bind(this)}
            >
                <source src="wildspot.mp4" type="video/mp4" />
                <source src="wildspot.ogv"
                        type='video/ogg; codecs="theora, vorbis"' />
            </video>
        </div>;
    }
    updateVidPosition(time) {
        this.el.currentTime = time;
    }
    handleLoadedMetadata(e) {
        var vid = e.target;
        this.setState({time: vid.currentTime, duration: vid.duration});
        this.props.callbackParent(vid.currentTime, vid.duration);
    }
    handleTimeUpdate(e) {
        var vid = e.target;
        this.setState({time: vid.currentTime, duration: this.state.duration});
        this.props.callbackParent(vid.currentTime, this.state.duration);
    }
    play() {
        var vid = this.el;
        this.setState({time: vid.currentTime, duration: vid.duration});
        vid.play();
    }
    pause() {
        this.el.pause();
    }
}

class AuxMedia extends React.Component {
    constructor() {
        super()
        this.id = 'jux-aux-video';
        this.state = {};
    }
    render() {
        return <div>
            <video id={this.id}
                   ref={(ref) => this.el = ref}
                   width="297">
                <source src="wildspot.mp4" type="video/mp4" />
                <source src="wildspot.ogv"
                        type='video/ogg; codecs="theora, vorbis"' />
            </video>
        </div>;
    }
    componentDidMount() {
        var vid = this.el;
        vid.currentTime = 5.333;
    }
    play() {
        this.el.play();
    }
    pause() {
        this.el.pause();
    }
}

class PlayButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {play: false};
    }
    handleClick(event) {
        var newState = !this.state.play;
        this.setState({play: newState});
        this.props.callbackParent(newState);
    }
    render() {
        return <button className="jux-play"
                       onClick={this.handleClick.bind(this)}>
            {this.state.play ?
             String.fromCharCode(9208) :
             String.fromCharCode(9654) }
        </button>;
    }
}

class SpineTrack extends React.Component {
    render() {
        return <div className="jux-track">Spine Track</div>;
    }
}

class AuxTrack extends React.Component {
    render() {
        return <div className="jux-track"
                    ref={(ref) => this.el = ref}
                    onClick={this.openPopup.bind(this)}>
            <div className="jux-popup"
                 ref={(ref) => this.popupEl = ref}>
                Mediathread Collection
                <button className="jux-close"
                        onClick={this.closePopup.bind(this)}>
                    X
                </button>
            </div>
            Aux Track
        </div>;
    }
    openPopup(event) {
        var x = event.clientX - this.el.offsetLeft;
        this.popupEl.style.left = x + 'px';
        this.popupEl.style.visibility = 'visible';
    }
    closePopup(event) {
        event.stopPropagation();
        this.popupEl.style.visibility = 'hidden';
    }
}

class Playhead extends React.Component {
    constructor() {
        super();
        this.state = {time: 0, duration: null};
    }
    handleChange(event) {
        var percentDone = event.target.value / 1000;
        var newTime = this.state.duration * percentDone;
        this.setState({
            time: newTime,
            duration: this.state.duration
        });
        this.props.callbackParent(newTime, this.state.duration);

        // Convert percentDone to the scale of the input width
        // (probably 600px).
        var x = this.el.clientWidth * percentDone + this.el.offsetLeft;
        this._line.style.left = x + 'px';
    }
    render() {
        var percentDone = 0;
        if (this.state.duration !== 0) {
            percentDone = (this.state.time / this.state.duration) * 1000;
        }
        return <div>
            <div
                ref={(ref) => this._line = ref}
                className="jux-playhead-line">
                <div className="jux-playhead-top-cutpoint"></div>
                <div className="jux-playhead-bottom-cutpoint"></div>
            </div>
            <input type="range" min="0" max="1000"
                   ref={(ref) => this.el = ref}
                   onChange={this.handleChange.bind(this)}
                   value={percentDone} />
        </div>;
    }
}

class JuxtaposeApplication extends React.Component {
    constructor() {
        super();
        this.state = {time: null, duration: null};
    }
    render() {
        return <div className="jux-container">
            <div className="vid-container">
                <SpineVideo
                    ref={(c) => this._spineVid = c}
                    callbackParent={this.onTimeUpdate.bind(this)}
                />
                <AuxMedia ref={(c) => this._auxVid = c} />
            </div>
            <PlayButton callbackParent={this.onPlayChanged.bind(this)} />
            <div className="jux-time">
                {formatDuration(this.state.time)} / {formatDuration(this.state.duration)}
            </div>
            <div className="jux-timeline">
                <Playhead ref={(c) => this._playhead = c}
                          callbackParent={this.onPlayheadUpdate.bind(this)} />
                <SpineTrack />
                <AuxTrack />
            </div>
        </div>;
    }
    onPlayChanged(play) {
        if (play) {
            this._spineVid.play();
            this._auxVid.play();
        } else {
            this._spineVid.pause();
            this._auxVid.pause();
        }
    }
    onTimeUpdate(time, duration) {
        // TODO: this works for now, but I have a feeling this isn't the
        // right way to share state. Even if it is... the code is messy.
        var state = {
            time: time,
            duration: duration
        };
        this._playhead.setState(state);
        this.setState(state);
    }
    onPlayheadUpdate(time, duration) {
        var state = {
            time: time,
            duration: duration
        };
        this._spineVid.setState(state);
        this._spineVid.updateVidPosition(time);
        this.setState(state);
    }
}

ReactDOM.render(
    <JuxtaposeApplication />,
    document.getElementById('container')
);
