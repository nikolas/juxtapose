import React from 'react';

export default class BasePlayer extends React.Component {
    constructor(props) {
        super(props);
        this.config = {
            youtube: {
                playerVars: {
                    // Disable fullscreen
                    fs: 0,
                    // Disable keyboard controls
                    disablekb: 1,
                    // Hide video annotations
                    iv_load_policy: 3,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0
                }
            },
            vimeo: {
                iframeParams: {
                    autopause: 0,
                    badge: 0,
                    byline: 0,
                    fullscreen: 0,
                    portrait: 0,
                    title: 0
                }
            }
        };
    }
}
