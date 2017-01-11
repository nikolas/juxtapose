import React from 'react';
import ol from 'openlayers';

// http://stackoverflow.com/questions/35454014/clicks-on-reactjs-components-not-firing-on-an-openlayers-overlay
// https://github.com/openlayers/ol3/issues/6087

export default class ImagePlayer extends React.Component {
    constructor(props) {
        super(props);
        this.map = undefined;
        this.mapId = 'image-player-' + Math.random().toString(16).slice(2);
    }
    styleFunction(feature) {
        if (!this.styles) {
            this.styles = {
                'Polygon': [
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#ffffff',
                            width: 4
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(255,255,255,0)'
                        })
                    }),
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#905050', width: 2
                        })
                    })
                ],
                'Point': [
                    new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 6,
                            fill: null,
                            stroke: new ol.style.Stroke({
                                color: '#ffffff', width: 4})
                        })
                    }),
                    new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 6,
                            fill: null,
                            stroke: new ol.style.Stroke({
                                color: '#905050', width: 2})
                        })
                    })
                ]
            };
        }
        const gtype = feature.getGeometry().getType();
        return this.styles[gtype];
    }
    objectProportioned() {
        let dim = {w: 180, h: 90};
        const w = this.props.width || 180;
        const h = this.props.height || 90;
        if (w / 2 > h) {
            dim.h = Math.ceil(180 * h / w);
        } else {
            dim.w = Math.ceil(90 * w / h);
        }
        return [-dim.w, -dim.h, dim.w, dim.h];
    }
    zoomToExtent(extent) {
        this.map.getView().fit(extent, this.map.getSize());
    }
    center(x, y) {
        this.map.getView().setCenter([x, y]);
    }
    zoom(level) {
        this.map.getView().setZoom(level);
    }
    hasFeature(attrs) {
        return attrs.hasOwnProperty('feature') ||
               attrs.hasOwnProperty('geometry') ||
               attrs.hasOwnProperty('xywh');
    }
    addVectorLayer(props, projection, attrs) {
        const formatter = new ol.format.GeoJSON({
            dataProjection: projection,
            featureProjection: projection});

        const feature = formatter.readFeature(attrs);
        const layer = new ol.layer.Vector({
            title: 'annotation',
            source: new ol.source.Vector({
                features: [feature]
            }),
            style: this.styleFunction(feature)
        });

        this.map.addLayer(layer);

        const extent = feature.getGeometry().getExtent();
        if (attrs.zoom) {
            const coord = ol.extent.getCenter(extent);
            this.center(coord[0], coord[1]);
            this.zoom(attrs.zoom);
        } else {
            this.zoomToExtent(projection.getExtent());
        }
    }
    addImageLayer(props, projection, extent) {
        const layer = new ol.layer.Image({
            source: new ol.source.ImageStatic({
                url: this.props.url,
                projection: projection,
                imageExtent: extent
            })
        });
        this.map.addLayer(layer);
    }
    initializeMap() {
        if (this.map) {
            return;
        }

        let attrs = JSON.parse(this.props.annotationData);
        attrs.type = 'Feature'; // required for ol2 > ol3 migration

        const extent = this.objectProportioned();

        const projection = new ol.proj.Projection({
            units: 'pixels',
            extent: extent
        });

        this.map = new ol.Map({
            interactions: ol.interaction.defaults({mouseWheelZoom:false}),
            controls: [],
            target: this.mapId,
            view: new ol.View({
                projection: projection
            })
        });

        this.addImageLayer(this.props, projection, extent);

        if (this.hasFeature(attrs)) {
            this.addVectorLayer(this.props, projection, attrs);
        } else if (attrs.x !== undefined) {
            this.center(attrs.x, attrs.y);
            this.zoom(attrs.zoom - .5);
        } else {
            this.zoomToExtent(extent);
        }
    }
    shouldComponentUpdate(nextProps) {
        const shouldUpdate = (this.map === undefined && !nextProps.hidden) ||
                              this.props.annotationData !== nextProps.annotationData ||
                              this.props.hidden !== nextProps.hidden;

        // destroy the map if annotation data is changing
        if (this.map &&
                this.props.annotationData !== nextProps.annotationData) {
            this.map.setTarget(null);
            delete this.map;
        }

        return shouldUpdate;
    }
    render() {
        const display = this.props.hidden ? 'none' : 'block';
        return <div id={this.mapId} className='image-player'
                    style={{'display': display}}>
               </div>;
    }
    componentDidUpdate() {
        this.initializeMap();
    }
}

ImagePlayer.propTypes = {
    annotationData: React.PropTypes.string.isRequired,
    height: React.PropTypes.number.isRequired,
    hidden: React.PropTypes.bool.isRequired,
    url: React.PropTypes.string.isRequired,
    width: React.PropTypes.number.isRequired
};
