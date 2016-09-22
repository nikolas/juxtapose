import React from 'react';
import Track from './Track.jsx';
import TextAnnotationAdder from './TextAnnotationAdder.jsx';

export default class TextTrack extends Track {
    renderItemAdder() {
        return <TextAnnotationAdder
                   showing={this.state.adding}
                   onCloseClick={this.closeItemAdder.bind(this)}
                   onSubmit={this.onTrackItemAdd.bind(this)} />;
    }
}
