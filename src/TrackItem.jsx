import React from 'react';

export default class TrackItem extends React.Component {
    calcStyle() {
        const trackWidth = 600;
        const ratio = this.props.data.startTime / this.props.duration;
        const pos = ratio * trackWidth;
        const wRatio = (this.props.data.endTime -
                        this.props.data.startTime) / this.props.duration;
        const width = wRatio * trackWidth;
        return {
            left: pos + 'px',
            width: width + 'px'
        };
    }
    renderVidThumb(data) {
        return <video className="aux-item-middle">
            <source src={data.source} type="video/mp4" />
        </video>;
    }
    renderImgThumb(data) {
        const style = {
            'backgroundImage': 'url(' + data.source + ')',
            'backgroundSize': 'contain',
            'backgroundPosition': 'center',
            'backgroundRepeat': 'no-repeat'
        };
        return <div className="aux-item-middle" style={style}></div>;
    }
    renderTxtThumb(data) {
        return <p className="aux-item-middle">{data.source}</p>;
    }
    onClick(e) {
        if (!this.props.dragging) {
            console.log('click');
        }
    }
    render() {
        let style = {};
        if (this.props.duration) {
            style = this.calcStyle();
        }
        let c = '';
        if (this.props.data.type === 'vid') {
            c = this.renderVidThumb(this.props.data);
        } else if (this.props.data.type === 'img') {
            c = this.renderImgThumb(this.props.data);
        } else if (this.props.data.type === 'txt') {
            c = this.renderTxtThumb(this.props.data);
        }
        return <div data={this.props.data}
                    data-dragging={this.props.dragging}
                    className={this.props.className}
                    style={this.props.style}
                    onClick={this.onClick.bind(this)}
                    onMouseDown={this.props.onMouseDown}
                    onTouchEnd={this.props.onTouchEnd}
                    onTouchStart={this.props.onTouchStart}>
            <div className="jux-stretch-handle jux-aux-item-left"></div>
            {c}
            <span className="react-resizable-handle"></span>
            <div className="jux-stretch-handle jux-aux-item-right"></div>
        </div>;
    }
}
