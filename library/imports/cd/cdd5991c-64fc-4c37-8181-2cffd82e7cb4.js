cc.Class({
    "extends": cc.Component,

    properties: {
        chess: {
            "default": null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        // let chessMgr = require('chessMgr');
        // this.chess.setPosition(chessMgr.getPosition());
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },