cc.Class({
    'extends': cc.Component,

    properties: {
        backgroundAudio: {
            'default': null,
            url: cc.AudioClip
        },
        blackChessPrefab: {
            'default': null,
            type: cc.Prefab
        },
        whiteChessPrefab: {
            'default': null,
            type: cc.Prefab
        },
        movingChessName: ""
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.initChessToPoint();
        // this.addNewChess();
    },

    onTouchStart: function onTouchStart(e) {
        cc.find('Canvas').emit('pick', this.name);
        cc.find('Canvas').emit('put', this.name);
        this.runAction(cc.scaleTo(0.1, 1.2, 1.2));
        this.movingChessName = this.name;
    },

    onPick: function onPick(e) {
        if (e.detail !== this.name) {
            this.runAction(cc.scaleTo(0.1, 1, 1));
        }
    },

    onPut: function onPut(e) {
        var x = 0,
            y = 0,
            that = this;
        if (e.detail == this.name) {
            cc.find('Canvas').on('touchstart', function (e) {
                var locationV2 = this.convertToNodeSpaceAR(e.getLocation());
                that.runAction(cc.moveTo(0.1, locationV2));
            });
        }
    },

    start: function start() {
        var chessMgr = require('chessMgr');
        // this.chessMove();
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
                x = point.x,
                y = point.y;
            // chessMgr.move(x, y);
            if (!point.isEmpty) {
                if (point.color == 'white') {
                    var newChess = cc.instantiate(this.whiteChessPrefab);
                    that.node.addChild(newChess);
                    newChess.setPosition(x, y);
                    newChess.name = 'whiteChess' + i;
                    cc.find('Canvas').on('pick', that.onPick, newChess), cc.find('Canvas').on('put', that.onPut, newChess), newChess.on('touchstart', that.onTouchStart, newChess);
                } else {
                    var newChess = cc.instantiate(this.blackChessPrefab);
                    that.node.addChild(newChess);
                    newChess.setPosition(x, y);
                }
            }
        }
    },
    // 棋子移动
    chessMove: function chessMove(el) {
        var that = this,
            isMoving = false;
        el.on('touchstart', (function () {
            var scaleAction = cc.scaleBy(0.1, 1.5, 1.5);
            this.runAction(scaleAction);
        }).bind(el));
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