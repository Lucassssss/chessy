"use strict";
cc._RFpush(module, '4b290oljLlIVrLHc8ejE/gZ', 'main');
// Script/main.js

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
        this.addNewChess();
    },

    start: function start() {
        var chessMgr = require('chessMgr');
        // Set
        chessMgr.move(200, 100);
    },
    // 初始化放置棋子到默认位置
    initChessToPoint: function initChessToPoint() {
        var pointMgr = require('pointMgr'),
            pointArray = pointMgr.getPoint();
        console.log(pointArray);
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