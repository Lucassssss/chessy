cc.Class({
    'extends': cc.Component,

    properties: {
        backgroundAudio: {
            'default': null,
            url: cc.AudioClip
        },
        chessPrefab: {
            'default': null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.initChessToPoint();
        // this.addNewChess();
    },

    start: function start() {
        var chessMgr = require('chessMgr');
        // Set
        // chessMgr.move(200, 100);
    },
    // 初始化放置棋子到默认位置
    initChessToPoint: function initChessToPoint() {
        var that = this,
            pointMgr = require('pointMgr'),
            chessMgr = require('chessMgr');
        for (var i = 0; i < 8; i++) {
            var point = pointMgr.getPoint(i),
                newChess = cc.instantiate(this.chessPrefab);
            var x = point.x,
                y = point.y;
            // chessMgr.move(x, y);
            that.node.addChild(newChess);
            newChess.setPosition(x, y);
            console.log(x, y);
        }
    },

    addNewChess: function addNewChess() {
        var chessMgr = require('chessMgr'),
            x = chessMgr.getPositionX(),
            y = chessMgr.getPositionY(),
            newChess = cc.instantiate(this.chessPrefab);
        this.node.addChild(newChess);
        console.log(x, y);
        newChess.setPosition(x, y);
    },

    update: function update() {}
});