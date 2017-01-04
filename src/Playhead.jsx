import React from 'react';


export default class Playhead extends React.Component {
    constructor(props) {
        super(props);
        this.trackWidth = 915;
    }
    render() {
        if (!this.props.duration) {
            return <div className="jux-playhead-container">
    <div className="jux-playhead-line"></div>
            </div>;
        }

        let currentPos = 0;
        if (this.props.duration !== 0) {
            currentPos = (this.props.currentTime / this.props.duration);
        }

        const x = this.trackWidth * currentPos;
        const lineStyle = {left: x + 7 + 'px'};

        return <div className="jux-playhead-container">
            <input type="range" min="0" max="1000"
                   ref={(ref) => this.el = ref}
                   onChange={this.props.onChange}
                   onMouseDown={this.props.onMouseDown}
                   onMouseUp={this.props.onMouseUp}
                   value={currentPos * 1000} />
            <div className="jux-playhead-line" style={lineStyle}></div>
        </div>;
    }
}
