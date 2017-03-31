"use strict";
cc._RFpush(module, '4b290oljLlIVrLHc8ejE/gZ', 'main');
// Script/main.js

var pointMgr = require('pointMgr'),
    chessMgr = require('chessMgr'),
    socket = window.io('http://localhost:3000');
cc.Class({
    'extends': cc.Component,

    properties: {
        backgroundAudio: {
            'default': null,
            url: cc.AudioClip
        },
        pickAudio: {
            'default': null,
            url: cc.AudioClip
        },
        putAudio: {
            'default': null,
            url: cc.AudioClip
        },
        chessDieAudio: {
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
        moveAble: false,
        movingChessName: "",
        movingChessColor: "",
        movingChessIndex: 0,
        oldPositionX: 0,
        oldPositionY: 0,
        currentCanMoveColor: 'black',
        flagWhite: 0,
        flagBlack: 1,
        myUserId: ''
    },

    // use this for initialization
    onLoad: function onLoad() {

        //var getId = window.io('http://localhost:3000/getId');

        var socket = window.io('http://localhost:3000');
        socket.on('connected', function (msg) {
            console.log(msg);
            socket.on('getUserId', function (id) {
                this.myUserId = id;
                socket.emit('saveUser', id);
                console.log('获取到的 id: ', id);
            });
        });

        this.initChessToPoint();
        this.node.on("touchstart", this.onPut, this);
        this.node.on("changePlayer", this.onChangePlayer, this);
        this.node.on("checkDiePiece", this.onCheckDiePiece, this);
        this.node.on('chessMoved', this.onChessMoved, this);
        this.node.on('chessMoveTo', this.onChessMoveTo, this); // 监听走棋
        // this.node.on('setOldPosition', this.onSetOldPosition, this);

        // 清空旧位置
        socket.on('clearPosition', function (oldPoint) {
            pointMgr.isInpoint(oldPoint, function (index) {
                console.log('清空旧位置：', index);
                pointMgr.setStatus(index, true); // 设置已移除棋子位置的状态
                pointMgr.setCurrentPiece(index, -1);

                console.log(pointMgr.getStatus(index));
            });
        });

        socket.on('chessMoveTo', function (moveData) {
            cc.find('Canvas').emit('chessMoveTo', moveData);
        });
    },
    // 向服务器发射走棋
    onChessMoved: function onChessMoved(moveData) {
        console.log(moveData.detail);
        console.log(moveData.detail.chessNumber, moveData.detail.newPosition);
        //if(this.flagBlack == 1) {
        socket.emit('chessMoveTo', moveData.detail);
        //    this.flagWhite = 1;
        //    this.flagBlack = 0;
        //}
        cc.find('Canvas').emit('changePlayer', this);
    },
    // 收到服务器走棋事件
    onChessMoveTo: function onChessMoveTo(e) {
        // if(this.flagBlack == 1) {
        //     this.flagWhite = 1;
        //     this.flagBlack = 0;

        var chessNumber = e.detail.chessNumber,
            newPosition = parseInt(e.detail.newPosition),
            pointMgr = require('pointMgr'),
            moveChessNode = cc.find('Canvas').getChildByName('chessPiece' + chessNumber),

        // position = pointMgr.getPosition(parseInt(newPosition));
        pointX = pointMgr.getPoint(newPosition).x,
            pointY = pointMgr.getPoint(newPosition).y;
        // cc.log(position);
        moveChessNode.runAction(cc.moveTo(0.1, pointX, pointY));
        cc.find('Canvas').emit('changePlayer', this);
        //}
    },

    onTouchStart: function onTouchStart(e) {
        // 能够获取属性的类
        var main = cc.find('Canvas').getComponent('main');
        cc.log('name:', this.name);
        // 检测当前走棋对象颜色
        if (this.chessColor == main.currentCanMoveColor) {
            cc.find('Canvas').emit('pick', this.name);
            this.runAction(cc.scaleTo(0.1, 1.2, 1.2));
            cc.log(this.chessColor);
            main.moveAble = true;
            main.movingChessName = this.name;
            main.movingChessColor = this.chessColor;
            main.movingChessIndex = this.chessIndex;
            main.oldPositionX = this.x;
            main.oldPositionY = this.y;
        } else {
            alert('还没到你走棋哦！');
        }
    },
    // 捡起棋子
    onPick: function onPick(e) {
        if (e.detail !== this.name) {
            this.runAction(cc.scaleTo(0.1, 1, 1));
            cc.find('Canvas').getComponent('main').moveAble = false;
        } else {
            cc.find('Canvas').emit('put', this.name);
        }
    },
    // 交换选手
    onChangePlayer: function onChangePlayer() {
        // cc.log(this);
        if (this.currentCanMoveColor == 'black') {
            this.currentCanMoveColor = 'white';
        } else {
            this.currentCanMoveColor = 'black';
        }
    },
    // 落子
    onPut: function onPut(e) {
        var that = this,
            oldPoint = { x: that.oldPositionX, y: that.oldPositionY },
            moveAble = cc.find('Canvas').getComponent('main').moveAble,
            // 是否可移动
        movingChessName = cc.find('Canvas').getComponent('main').movingChessName,
            // 可移动的棋子 name
        movingChessColor = cc.find('Canvas').getComponent('main').movingChessColor,
            // 可移动的棋子颜色
        movingChessIndex = cc.find('Canvas').getComponent('main').movingChessIndex,
            // 可移动的棋子编号
        moveChessNode = cc.find('Canvas').getChildByName(movingChessName),
            // 可移动棋子的节点
        targetPoint = this.node.convertToNodeSpaceAR(e.getLocation()),
            pointMgr = require('pointMgr'),
            chessMgr = require('chessMgr');

        // cc.log(oldPoint);
        pointMgr.isInpoint(targetPoint, function (index) {
            // 传递目标坐标，如果在已定义的点范围内则返回该已定义点的索引
            var pointX = pointMgr.getPoint(index).x,
                pointY = pointMgr.getPoint(index).y;
            // cc.log(pointX, pointY)
            if (pointX && pointY && pointMgr.getStatus(index)) {
                // 判断是否有棋子，坐标是否存在
                if (moveChessNode) {
                    // moveChessNode.runAction(cc.moveTo(0.1, pointX, pointY));   // 根据事件传过来的目标点做移动
                    cc.find('Canvas').getComponent('main').movingChessName = ''; // 清空可走棋子
                    cc.audioEngine.playEffect(that.putAudio, false);
                    pointMgr.setStatus(index, false); // 设置该位置已占用
                    pointMgr.setColor(index, movingChessColor); // 设置索引值位置新颜色
                    // that.setOldPosition(oldPoint, index);
                    socket.emit('setOldPosition', oldPoint);
                    if (targetPoint !== oldPoint) {
                        cc.log('当前移动棋子为：', movingChessIndex, '移动到： ', index);
                        var moveData = {
                            chessNumber: movingChessIndex,
                            newPosition: index

                        };
                        cc.find('Canvas').emit('chessMoved', moveData); // 发射 socket 事件
                        pointMgr.setCurrentPiece(index, movingChessIndex); // 设置对应位置的棋子编号
                        cc.find('Canvas').emit('changePlayer', that); // 发射交换选手事件
                        // cc.find('Canvas').emit('checkDiePiece', that);    // 发射检查是否需要掐子事件
                        that.onCheckDiePiece(index, function (pieceNumber, point) {
                            cc.log(pieceNumber);
                            if (pieceNumber !== '' && pieceNumber !== -1) {
                                that.node.getChildByName('chessPiece' + pieceNumber).destroy(); // 销毁死亡的棋子节点
                                cc.log('棋子', pieceNumber, '死亡');
                                cc.audioEngine.playEffect(that.chessDieAudio, false);
                                pointMgr.setStatus(point, true); // 设置棋子已死亡位置可重新落子
                                chessMgr.setStatus(pieceNumber, true);
                            }
                        });
                    }
                }
            }
        });
    },
    // 检查是否需要掐子
    // @index 为当前位置索引
    onCheckDiePiece: function onCheckDiePiece(index, callback) {
        cc.log('移动到了:', index);
        var pointMgr = require('pointMgr'),
            chessMgr = require('chessMgr');
        if (index == 1) {
            var p1Color = chessMgr.getColor(pointMgr.getCurrentPiece(1)),
                p0Color = chessMgr.getColor(pointMgr.getCurrentPiece(0)),
                p7Color = chessMgr.getColor(pointMgr.getCurrentPiece(7)),
                p2Color = chessMgr.getColor(pointMgr.getCurrentPiece(2)),
                p3Color = chessMgr.getColor(pointMgr.getCurrentPiece(3));
            if (p1Color == p7Color && p1Color != p0Color && p0Color != 'undefined') {
                callback(pointMgr.getCurrentPiece(0), 0);
            } else if (p1Color == p3Color && p1Color != p2Color && p2Color != 'undefined') {
                callback(pointMgr.getCurrentPiece(2), 2);
            }
        }
        if (index == 3) {
            var p1Color = chessMgr.getColor(pointMgr.getCurrentPiece(1)),
                p2Color = chessMgr.getColor(pointMgr.getCurrentPiece(2)),
                p3Color = chessMgr.getColor(pointMgr.getCurrentPiece(3)),
                p4Color = chessMgr.getColor(pointMgr.getCurrentPiece(4)),
                p5Color = chessMgr.getColor(pointMgr.getCurrentPiece(5));
            if (p1Color == p3Color && p1Color != p2Color && p2Color != 'undefined') {
                callback(pointMgr.getCurrentPiece(2), 2);
            } else if (p3Color == p5Color && p3Color != p4Color && p4Color != 'undefined') {
                callback(pointMgr.getCurrentPiece(4), 4);
            }
        }
        if (index == 5) {
            var p3Color = chessMgr.getColor(pointMgr.getCurrentPiece(3)),
                p4Color = chessMgr.getColor(pointMgr.getCurrentPiece(4)),
                p5Color = chessMgr.getColor(pointMgr.getCurrentPiece(5)),
                p6Color = chessMgr.getColor(pointMgr.getCurrentPiece(6)),
                p7Color = chessMgr.getColor(pointMgr.getCurrentPiece(7));
            if (p3Color == p5Color && p3Color != p4Color && p4Color != 'undefined') {
                callback(pointMgr.getCurrentPiece(4), 4);
            } else if (p5Color == p7Color && p5Color != p6Color && p6Color != 'undefined') {
                callback(pointMgr.getCurrentPiece(6), 6);
            }
        }

        if (index == 7) {
            var p5Color = chessMgr.getColor(pointMgr.getCurrentPiece(5)),
                p6Color = chessMgr.getColor(pointMgr.getCurrentPiece(6)),
                p7Color = chessMgr.getColor(pointMgr.getCurrentPiece(7)),
                p0Color = chessMgr.getColor(pointMgr.getCurrentPiece(0)),
                p1Color = chessMgr.getColor(pointMgr.getCurrentPiece(1));
            if (p5Color == p7Color && p5Color != p6Color && p6Color != 'undefined') {
                callback(pointMgr.getCurrentPiece(6), 6);
            } else if (p7Color == p1Color && p7Color != p0Color && p0Color != 'undefined') {
                callback(pointMgr.getCurrentPiece(0), 0);
            }
        }
    },

    onSetOldPosition: function onSetOldPosition(oldPoint) {
        var pointMgr = require('pointMgr');
        pointMgr.isInpoint(oldPoint, function (index) {
            pointMgr.setStatus(index, true); // 设置已移除棋子位置的状态
            pointMgr.setCurrentPiece(index, -1);
        });
    },

    setOldPosition: function setOldPosition(oldPoint) {
        // 棋子旧位置清空
        socket.emit('setOldPosition', oldPoint);
    },

    // 初始化放置棋子到默认位置
    initChessToPoint: function initChessToPoint() {
        var that = this,
            pointMgr = require('pointMgr'),
            chessMgr = require('chessMgr');
        for (var i = 0; i < 8; i++) {
            var point = pointMgr.getPoint(i),
                chessMgrColor = chessMgr.getColor(i),
                x = point.x,
                y = point.y;

            if (chessMgrColor == 'white') {
                var newChess = cc.instantiate(that.whiteChessPrefab);
                that.node.addChild(newChess);
                newChess.setPosition(x, y);
                newChess.name = 'chessPiece' + i;
                newChess.chessColor = 'white';
                newChess.chessIndex = i;
                cc.find('Canvas').on('pick', that.onPick, newChess);
                newChess.on('touchstart', that.onTouchStart, newChess);
            } else if (chessMgrColor == 'black') {
                var newChess = cc.instantiate(this.blackChessPrefab);
                that.node.addChild(newChess);
                newChess.setPosition(x, y);
                newChess.name = 'chessPiece' + i;
                newChess.chessColor = 'black';
                newChess.chessIndex = i;
                cc.find('Canvas').on('pick', that.onPick, newChess);
                newChess.on('touchstart', that.onTouchStart, newChess);
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