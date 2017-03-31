require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"chessMgr":[function(require,module,exports){
"use strict";
cc._RFpush(module, '683d1m9EIVGZq90eO0xBzmw', 'chessMgr');
// Script/chessMgr.js

// 棋子管理
var chess = [];

chess[0] = {
    currentPositon: 0,
    isDead: false,
    color: 'white'
};

chess[1] = {
    currentPositon: 1,
    isDead: false,
    color: 'white'
};

chess[2] = {
    currentPositon: 2,
    isDead: false,
    color: 'white'
};

chess[3] = {};

chess[4] = {
    currentPositon: 4,
    isDead: false,
    color: 'black'
};

chess[5] = {
    currentPositon: 5,
    isDead: false,
    color: 'black'
};

chess[6] = {
    currentPositon: 6,
    isDead: false,
    color: 'black'
};

chess[7] = {};

module.exports = {
    getStatus: function getStatus(index) {
        return chess[index].isDead;
    },
    getCurrentPosition: function getCurrentPosition(index) {
        return chess[index].currentPositon;
    },
    getColor: function getColor(index) {
        if (index != -1) {
            return chess[index].color;
        } else {
            return false;
        }
    },
    setStatus: function setStatus(index, newStatus) {
        chess[index].isDead = newStatus;
    },
    setCurrentPosition: function setCurrentPosition(index, newPosition) {
        chess[index].currentPositon = newPosition;
    },
    setColor: function setColor() {
        // 理论上不能重新设置棋子颜色
    }

};

cc._RFpop();
},{}],"chess":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'cdd59kcZPxMN4GBLP/YLny0', 'chess');
// Script/chess.js

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

