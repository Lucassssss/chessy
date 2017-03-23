"use strict";
cc._RFpush(module, '4b290oljLlIVrLHc8ejE/gZ', 'main');
// Script/main.js

cc.Class({
    "extends": cc.Component,

    properties: {
        backgroundAudio: {
            "default": null,
            url: cc.AudioClip
        },
        pickAudio: {
            "default": null,
            url: cc.AudioClip
        },
        putAudio: {
            "default": null,
            url: cc.AudioClip
        },
        blackChessPrefab: {
            "default": null,
            type: cc.Prefab
        },
        whiteChessPrefab: {
            "default": null,
            type: cc.Prefab
        },
        moveAble: false,
        movingChessName: "",
        oldPositionX: 0,
        oldPositionY: 0
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.initChessToPoint();
        this.node.on("touchstart", this.onPut, this);
    },

    onTouchStart: function onTouchStart(e) {
        cc.find('Canvas').emit('pick', this.name);
        this.runAction(cc.scaleTo(0.1, 1.2, 1.2));
        cc.find('Canvas').getComponent('main').moveAble = true;
        cc.find('Canvas').getComponent('main').movingChessName = this.name;
        cc.find('Canvas').getComponent('main').oldPositionX = this.x;
        cc.find('Canvas').getComponent('main').oldPositionY = this.y;
    },

    onPick: function onPick(e) {
        if (e.detail !== this.name) {
            this.runAction(cc.scaleTo(0.1, 1, 1));
            cc.find('Canvas').getComponent('main').moveAble = false;
        } else {
            cc.find('Canvas').emit('put', this.name);
        }
    },

    onPut: function onPut(e) {
        var that = this,
            oldPoint = { x: that.oldPositionX, y: that.oldPositionY },
            moveAble = cc.find('Canvas').getComponent('main').moveAble,
            // 是否可移动
        movingChessName = cc.find('Canvas').getComponent('main').movingChessName,
            // 可移动的棋子 name
        moveChessNode = cc.find('Canvas').getChildByName(movingChessName),
            // 可移动棋子的节点
        targetPoint = this.node.convertToNodeSpaceAR(e.getLocation()),
            pointMgr = require('pointMgr');

        // cc.log(oldPoint);
        pointMgr.isInpoint(targetPoint, function (index) {
            // 传递目标坐标，如果在已定义的点范围内则返回该已定义点的索引
            var pointX = pointMgr.getPoint(index).x,
                pointY = pointMgr.getPoint(index).y;
            // cc.log(pointX, pointY)
            if (pointX && pointY && pointMgr.getStatus(index)) {
                // 判断是否有棋子，坐标是否存在
                if (moveChessNode) {
                    moveChessNode.runAction(cc.moveTo(0.1, pointX, pointY)); // 根据事件传过来的目标点做移动
                    cc.audioEngine.playEffect(that.putAudio, false);
                    pointMgr.setStatus(index, false); // 设置该位置已占用
                    that.setOldPosition(oldPoint, index);
                }
            }
        });
    },

    setOldPosition: function setOldPosition(oldPoint) {
        var pointMgr = require('pointMgr');
        pointMgr.isInpoint(oldPoint, function (index) {
            pointMgr.setStatus(index, true); // 设置已移除棋子位置的状态
        });
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
                    cc.find('Canvas').on('pick', that.onPick, newChess), newChess.on('touchstart', that.onTouchStart, newChess);
                } else {
                    var newChess = cc.instantiate(this.blackChessPrefab);
                    that.node.addChild(newChess);
                    newChess.setPosition(x, y);
                    newChess.name = 'whiteChess' + i;
                    cc.find('Canvas').on('pick', that.onPick, newChess), newChess.on('touchstart', that.onTouchStart, newChess);
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

cc._RFpop();