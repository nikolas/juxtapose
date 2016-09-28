import React from 'react';

export default class TrackItem extends React.Component {
    constructor() {
        super();
        this.state = {
            vimeoThumbnailUrl: null
        }
    }
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
    vimeoThumbnailListener(e) {
        const json = e.target.responseText;
        const data = JSON.parse(json);
        const url = data[0].thumbnail_medium;
        this.setState({vimeoThumbnailUrl: url});
    }
    getVimeoThumbnailUrl(data) {
        const url = 'https://vimeo.com/api/v2/video/' + data.source +
                    '.json';
        let xhr = new XMLHttpRequest();
        xhr.addEventListener('load', this.vimeoThumbnailListener.bind(this));
        xhr.open('GET', url, true);
        xhr.send(null);
    }
    renderVidThumb(data) {
        if (data.host === 'youtube') {
            return <img src={'http://img.youtube.com/vi/' +
                             data.source + '/default.jpg'} />
        } else if (data.host === 'vimeo') {
            if (!this.state.vimeoThumbnailUrl) {
                this.getVimeoThumbnailUrl(data);
            }
            return <img src={this.state.vimeoThumbnailUrl} />;
        }
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
        let cls = this.props.className;
        if (this.props.isActive) {
            cls += ' jux-item-active';
        }
        return <div data={this.props.data}
                    data-dragging={this.props.dragging}
                    className={cls}
                    style={this.props.style}
                    onMouseDown={this.props.onMouseDown}
                    onTouchEnd={this.props.onTouchEnd}
                    onTouchStart={this.props.onTouchStart}>
            {c}
        </div>;
    }
}