cc._RFpop();
},{}],"main":[function(require,module,exports){
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
},{"chessMgr":"chessMgr","pointMgr":"pointMgr"}],"pointMgr":[function(require,module,exports){
"use strict";
cc._RFpush(module, '01d78VFhoxOb42lekaigJsN', 'pointMgr');
// Script/pointMgr.js

// 棋盘管理
var point = [];
point[0] = {
    x: -246,
    y: 266,
    isEmpty: false,
    color: "white",
    currentPiece: 0
};
point[1] = {
    x: 4,
    y: 266,
    isEmpty: false,
    color: "white",
    currentPiece: 1
};
point[2] = {
    x: 246,
    y: 266,
    isEmpty: false,
    color: "white",
    currentPiece: 2
};

point[3] = {
    x: 250,
    y: 20,
    isEmpty: true,
    color: "",
    currentPiece: -1
};

point[4] = {
    x: 244,
    y: -227,
    isEmpty: false,
    color: "black",
    currentPiece: 4
};

point[5] = {
    x: 1,
    y: -231,
    isEmpty: false,
    color: "black",
    currentPiece: 5
};

point[6] = {
    x: -250,
    y: -227,
    isEmpty: false,
    color: "black",
    currentPiece: 6
};

point[7] = {
    x: -250,
    y: 14,
    isEmpty: true,
    color: "",
    currentPiece: -1
};

// console.log(point)

module.exports = {
    point: point,
    getPoint: function getPoint(index) {
        return point[index];
    },
    getPosition: function getPosition(index) {
        return point[index].x + ',' + point[index].y;
    },
    getStatus: function getStatus(index) {
        return point[index].isEmpty;
    },
    getColor: function getColor(index) {
        return point[index].color;
    },
    // 返回索引值位置点对应的棋子编号
    getCurrentPiece: function getCurrentPiece(index) {
        return point[index].currentPiece;
    },
    setStatus: function setStatus(index, bool) {
        point[index].isEmpty = bool;
        cc.log('设置', index, '为', bool);
        //cc.log(point[index]);
    },
    setColor: function setColor(index, newColor) {
        point[index].color = newColor;
    },
    // 设置索引值 index 对应的 currentPiece 为 chessNumber 号棋子
    setCurrentPiece: function setCurrentPiece(index, chessNumber) {
        point[index].currentPiece = chessNumber;
    },
    isInpoint: function isInpoint(targetPoint, callback) {
        // console.log(targetPoint);
        var targetPointX = targetPoint.x,
            targetPointY = targetPoint.y,
            range = 120;
        //for(var i = 0; i > point.length; i ++ ) {
        //let x = point[i].x, y = point[i].y,
        // 范围坐标
        if (targetPointX > range) {
            if (targetPointY <= range && targetPointY >= -range) {
                callback(3);
            } else if (targetPointY > range) {
                callback(2);
            } else if (targetPointY < -range) {
                callback(4);
            }
        } else if (targetPointX < -range) {
            if (targetPointY > range) {
                callback(0);
            } else if (targetPointY <= range && targetPointY >= -range) {
                callback(7);
            } else if (targetPointY < -range) {
                callback(6);
            }
        } else {
            if (targetPointY > range) {
                callback(1);
            } else if (targetPointY < -range) {
                callback(5);
            } else {
                callback('');
            }
        }

        //}
    }
};

cc._RFpop();
},{}],"room":[function(require,module,exports){
"use strict";
cc._RFpush(module, '697c5z6/npPg6gtwana/8NW', 'room');
// Script/room.js

cc.Class({
    'extends': cc.Component,

    properties: {
        roomPrefab: {
            'default': null,
            type: cc.Prefab
        },
        userId: ''

    },

    // use this for initialization
    onLoad: function onLoad() {
        // 设置 userid
        this.userId = Math.random().toString(36).substr(2);

        var that = this,
            socket = window.io('http://localhost:3000');

        socket.on('connected', function (msg) {
            // socket 链接成功，修改 label 文字
            var label = that.node.getChildren('networkLabel');
            label[0].getComponent("cc.Label").string = msg;

            // 初始化，传 userId 到后台
            socket.emit('game_init', that.userId);
            console.log('11');
            // 获取房间列表
        });
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}]},{},["chess","chessMgr","main","pointMgr","room"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL1NjcmlwdC9jaGVzc01nci5qcyIsImFzc2V0cy9TY3JpcHQvY2hlc3MuanMiLCJhc3NldHMvU2NyaXB0L21haW4uanMiLCJhc3NldHMvU2NyaXB0L3BvaW50TWdyLmpzIiwiYXNzZXRzL1NjcmlwdC9yb29tLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ1I7QUFDSTtBQUNJO0FBQ1I7QUFDSTtBQUNJO0FBQ0k7QUFDWjtBQUNZO0FBQ1o7QUFDQTtBQUNJO0FBQ0k7QUFDUjtBQUNJO0FBQ0k7QUFDUjtBQUNJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0k7QUFDSjtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNKO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNSO0FBQ0E7QUFDQTtBQUNJO0FBQ0o7QUFDQTtBQUNBO0FBQ1E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDaEI7QUFDQTtBQUNBO0FBQ1E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ1I7QUFDQTtBQUNBO0FBQ1E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNoQjtBQUNnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDUTtBQUNJO0FBQ1o7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ1I7QUFDWTtBQUNaO0FBQ0E7QUFDQTtBQUNRO0FBQ1I7QUFDQTtBQUNJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBZ0I7QUFFaEI7QUFDQTtBQUFZO0FBQ0E7QUFFWjtBQUNBO0FBQ0E7QUFBSTtBQUVKO0FBQVE7QUFDQTtBQUVSO0FBQVE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFWjtBQUFZO0FBRVo7QUFDQTtBQUNBO0FBQUk7QUFDSTtBQUNJO0FBQ0E7QUFFWjtBQUFZO0FBRVo7QUFDQTtBQUNBO0FBQUk7QUFFSjtBQUFRO0FBQ0k7QUFFWjtBQUFZO0FBRVo7QUFDQTtBQUNBO0FBQUk7QUFDSTtBQUVSO0FBQ0E7QUFDQTtBQURZO0FBR1o7QUFGWTtBQUlaO0FBSFk7QUFLWjtBQUpZO0FBTVo7QUFMWTtBQU9aO0FBQ0E7QUFDQTtBQUNBO0FBTFE7QUFPUjtBQU5ZO0FBUVo7QUFDQTtBQU5ZO0FBUVo7QUFQZ0I7QUFTaEI7QUFQb0I7QUFDQTtBQUNBO0FBQ0E7QUFTcEI7QUFQb0I7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBUzVCO0FBQ0E7QUFQd0I7QUFDQTtBQUNBO0FBU3hCO0FBUHdCO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFTaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUEk7QUFDSTtBQUNBO0FBU1I7QUFQUTtBQUNJO0FBU1o7QUFDQTtBQUNBO0FBQ0E7QUFQWTtBQUNJO0FBU2hCO0FBUGdCO0FBU2hCO0FBQ0E7QUFQUTtBQUNJO0FBU1o7QUFDQTtBQUNBO0FBQ0E7QUFQWTtBQUNJO0FBU2hCO0FBUGdCO0FBU2hCO0FBQ0E7QUFQUTtBQUNJO0FBU1o7QUFDQTtBQUNBO0FBQ0E7QUFQWTtBQUNJO0FBU2hCO0FBUGdCO0FBU2hCO0FBQ0E7QUFDQTtBQVBRO0FBQ0k7QUFTWjtBQUNBO0FBQ0E7QUFDQTtBQVBZO0FBQ0k7QUFTaEI7QUFQZ0I7QUFTaEI7QUFDQTtBQUNBO0FBQ0E7QUFQSTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBU1o7QUFDQTtBQUNBO0FBUEk7QUFTSjtBQVBRO0FBU1I7QUFDQTtBQUNBO0FBUEk7QUFDSTtBQVNSO0FBQ0E7QUFQUTtBQUNJO0FBU1o7QUFDQTtBQUNBO0FBQ0E7QUFQWTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFTaEI7QUFQZ0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVNoQjtBQUNBO0FBQ0E7QUFDQTtBQVBJO0FBQ0k7QUFTUjtBQVBRO0FBQ0k7QUFDQTtBQVNaO0FBQ0E7QUFQSTtBQUNJO0FBU1I7QUFDQTtBQUNBO0FBUFE7QUFDQTtBQUNBO0FBU1I7QUFDQTtBQVBJO0FBU0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalZBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSjtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ1I7QUFDSTtBQUNJO0FBQ1I7QUFDSTtBQUNJO0FBQ1I7QUFDSTtBQUNJO0FBQ1I7QUFDQTtBQUNJO0FBQ0k7QUFDUjtBQUNJO0FBQ0k7QUFDQTtBQUNSO0FBQ0E7QUFDSTtBQUNJO0FBQ1I7QUFDQTtBQUNJO0FBQ0s7QUFDVDtBQUNJO0FBQ0o7QUFDUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEWTtBQUNJO0FBQ0k7QUFHcEI7QUFEb0I7QUFHcEI7QUFEb0I7QUFHcEI7QUFDQTtBQURnQjtBQUNJO0FBR3BCO0FBRG9CO0FBR3BCO0FBRG9CO0FBR3BCO0FBQ0E7QUFEZ0I7QUFDSTtBQUdwQjtBQURvQjtBQUdwQjtBQURvQjtBQUdwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUlBO0FBQ0k7QUFDSjtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSjtBQUNRO0FBQ1I7QUFDUTtBQUNSO0FBQ0E7QUFDUTtBQUNSO0FBQ1k7QUFDQTtBQUNaO0FBQ0E7QUFDWTtBQUNBO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8g5qOL5a2Q566h55CGXG5sZXQgY2hlc3MgPSBbXTtcblxuY2hlc3NbMF0gPSB7XG4gICAgY3VycmVudFBvc2l0b24gOiAwLFxuICAgIGlzRGVhZCA6IGZhbHNlLFxuICAgIGNvbG9yOiAnd2hpdGUnXG59O1xuXG5jaGVzc1sxXSA9IHtcbiAgICBjdXJyZW50UG9zaXRvbiA6IDEsXG4gICAgaXNEZWFkIDogZmFsc2UsXG4gICAgY29sb3I6ICd3aGl0ZSdcbn07XG5cbmNoZXNzWzJdID0ge1xuICAgIGN1cnJlbnRQb3NpdG9uIDogMixcbiAgICBpc0RlYWQgOiBmYWxzZSxcbiAgICBjb2xvcjogJ3doaXRlJ1xufTtcblxuY2hlc3NbM10gPSB7fTtcblxuY2hlc3NbNF0gPSB7XG4gICAgY3VycmVudFBvc2l0b24gOiA0LFxuICAgIGlzRGVhZCA6IGZhbHNlLFxuICAgIGNvbG9yOiAnYmxhY2snXG59O1xuXG5jaGVzc1s1XSA9IHtcbiAgICBjdXJyZW50UG9zaXRvbiA6IDUsXG4gICAgaXNEZWFkIDogZmFsc2UsXG4gICAgY29sb3I6ICdibGFjaydcbn07XG5cbmNoZXNzWzZdID0ge1xuICAgIGN1cnJlbnRQb3NpdG9uIDogNixcbiAgICBpc0RlYWQgOiBmYWxzZSxcbiAgICBjb2xvcjogJ2JsYWNrJ1xufTtcblxuY2hlc3NbN10gPSB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2V0U3RhdHVzOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICByZXR1cm4gY2hlc3NbaW5kZXhdLmlzRGVhZDtcbiAgICB9LFxuICAgIGdldEN1cnJlbnRQb3NpdGlvbjogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGNoZXNzW2luZGV4XS5jdXJyZW50UG9zaXRvbjtcbiAgICB9LFxuICAgIGdldENvbG9yOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICBpZihpbmRleCAhPSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIGNoZXNzW2luZGV4XS5jb2xvcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0U3RhdHVzOiBmdW5jdGlvbihpbmRleCwgbmV3U3RhdHVzKSB7XG4gICAgICAgIGNoZXNzW2luZGV4XS5pc0RlYWQgPSBuZXdTdGF0dXM7XG4gICAgfSxcbiAgICBzZXRDdXJyZW50UG9zaXRpb246IGZ1bmN0aW9uKGluZGV4LCBuZXdQb3NpdGlvbikge1xuICAgICAgICBjaGVzc1tpbmRleF0uY3VycmVudFBvc2l0b24gPSBuZXdQb3NpdGlvbjtcbiAgICB9LFxuICAgIHNldENvbG9yOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g55CG6K665LiK5LiN6IO96YeN5paw6K6+572u5qOL5a2Q6aKc6ImyXG4gICAgfSxcblxufTsiLCJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBjaGVzczoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gbGV0IGNoZXNzTWdyID0gcmVxdWlyZSgnY2hlc3NNZ3InKTtcbiAgICAgICAgLy8gdGhpcy5jaGVzcy5zZXRQb3NpdGlvbihjaGVzc01nci5nZXRQb3NpdGlvbigpKTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIHBvaW50TWdyID0gcmVxdWlyZSgncG9pbnRNZ3InKSxcbiAgICBjaGVzc01nciA9IHJlcXVpcmUoJ2NoZXNzTWdyJyksXG4gICAgc29ja2V0ID0gd2luZG93LmlvKCdodHRwOi8vbG9jYWxob3N0OjMwMDAnKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGJhY2tncm91bmRBdWRpbzoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG4gICAgICAgIHBpY2tBdWRpbzoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG4gICAgICAgIHB1dEF1ZGlvOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICAgICAgY2hlc3NEaWVBdWRpbzoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG4gICAgICAgIGJsYWNrQ2hlc3NQcmVmYWI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcbiAgICAgICAgfSxcbiAgICAgICAgd2hpdGVDaGVzc1ByZWZhYjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9LFxuICAgICAgICBtb3ZlQWJsZTogZmFsc2UsXG4gICAgICAgIG1vdmluZ0NoZXNzTmFtZTogXCJcIixcbiAgICAgICAgbW92aW5nQ2hlc3NDb2xvcjogXCJcIixcbiAgICAgICAgbW92aW5nQ2hlc3NJbmRleDogMCxcbiAgICAgICAgb2xkUG9zaXRpb25YOiAwLFxuICAgICAgICBvbGRQb3NpdGlvblk6IDAsXG4gICAgICAgIGN1cnJlbnRDYW5Nb3ZlQ29sb3I6ICdibGFjaycsXG4gICAgICAgIGZsYWdXaGl0ZTogMCxcbiAgICAgICAgZmxhZ0JsYWNrOiAxLFxuICAgICAgICBteVVzZXJJZDonJ1xuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXG4gICAgICAgIC8vdmFyIGdldElkID0gd2luZG93LmlvKCdodHRwOi8vbG9jYWxob3N0OjMwMDAvZ2V0SWQnKTtcblxuICAgICAgICB2YXIgc29ja2V0ID0gd2luZG93LmlvKCdodHRwOi8vbG9jYWxob3N0OjMwMDAnKTtcbiAgICAgICAgc29ja2V0Lm9uKCdjb25uZWN0ZWQnLCBmdW5jdGlvbihtc2cpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgICAgICBzb2NrZXQub24oJ2dldFVzZXJJZCcsIGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5teVVzZXJJZCA9IGlkO1xuICAgICAgICAgICAgICAgIHNvY2tldC5lbWl0KCdzYXZlVXNlcicsIGlkKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn6I635Y+W5Yiw55qEIGlkOiAnLGlkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmluaXRDaGVzc1RvUG9pbnQoKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKFwidG91Y2hzdGFydFwiLCB0aGlzLm9uUHV0LCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKFwiY2hhbmdlUGxheWVyXCIsIHRoaXMub25DaGFuZ2VQbGF5ZXIsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oXCJjaGVja0RpZVBpZWNlXCIsIHRoaXMub25DaGVja0RpZVBpZWNlLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdjaGVzc01vdmVkJywgdGhpcy5vbkNoZXNzTW92ZWQsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oJ2NoZXNzTW92ZVRvJywgdGhpcy5vbkNoZXNzTW92ZVRvLCB0aGlzKTsgLy8g55uR5ZCs6LWw5qOLXG4gICAgICAgIC8vIHRoaXMubm9kZS5vbignc2V0T2xkUG9zaXRpb24nLCB0aGlzLm9uU2V0T2xkUG9zaXRpb24sIHRoaXMpO1xuICAgICAgICBcbiAgICAgICAgLy8g5riF56m65pen5L2N572uXG4gICAgICAgIHNvY2tldC5vbignY2xlYXJQb3NpdGlvbicsIGZ1bmN0aW9uKG9sZFBvaW50KSB7XG4gICAgICAgICAgICBwb2ludE1nci5pc0lucG9pbnQob2xkUG9pbnQsIGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+a4heepuuaXp+S9jee9ru+8micsIGluZGV4KTtcbiAgICAgICAgICAgICAgICBwb2ludE1nci5zZXRTdGF0dXMoaW5kZXgsIHRydWUpOyAgICAgICAgLy8g6K6+572u5bey56e76Zmk5qOL5a2Q5L2N572u55qE54q25oCBXG4gICAgICAgICAgICAgICAgcG9pbnRNZ3Iuc2V0Q3VycmVudFBpZWNlKGluZGV4LCAtMSk7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwb2ludE1nci5nZXRTdGF0dXMoaW5kZXgpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHNvY2tldC5vbignY2hlc3NNb3ZlVG8nLCBmdW5jdGlvbihtb3ZlRGF0YSkge1xuICAgICAgICAgICAgY2MuZmluZCgnQ2FudmFzJykuZW1pdCgnY2hlc3NNb3ZlVG8nLCBtb3ZlRGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgLy8g5ZCR5pyN5Yqh5Zmo5Y+R5bCE6LWw5qOLXG4gICAgb25DaGVzc01vdmVkOiBmdW5jdGlvbihtb3ZlRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhtb3ZlRGF0YS5kZXRhaWwpO1xuICAgICAgICBjb25zb2xlLmxvZyhtb3ZlRGF0YS5kZXRhaWwuY2hlc3NOdW1iZXIsIG1vdmVEYXRhLmRldGFpbC5uZXdQb3NpdGlvbik7XG4gICAgICAgIC8vaWYodGhpcy5mbGFnQmxhY2sgPT0gMSkge1xuICAgICAgICAgICAgc29ja2V0LmVtaXQoJ2NoZXNzTW92ZVRvJywgbW92ZURhdGEuZGV0YWlsKTtcbiAgICAgICAgLy8gICAgdGhpcy5mbGFnV2hpdGUgPSAxO1xuICAgICAgICAvLyAgICB0aGlzLmZsYWdCbGFjayA9IDA7XG4gICAgICAgIC8vfVxuICAgICAgICBjYy5maW5kKCdDYW52YXMnKS5lbWl0KCdjaGFuZ2VQbGF5ZXInLCB0aGlzKTtcbiAgICB9LFxuICAgIC8vIOaUtuWIsOacjeWKoeWZqOi1sOaji+S6i+S7tlxuICAgIG9uQ2hlc3NNb3ZlVG86IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgLy8gaWYodGhpcy5mbGFnQmxhY2sgPT0gMSkge1xuICAgICAgICAvLyAgICAgdGhpcy5mbGFnV2hpdGUgPSAxO1xuICAgICAgICAvLyAgICAgdGhpcy5mbGFnQmxhY2sgPSAwO1xuICAgICAgICBcbiAgICAgICAgICAgIGxldCBjaGVzc051bWJlciA9IGUuZGV0YWlsLmNoZXNzTnVtYmVyLFxuICAgICAgICAgICAgICAgIG5ld1Bvc2l0aW9uID0gcGFyc2VJbnQoZS5kZXRhaWwubmV3UG9zaXRpb24pLFxuICAgICAgICAgICAgICAgIHBvaW50TWdyID0gcmVxdWlyZSgncG9pbnRNZ3InKSxcbiAgICAgICAgICAgICAgICBtb3ZlQ2hlc3NOb2RlID0gY2MuZmluZCgnQ2FudmFzJykuZ2V0Q2hpbGRCeU5hbWUoJ2NoZXNzUGllY2UnK2NoZXNzTnVtYmVyKSxcbiAgICAgICAgICAgICAgICAvLyBwb3NpdGlvbiA9IHBvaW50TWdyLmdldFBvc2l0aW9uKHBhcnNlSW50KG5ld1Bvc2l0aW9uKSk7XG4gICAgICAgICAgICAgICAgcG9pbnRYID0gcG9pbnRNZ3IuZ2V0UG9pbnQobmV3UG9zaXRpb24pLngsIFxuICAgICAgICAgICAgICAgIHBvaW50WSA9IHBvaW50TWdyLmdldFBvaW50KG5ld1Bvc2l0aW9uKS55O1xuICAgICAgICAgICAgLy8gY2MubG9nKHBvc2l0aW9uKTtcbiAgICAgICAgICAgIG1vdmVDaGVzc05vZGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjEsIHBvaW50WCwgcG9pbnRZKSk7XG4gICAgICAgICAgICBjYy5maW5kKCdDYW52YXMnKS5lbWl0KCdjaGFuZ2VQbGF5ZXInLCB0aGlzKTtcbiAgICAgICAgLy99XG4gICAgfSxcblxuICAgIG9uVG91Y2hTdGFydDogZnVuY3Rpb24oZSkge1xuICAgICAgICAvLyDog73lpJ/ojrflj5blsZ7mgKfnmoTnsbtcbiAgICAgICAgbGV0IG1haW4gPSBjYy5maW5kKCdDYW52YXMnKS5nZXRDb21wb25lbnQoJ21haW4nKTtcbiAgICAgICAgY2MubG9nKCduYW1lOicsdGhpcy5uYW1lKVxuICAgICAgICAvLyDmo4DmtYvlvZPliY3otbDmo4vlr7nosaHpopzoibJcbiAgICAgICAgaWYodGhpcy5jaGVzc0NvbG9yID09ICBtYWluLmN1cnJlbnRDYW5Nb3ZlQ29sb3IpIHtcbiAgICAgICAgICAgIGNjLmZpbmQoJ0NhbnZhcycpLmVtaXQoJ3BpY2snLCB0aGlzLm5hbWUpO1xuICAgICAgICAgICAgdGhpcy5ydW5BY3Rpb24oY2Muc2NhbGVUbygwLjEsIDEuMiwgMS4yKSk7XG4gICAgICAgICAgICBjYy5sb2codGhpcy5jaGVzc0NvbG9yKTtcbiAgICAgICAgICAgIG1haW4ubW92ZUFibGUgPSB0cnVlO1xuICAgICAgICAgICAgbWFpbi5tb3ZpbmdDaGVzc05hbWUgPSB0aGlzLm5hbWU7XG4gICAgICAgICAgICBtYWluLm1vdmluZ0NoZXNzQ29sb3IgPSB0aGlzLmNoZXNzQ29sb3I7XG4gICAgICAgICAgICBtYWluLm1vdmluZ0NoZXNzSW5kZXggPSB0aGlzLmNoZXNzSW5kZXg7XG4gICAgICAgICAgICBtYWluLm9sZFBvc2l0aW9uWCA9IHRoaXMueDtcbiAgICAgICAgICAgIG1haW4ub2xkUG9zaXRpb25ZID0gdGhpcy55O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWxlcnQoJ+i/mOayoeWIsOS9oOi1sOaji+WTpu+8gScpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyDmjaHotbfmo4vlrZBcbiAgICBvblBpY2s6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYoZS5kZXRhaWwgIT09IHRoaXMubmFtZSkge1xuICAgICAgICAgICAgdGhpcy5ydW5BY3Rpb24oY2Muc2NhbGVUbygwLjEsMSwgMSkpO1xuICAgICAgICAgICAgY2MuZmluZCgnQ2FudmFzJykuZ2V0Q29tcG9uZW50KCdtYWluJykubW92ZUFibGUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNjLmZpbmQoJ0NhbnZhcycpLmVtaXQoJ3B1dCcsIHRoaXMubmFtZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vIOS6pOaNoumAieaJi1xuICAgIG9uQ2hhbmdlUGxheWVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY2MubG9nKHRoaXMpO1xuICAgICAgICBpZih0aGlzLmN1cnJlbnRDYW5Nb3ZlQ29sb3IgPT0gJ2JsYWNrJykgeyAgIFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Q2FuTW92ZUNvbG9yID0gJ3doaXRlJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudENhbk1vdmVDb2xvciA9ICdibGFjayc7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vIOiQveWtkFxuICAgIG9uUHV0OiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGxldCB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIG9sZFBvaW50ID0ge3g6IHRoYXQub2xkUG9zaXRpb25YICx5OiB0aGF0Lm9sZFBvc2l0aW9uWX0sXG4gICAgICAgICAgICBtb3ZlQWJsZSA9IGNjLmZpbmQoJ0NhbnZhcycpLmdldENvbXBvbmVudCgnbWFpbicpLm1vdmVBYmxlLCAgIC8vIOaYr+WQpuWPr+enu+WKqFxuICAgICAgICAgICAgbW92aW5nQ2hlc3NOYW1lID0gY2MuZmluZCgnQ2FudmFzJykuZ2V0Q29tcG9uZW50KCdtYWluJykubW92aW5nQ2hlc3NOYW1lLCAgIC8vIOWPr+enu+WKqOeahOaji+WtkCBuYW1lXG4gICAgICAgICAgICBtb3ZpbmdDaGVzc0NvbG9yID0gY2MuZmluZCgnQ2FudmFzJykuZ2V0Q29tcG9uZW50KCdtYWluJykubW92aW5nQ2hlc3NDb2xvciwgICAvLyDlj6/np7vliqjnmoTmo4vlrZDpopzoibJcbiAgICAgICAgICAgIG1vdmluZ0NoZXNzSW5kZXggPSBjYy5maW5kKCdDYW52YXMnKS5nZXRDb21wb25lbnQoJ21haW4nKS5tb3ZpbmdDaGVzc0luZGV4LCAgIC8vIOWPr+enu+WKqOeahOaji+WtkOe8luWPt1xuICAgICAgICAgICAgbW92ZUNoZXNzTm9kZSA9IGNjLmZpbmQoJ0NhbnZhcycpLmdldENoaWxkQnlOYW1lKG1vdmluZ0NoZXNzTmFtZSksICAvLyDlj6/np7vliqjmo4vlrZDnmoToioLngrlcbiAgICAgICAgICAgIHRhcmdldFBvaW50ID0gdGhpcy5ub2RlLmNvbnZlcnRUb05vZGVTcGFjZUFSKGUuZ2V0TG9jYXRpb24oKSksXG4gICAgICAgICAgICBwb2ludE1nciA9IHJlcXVpcmUoJ3BvaW50TWdyJyksXG4gICAgICAgICAgICBjaGVzc01nciA9IHJlcXVpcmUoJ2NoZXNzTWdyJyk7XG5cbiAgICAgICAgLy8gY2MubG9nKG9sZFBvaW50KTtcbiAgICAgICAgcG9pbnRNZ3IuaXNJbnBvaW50KHRhcmdldFBvaW50LCBmdW5jdGlvbihpbmRleCkgeyAgIC8vIOS8oOmAkuebruagh+WdkOagh++8jOWmguaenOWcqOW3suWumuS5ieeahOeCueiMg+WbtOWGheWImei/lOWbnuivpeW3suWumuS5ieeCueeahOe0ouW8lVxuICAgICAgICAgICAgbGV0IHBvaW50WCA9IHBvaW50TWdyLmdldFBvaW50KGluZGV4KS54LCBcbiAgICAgICAgICAgICAgICBwb2ludFkgPSBwb2ludE1nci5nZXRQb2ludChpbmRleCkueTtcbiAgICAgICAgICAgIC8vIGNjLmxvZyhwb2ludFgsIHBvaW50WSlcbiAgICAgICAgICAgIGlmKHBvaW50WCAmJiBwb2ludFkgJiYgcG9pbnRNZ3IuZ2V0U3RhdHVzKGluZGV4KSkgeyAvLyDliKTmlq3mmK/lkKbmnInmo4vlrZDvvIzlnZDmoIfmmK/lkKblrZjlnKhcbiAgICAgICAgICAgICAgICBpZihtb3ZlQ2hlc3NOb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG1vdmVDaGVzc05vZGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjEsIHBvaW50WCwgcG9pbnRZKSk7ICAgLy8g5qC55o2u5LqL5Lu25Lyg6L+H5p2l55qE55uu5qCH54K55YGa56e75YqoXG4gICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoJ0NhbnZhcycpLmdldENvbXBvbmVudCgnbWFpbicpLm1vdmluZ0NoZXNzTmFtZSA9ICcnOyAgLy8g5riF56m65Y+v6LWw5qOL5a2QXG4gICAgICAgICAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhhdC5wdXRBdWRpbywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBwb2ludE1nci5zZXRTdGF0dXMoaW5kZXgsIGZhbHNlKTsgICAgIC8vIOiuvue9ruivpeS9jee9ruW3suWNoOeUqFxuICAgICAgICAgICAgICAgICAgICBwb2ludE1nci5zZXRDb2xvcihpbmRleCwgbW92aW5nQ2hlc3NDb2xvcik7ICAgICAvLyDorr7nva7ntKLlvJXlgLzkvY3nva7mlrDpopzoibJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhhdC5zZXRPbGRQb3NpdGlvbihvbGRQb2ludCwgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBzb2NrZXQuZW1pdCgnc2V0T2xkUG9zaXRpb24nLCBvbGRQb2ludCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRhcmdldFBvaW50ICE9PSBvbGRQb2ludCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MubG9nKCflvZPliY3np7vliqjmo4vlrZDkuLrvvJonLCBtb3ZpbmdDaGVzc0luZGV4LCAn56e75Yqo5Yiw77yaICcsIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtb3ZlRGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVzc051bWJlcjptb3ZpbmdDaGVzc0luZGV4LCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdQb3NpdGlvbjppbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKCdDYW52YXMnKS5lbWl0KCdjaGVzc01vdmVkJywgbW92ZURhdGEpOyAvLyDlj5HlsIQgc29ja2V0IOS6i+S7tlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRNZ3Iuc2V0Q3VycmVudFBpZWNlKGluZGV4LCBtb3ZpbmdDaGVzc0luZGV4KTsgICAvLyDorr7nva7lr7nlupTkvY3nva7nmoTmo4vlrZDnvJblj7dcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoJ0NhbnZhcycpLmVtaXQoJ2NoYW5nZVBsYXllcicsIHRoYXQpOyAgICAvLyDlj5HlsITkuqTmjaLpgInmiYvkuovku7ZcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNjLmZpbmQoJ0NhbnZhcycpLmVtaXQoJ2NoZWNrRGllUGllY2UnLCB0aGF0KTsgICAgLy8g5Y+R5bCE5qOA5p+l5piv5ZCm6ZyA6KaB5o6Q5a2Q5LqL5Lu2XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm9uQ2hlY2tEaWVQaWVjZShpbmRleCwgZnVuY3Rpb24ocGllY2VOdW1iZXIsIHBvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MubG9nKHBpZWNlTnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiggKHBpZWNlTnVtYmVyICE9PSAnJykgJiYgKCBwaWVjZU51bWJlciAhPT0gLTEgKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ2NoZXNzUGllY2UnK3BpZWNlTnVtYmVyKS5kZXN0cm95KCk7ICAvLyDplIDmr4HmrbvkuqHnmoTmo4vlrZDoioLngrlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MubG9nKCfmo4vlrZAnLCBwaWVjZU51bWJlciwgJ+atu+S6oScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoYXQuY2hlc3NEaWVBdWRpbywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludE1nci5zZXRTdGF0dXMocG9pbnQsIHRydWUpOyAgLy8g6K6+572u5qOL5a2Q5bey5q275Lqh5L2N572u5Y+v6YeN5paw6JC95a2QXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZXNzTWdyLnNldFN0YXR1cyhwaWVjZU51bWJlciwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgLy8g5qOA5p+l5piv5ZCm6ZyA6KaB5o6Q5a2QXG4gICAgLy8gQGluZGV4IOS4uuW9k+WJjeS9jee9rue0ouW8lVxuICAgIG9uQ2hlY2tEaWVQaWVjZTogZnVuY3Rpb24oaW5kZXgsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNjLmxvZygn56e75Yqo5Yiw5LqGOicsIGluZGV4KVxuICAgICAgICBsZXQgcG9pbnRNZ3IgPSByZXF1aXJlKCdwb2ludE1ncicpLFxuICAgICAgICAgICAgY2hlc3NNZ3IgPSByZXF1aXJlKCdjaGVzc01ncicpO1xuICAgICAgICBpZihpbmRleCA9PSAxKSB7XG4gICAgICAgICAgICBsZXQgcDFDb2xvciA9IGNoZXNzTWdyLmdldENvbG9yKHBvaW50TWdyLmdldEN1cnJlbnRQaWVjZSgxKSksIFxuICAgICAgICAgICAgICAgIHAwQ29sb3IgPSBjaGVzc01nci5nZXRDb2xvcihwb2ludE1nci5nZXRDdXJyZW50UGllY2UoMCkpLCBcbiAgICAgICAgICAgICAgICBwN0NvbG9yID0gY2hlc3NNZ3IuZ2V0Q29sb3IocG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDcpKSwgXG4gICAgICAgICAgICAgICAgcDJDb2xvciA9IGNoZXNzTWdyLmdldENvbG9yKHBvaW50TWdyLmdldEN1cnJlbnRQaWVjZSgyKSksIFxuICAgICAgICAgICAgICAgIHAzQ29sb3IgPSBjaGVzc01nci5nZXRDb2xvcihwb2ludE1nci5nZXRDdXJyZW50UGllY2UoMykpO1xuICAgICAgICAgICAgaWYoKHAxQ29sb3IgPT0gcDdDb2xvcikgJiYgKHAxQ29sb3IgIT0gcDBDb2xvcikgJiYgKHAwQ29sb3IgIT0gJ3VuZGVmaW5lZCcpKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2socG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDApLCAwKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZigocDFDb2xvciA9PSBwM0NvbG9yKSAmJiAocDFDb2xvciAhPSBwMkNvbG9yKSAmJiAocDJDb2xvciAhPSAndW5kZWZpbmVkJykgKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2socG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDIpLCAyKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH1cbiAgICAgICAgaWYoaW5kZXggPT0gMykge1xuICAgICAgICAgICAgbGV0IHAxQ29sb3IgPSBjaGVzc01nci5nZXRDb2xvcihwb2ludE1nci5nZXRDdXJyZW50UGllY2UoMSkpLCBcbiAgICAgICAgICAgICAgICBwMkNvbG9yID0gY2hlc3NNZ3IuZ2V0Q29sb3IocG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDIpKSwgXG4gICAgICAgICAgICAgICAgcDNDb2xvciA9IGNoZXNzTWdyLmdldENvbG9yKHBvaW50TWdyLmdldEN1cnJlbnRQaWVjZSgzKSksXG4gICAgICAgICAgICAgICAgcDRDb2xvciA9IGNoZXNzTWdyLmdldENvbG9yKHBvaW50TWdyLmdldEN1cnJlbnRQaWVjZSg0KSksIFxuICAgICAgICAgICAgICAgIHA1Q29sb3IgPSBjaGVzc01nci5nZXRDb2xvcihwb2ludE1nci5nZXRDdXJyZW50UGllY2UoNSkpO1xuICAgICAgICAgICAgaWYoKHAxQ29sb3IgPT0gcDNDb2xvcikgJiYgKHAxQ29sb3IgIT0gcDJDb2xvcikgJiYgKHAyQ29sb3IgIT0gJ3VuZGVmaW5lZCcpKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2socG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDIpLCAyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZigocDNDb2xvciA9PSBwNUNvbG9yKSAmJiAocDNDb2xvciAhPSBwNENvbG9yKSAmJiAocDRDb2xvciAhPSAndW5kZWZpbmVkJykgKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2socG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDQpLCA0KTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH1cbiAgICAgICAgaWYoaW5kZXggPT0gNSkge1xuICAgICAgICAgICAgbGV0IHAzQ29sb3IgPSBjaGVzc01nci5nZXRDb2xvcihwb2ludE1nci5nZXRDdXJyZW50UGllY2UoMykpLCBcbiAgICAgICAgICAgICAgICBwNENvbG9yID0gY2hlc3NNZ3IuZ2V0Q29sb3IocG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDQpKSwgXG4gICAgICAgICAgICAgICAgcDVDb2xvciA9IGNoZXNzTWdyLmdldENvbG9yKHBvaW50TWdyLmdldEN1cnJlbnRQaWVjZSg1KSksXG4gICAgICAgICAgICAgICAgcDZDb2xvciA9IGNoZXNzTWdyLmdldENvbG9yKHBvaW50TWdyLmdldEN1cnJlbnRQaWVjZSg2KSksIFxuICAgICAgICAgICAgICAgIHA3Q29sb3IgPSBjaGVzc01nci5nZXRDb2xvcihwb2ludE1nci5nZXRDdXJyZW50UGllY2UoNykpO1xuICAgICAgICAgICAgaWYoKHAzQ29sb3IgPT0gcDVDb2xvcikgJiYgKHAzQ29sb3IgIT0gcDRDb2xvcikgJiYgKHA0Q29sb3IgIT0gJ3VuZGVmaW5lZCcpKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2socG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDQpLCA0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZigocDVDb2xvciA9PSBwN0NvbG9yKSAmJiAocDVDb2xvciAhPSBwNkNvbG9yKSAmJiAocDZDb2xvciAhPSAndW5kZWZpbmVkJykgKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2socG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDYpLCA2KTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH1cblxuICAgICAgICBpZihpbmRleCA9PSA3KSB7XG4gICAgICAgICAgICBsZXQgcDVDb2xvciA9IGNoZXNzTWdyLmdldENvbG9yKHBvaW50TWdyLmdldEN1cnJlbnRQaWVjZSg1KSksIFxuICAgICAgICAgICAgICAgIHA2Q29sb3IgPSBjaGVzc01nci5nZXRDb2xvcihwb2ludE1nci5nZXRDdXJyZW50UGllY2UoNikpLCBcbiAgICAgICAgICAgICAgICBwN0NvbG9yID0gY2hlc3NNZ3IuZ2V0Q29sb3IocG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDcpKSxcbiAgICAgICAgICAgICAgICBwMENvbG9yID0gY2hlc3NNZ3IuZ2V0Q29sb3IocG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDApKSwgXG4gICAgICAgICAgICAgICAgcDFDb2xvciA9IGNoZXNzTWdyLmdldENvbG9yKHBvaW50TWdyLmdldEN1cnJlbnRQaWVjZSgxKSk7XG4gICAgICAgICAgICBpZigocDVDb2xvciA9PSBwN0NvbG9yKSAmJiAocDVDb2xvciAhPSBwNkNvbG9yKSAmJiAocDZDb2xvciAhPSAndW5kZWZpbmVkJykpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhwb2ludE1nci5nZXRDdXJyZW50UGllY2UoNiksIDYpO1xuICAgICAgICAgICAgfSBlbHNlIGlmKChwN0NvbG9yID09IHAxQ29sb3IpICYmIChwN0NvbG9yICE9IHAwQ29sb3IpICYmIChwMENvbG9yICE9ICd1bmRlZmluZWQnKSApIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhwb2ludE1nci5nZXRDdXJyZW50UGllY2UoMCksIDApO1xuICAgICAgICAgICAgfSBcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvblNldE9sZFBvc2l0aW9uOiBmdW5jdGlvbihvbGRQb2ludCkge1xuICAgICAgICBsZXQgcG9pbnRNZ3IgPSByZXF1aXJlKCdwb2ludE1ncicpO1xuICAgICAgICBwb2ludE1nci5pc0lucG9pbnQob2xkUG9pbnQsIGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICBwb2ludE1nci5zZXRTdGF0dXMoaW5kZXgsIHRydWUpOyAgICAgICAgLy8g6K6+572u5bey56e76Zmk5qOL5a2Q5L2N572u55qE54q25oCBXG4gICAgICAgICAgICBwb2ludE1nci5zZXRDdXJyZW50UGllY2UoaW5kZXgsIC0xKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNldE9sZFBvc2l0aW9uOiBmdW5jdGlvbihvbGRQb2ludCkge1xuICAgICAgICAvLyDmo4vlrZDml6fkvY3nva7muIXnqbpcbiAgICAgICAgc29ja2V0LmVtaXQoJ3NldE9sZFBvc2l0aW9uJywgb2xkUG9pbnQpO1xuICAgIH0sXG5cbiAgICAvLyDliJ3lp4vljJbmlL7nva7mo4vlrZDliLDpu5jorqTkvY3nva5cbiAgICBpbml0Q2hlc3NUb1BvaW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgcG9pbnRNZ3IgPSByZXF1aXJlKCdwb2ludE1ncicpLFxuICAgICAgICAgICAgY2hlc3NNZ3IgPSByZXF1aXJlKCdjaGVzc01ncicpO1xuICAgICAgICBmb3IobGV0IGk9MDtpPDg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHBvaW50ID0gcG9pbnRNZ3IuZ2V0UG9pbnQoaSksIFxuICAgICAgICAgICAgICAgIGNoZXNzTWdyQ29sb3IgPSBjaGVzc01nci5nZXRDb2xvcihpKSxcbiAgICAgICAgICAgICAgICB4ID0gcG9pbnQueCwgXG4gICAgICAgICAgICAgICAgeSA9IHBvaW50Lnk7XG5cbiAgICAgICAgICAgIGlmKGNoZXNzTWdyQ29sb3IgPT0gJ3doaXRlJykge1xuICAgICAgICAgICAgICAgIGxldCBuZXdDaGVzcyA9IGNjLmluc3RhbnRpYXRlKHRoYXQud2hpdGVDaGVzc1ByZWZhYik7XG4gICAgICAgICAgICAgICAgdGhhdC5ub2RlLmFkZENoaWxkKG5ld0NoZXNzKTtcbiAgICAgICAgICAgICAgICBuZXdDaGVzcy5zZXRQb3NpdGlvbih4LCB5KTtcbiAgICAgICAgICAgICAgICBuZXdDaGVzcy5uYW1lID0gJ2NoZXNzUGllY2UnK2k7XG4gICAgICAgICAgICAgICAgbmV3Q2hlc3MuY2hlc3NDb2xvciA9ICd3aGl0ZSc7XG4gICAgICAgICAgICAgICAgbmV3Q2hlc3MuY2hlc3NJbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgY2MuZmluZCgnQ2FudmFzJykub24oJ3BpY2snLCB0aGF0Lm9uUGljaywgbmV3Q2hlc3MpO1xuICAgICAgICAgICAgICAgIG5ld0NoZXNzLm9uKCd0b3VjaHN0YXJ0JywgdGhhdC5vblRvdWNoU3RhcnQsIG5ld0NoZXNzKTtcbiAgICAgICAgICAgIH0gIGVsc2UgaWYoY2hlc3NNZ3JDb2xvciA9PSAnYmxhY2snKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5ld0NoZXNzID0gY2MuaW5zdGFudGlhdGUodGhpcy5ibGFja0NoZXNzUHJlZmFiKTtcbiAgICAgICAgICAgICAgICB0aGF0Lm5vZGUuYWRkQ2hpbGQobmV3Q2hlc3MpO1xuICAgICAgICAgICAgICAgIG5ld0NoZXNzLnNldFBvc2l0aW9uKHgsIHkpO1xuICAgICAgICAgICAgICAgIG5ld0NoZXNzLm5hbWUgPSAnY2hlc3NQaWVjZScraTtcbiAgICAgICAgICAgICAgICBuZXdDaGVzcy5jaGVzc0NvbG9yID0gJ2JsYWNrJztcbiAgICAgICAgICAgICAgICBuZXdDaGVzcy5jaGVzc0luZGV4ID0gaTtcbiAgICAgICAgICAgICAgICBjYy5maW5kKCdDYW52YXMnKS5vbigncGljaycsIHRoYXQub25QaWNrLCBuZXdDaGVzcyk7XG4gICAgICAgICAgICAgICAgbmV3Q2hlc3Mub24oJ3RvdWNoc3RhcnQnLCB0aGF0Lm9uVG91Y2hTdGFydCwgbmV3Q2hlc3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyDmo4vlrZDnp7vliqhcbiAgICBjaGVzc01vdmU6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIGxldCB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIGlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgIGVsLm9uKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2NhbGVBY3Rpb24gPSBjYy5zY2FsZUJ5KDAuMSwxLjUsIDEuNSk7XG4gICAgICAgICAgICB0aGlzLnJ1bkFjdGlvbihzY2FsZUFjdGlvbik7XG4gICAgICAgIH0uYmluZChlbCkpO1xuICAgIH0sXG4gICAgYWRkTmV3Q2hlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgY2hlc3NNZ3IgPSByZXF1aXJlKCdjaGVzc01ncicpLFxuICAgICAgICAgICAgeCA9IGNoZXNzTWdyLmdldFBvc2l0aW9uWCgpLFxuICAgICAgICAgICAgeSA9IGNoZXNzTWdyLmdldFBvc2l0aW9uWSgpLFxuICAgICAgICAgICAgbmV3Q2hlc3MgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNoZXNzUHJlZmFiKTtcbiAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKG5ld0NoZXNzKTtcbiAgICAgICAgY29uc29sZS5sb2coeCwgeSk7XG4gICAgICAgIG5ld0NoZXNzLnNldFBvc2l0aW9uKHgsIHkpO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgfVxufSk7XG4iLCIvLyDmo4vnm5jnrqHnkIZcbmxldCBwb2ludCA9IFtdO1xucG9pbnRbMF0gPSB7XG4gICAgeDogLTI0NixcbiAgICB5OiAyNjYsXG4gICAgaXNFbXB0eTogZmFsc2UsXG4gICAgY29sb3I6IFwid2hpdGVcIixcbiAgICBjdXJyZW50UGllY2U6IDBcbn07XG5wb2ludFsxXSA9IHtcbiAgICB4OiA0LFxuICAgIHk6IDI2NixcbiAgICBpc0VtcHR5OiBmYWxzZSxcbiAgICBjb2xvcjogXCJ3aGl0ZVwiLFxuICAgIGN1cnJlbnRQaWVjZTogMVxufTtcbnBvaW50WzJdID0ge1xuICAgIHg6IDI0NixcbiAgICB5OiAyNjYsXG4gICAgaXNFbXB0eTogZmFsc2UsXG4gICAgY29sb3I6IFwid2hpdGVcIixcbiAgICBjdXJyZW50UGllY2U6IDJcbn07XG5cbnBvaW50WzNdID0ge1xuICAgIHg6IDI1MCxcbiAgICB5OiAyMCxcbiAgICBpc0VtcHR5OiB0cnVlLFxuICAgIGNvbG9yOiBcIlwiLFxuICAgIGN1cnJlbnRQaWVjZTogLTFcbn07XG5cbnBvaW50WzRdID0ge1xuICAgIHg6IDI0NCxcbiAgICB5OiAtMjI3LFxuICAgIGlzRW1wdHk6IGZhbHNlLFxuICAgIGNvbG9yOiBcImJsYWNrXCIsXG4gICAgY3VycmVudFBpZWNlOiA0XG59O1xuXG5wb2ludFs1XSA9IHtcbiAgICB4OiAxLFxuICAgIHk6IC0yMzEsXG4gICAgaXNFbXB0eTogZmFsc2UsXG4gICAgY29sb3I6IFwiYmxhY2tcIixcbiAgICBjdXJyZW50UGllY2U6IDVcbn07XG5cbnBvaW50WzZdID0ge1xuICAgIHg6IC0yNTAsXG4gICAgeTogLTIyNyxcbiAgICBpc0VtcHR5OiBmYWxzZSxcbiAgICBjb2xvcjogXCJibGFja1wiLFxuICAgIGN1cnJlbnRQaWVjZTogNlxufTtcblxucG9pbnRbN10gPSB7XG4gICAgeDogLTI1MCxcbiAgICB5OiAxNCxcbiAgICBpc0VtcHR5OiB0cnVlLFxuICAgIGNvbG9yOiBcIlwiLFxuICAgIGN1cnJlbnRQaWVjZTogLTFcbn07XG5cbi8vIGNvbnNvbGUubG9nKHBvaW50KVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBwb2ludDogcG9pbnQsXG4gICAgZ2V0UG9pbnQ6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIHJldHVybiBwb2ludFtpbmRleF07XG4gICAgfSxcbiAgICBnZXRQb3NpdGlvbjogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuKHBvaW50W2luZGV4XS54ICsgJywnICsgcG9pbnRbaW5kZXhdLnkpO1xuICAgIH0sXG4gICAgZ2V0U3RhdHVzOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICByZXR1cm4gcG9pbnRbaW5kZXhdLmlzRW1wdHk7XG4gICAgfSxcbiAgICBnZXRDb2xvcjogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHBvaW50W2luZGV4XS5jb2xvcjtcbiAgICB9LFxuICAgIC8vIOi/lOWbnue0ouW8leWAvOS9jee9rueCueWvueW6lOeahOaji+WtkOe8luWPt1xuICAgIGdldEN1cnJlbnRQaWVjZTogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHBvaW50W2luZGV4XS5jdXJyZW50UGllY2U7XG4gICAgfSxcbiAgICBzZXRTdGF0dXM6IGZ1bmN0aW9uKGluZGV4LCBib29sKSB7XG4gICAgICAgIHBvaW50W2luZGV4XS5pc0VtcHR5ID0gYm9vbDtcbiAgICAgICAgY2MubG9nKCforr7nva4nLCBpbmRleCwgJ+S4uicsIGJvb2wpO1xuICAgICAgICAvL2NjLmxvZyhwb2ludFtpbmRleF0pO1xuICAgIH0sXG4gICAgc2V0Q29sb3I6IGZ1bmN0aW9uKGluZGV4LCBuZXdDb2xvcikge1xuICAgICAgICBwb2ludFtpbmRleF0uY29sb3IgPSBuZXdDb2xvcjtcbiAgICB9LFxuICAgIC8vIOiuvue9rue0ouW8leWAvCBpbmRleCDlr7nlupTnmoQgY3VycmVudFBpZWNlIOS4uiBjaGVzc051bWJlciDlj7fmo4vlrZBcbiAgICBzZXRDdXJyZW50UGllY2U6IGZ1bmN0aW9uKGluZGV4LCBjaGVzc051bWJlcikge1xuICAgICAgICAgcG9pbnRbaW5kZXhdLmN1cnJlbnRQaWVjZSA9IGNoZXNzTnVtYmVyO1xuICAgIH0sXG4gICAgaXNJbnBvaW50OiBmdW5jdGlvbih0YXJnZXRQb2ludCwgY2FsbGJhY2spIHtcbiAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXRQb2ludCk7XG4gICAgICAgIGxldCB0YXJnZXRQb2ludFggPSB0YXJnZXRQb2ludC54LCB0YXJnZXRQb2ludFkgPSB0YXJnZXRQb2ludC55LCByYW5nZSA9IDEyMCAgO1xuICAgICAgICAvL2Zvcih2YXIgaSA9IDA7IGkgPiBwb2ludC5sZW5ndGg7IGkgKysgKSB7XG4gICAgICAgICAgICAvL2xldCB4ID0gcG9pbnRbaV0ueCwgeSA9IHBvaW50W2ldLnksIFxuICAgICAgICAgICAgLy8g6IyD5Zu05Z2Q5qCHXG4gICAgICAgICAgICBpZih0YXJnZXRQb2ludFggPiByYW5nZSApIHtcbiAgICAgICAgICAgICAgICBpZih0YXJnZXRQb2ludFk8PXJhbmdlJiZ0YXJnZXRQb2ludFk+PS1yYW5nZSl7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKDMpO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmICh0YXJnZXRQb2ludFk+cmFuZ2Upe1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygyKTtcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZiAodGFyZ2V0UG9pbnRZPC1yYW5nZSl7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKDQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNlIGlmKHRhcmdldFBvaW50WDwtcmFuZ2Upe1xuICAgICAgICAgICAgICAgIGlmKHRhcmdldFBvaW50WT5yYW5nZSl7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKDApO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmKHRhcmdldFBvaW50WTw9cmFuZ2UmJnRhcmdldFBvaW50WT49LXJhbmdlKXtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soNyk7XG4gICAgICAgICAgICAgICAgfWVsc2UgaWYodGFyZ2V0UG9pbnRZPC1yYW5nZSl7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKDYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGlmKHRhcmdldFBvaW50WT5yYW5nZSl7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKDEpO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmKHRhcmdldFBvaW50WTwtcmFuZ2Upe1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayg1KTtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAvL31cbiAgICB9XG59O1xuXG4iLCJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICByb29tUHJlZmFiOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJJZCA6ICcnXG5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIOiuvue9riB1c2VyaWRcbiAgICAgICAgdGhpcy51c2VySWQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMik7XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgc29ja2V0ID0gd2luZG93LmlvKCdodHRwOi8vbG9jYWxob3N0OjMwMDAnKTtcbiAgICAgICAgXG4gICAgICAgIHNvY2tldC5vbignY29ubmVjdGVkJywgZnVuY3Rpb24obXNnKSB7XG4gICAgICAgICAgICAvLyBzb2NrZXQg6ZO+5o6l5oiQ5Yqf77yM5L+u5pS5IGxhYmVsIOaWh+Wtl1xuICAgICAgICAgICAgdmFyIGxhYmVsID0gdGhhdC5ub2RlLmdldENoaWxkcmVuKCduZXR3b3JrTGFiZWwnKTtcbiAgICAgICAgICAgIGxhYmVsWzBdLmdldENvbXBvbmVudChcImNjLkxhYmVsXCIpLnN0cmluZyA9IG1zZztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8g5Yid5aeL5YyW77yM5LygIHVzZXJJZCDliLDlkI7lj7BcbiAgICAgICAgICAgIHNvY2tldC5lbWl0KCdnYW1lX2luaXQnLCB0aGF0LnVzZXJJZCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnMTEnKTtcbiAgICAgICAgICAgIC8vIOiOt+WPluaIv+mXtOWIl+ihqFxuXG4gICAgICAgIH0pO1xuXG5cblxuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iXX0=