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
        currentCanMoveColor: 'black'
    },

    // use this for initialization
    onLoad: function onLoad() {

        var getId = window.io('http://localhost:3000/getId');

        socket.on('connected', function (msg) {
            console.log(msg);
            socket.on('getUserId', function (id) {
                // this.uuid = id;
            });
        });

        this.initChessToPoint();
        this.node.on("touchstart", this.onPut, this);
        this.node.on("changePlayer", this.onChangePlayer, this);
        this.node.on("checkDiePiece", this.onCheckDiePiece, this);
        this.node.on('chessMoved', this.onChessMoved, this);
        this.node.on('chessMoveTo', this.onChessMoveTo, this);

        socket.on('chessMoveTo', function (moveData) {
            cc.find('Canvas').emit('chessMoveTo', moveData);
        });
    },

    onChessMoved: function onChessMoved(moveData) {
        console.log(moveData.detail);
        console.log(moveData.detail.chessNumber, moveData.detail.newPosition);
        socket.emit('chessMoveTo', moveData.detail);
    },

    onChessMoveTo: function onChessMoveTo(e) {
        var chessNumber = e.detail.chessNumber,
            newPosition = parseInt(e.detail.newPosition),
            pointMgr = require('pointMgr'),
            moveChessNode = cc.find('Canvas').getChildByName('chessPiece' + chessNumber),
            position = pointMgr.getPosition(parseInt(newPosition));
        cc.log(newPosition);
        moveChessNode.runAction(cc.moveTo(0.1, position));
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
                    moveChessNode.runAction(cc.moveTo(0.1, pointX, pointY)); // 根据事件传过来的目标点做移动
                    cc.find('Canvas').getComponent('main').movingChessName = ''; // 清空可走棋子
                    cc.audioEngine.playEffect(that.putAudio, false);
                    pointMgr.setStatus(index, false); // 设置该位置已占用
                    pointMgr.setColor(index, movingChessColor); // 设置索引值位置新颜色
                    that.setOldPosition(oldPoint, index);
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

    setOldPosition: function setOldPosition(oldPoint) {
        var pointMgr = require('pointMgr');
        pointMgr.isInpoint(oldPoint, function (index) {
            pointMgr.setStatus(index, true); // 设置已移除棋子位置的状态
            pointMgr.setCurrentPiece(index, -1);
        });
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
},{}]},{},["chess","chessMgr","main","pointMgr"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL1NjcmlwdC9jaGVzc01nci5qcyIsImFzc2V0cy9TY3JpcHQvY2hlc3MuanMiLCJhc3NldHMvU2NyaXB0L21haW4uanMiLCJhc3NldHMvU2NyaXB0L3BvaW50TWdyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ1I7QUFDSTtBQUNJO0FBQ1I7QUFDSTtBQUNJO0FBQ0k7QUFDWjtBQUNZO0FBQ1o7QUFDQTtBQUNJO0FBQ0k7QUFDUjtBQUNJO0FBQ0k7QUFDUjtBQUNJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0k7QUFDSjtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNKO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNSO0FBQ0E7QUFDQTtBQUNJO0FBQ0o7QUFDUTtBQUNSO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDUTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDUjtBQUNRO0FBQ0k7QUFDWjtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNSO0FBQ0E7QUFDSTtBQUNJO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDUTtBQUNBO0FBQ1I7QUFDQTtBQUNJO0FBQ0o7QUFDUTtBQUNBO0FBQ1I7QUFDUTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNaO0FBQ1k7QUFDWjtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFDQTtBQUNaO0FBQ1k7QUFDWjtBQUNBO0FBQ0E7QUFDSTtBQUNKO0FBQ1E7QUFDSTtBQUNaO0FBQ1k7QUFDWjtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ1I7QUFDQTtBQUNBO0FBQVk7QUFFWjtBQURZO0FBR1o7QUFGWTtBQUlaO0FBSFk7QUFLWjtBQUpZO0FBTVo7QUFDQTtBQUNBO0FBQ0E7QUFKUTtBQU1SO0FBTFk7QUFPWjtBQUNBO0FBTFk7QUFPWjtBQU5nQjtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFRNUI7QUFOd0I7QUFDQTtBQUNBO0FBUXhCO0FBTndCO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFRaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTkk7QUFDSTtBQUNBO0FBUVI7QUFOUTtBQUNJO0FBUVo7QUFDQTtBQUNBO0FBQ0E7QUFOWTtBQUNJO0FBUWhCO0FBTmdCO0FBUWhCO0FBQ0E7QUFOUTtBQUNJO0FBUVo7QUFDQTtBQUNBO0FBQ0E7QUFOWTtBQUNJO0FBUWhCO0FBTmdCO0FBUWhCO0FBQ0E7QUFOUTtBQUNJO0FBUVo7QUFDQTtBQUNBO0FBQ0E7QUFOWTtBQUNJO0FBUWhCO0FBTmdCO0FBUWhCO0FBQ0E7QUFDQTtBQU5RO0FBQ0k7QUFRWjtBQUNBO0FBQ0E7QUFDQTtBQU5ZO0FBQ0k7QUFRaEI7QUFOZ0I7QUFRaEI7QUFDQTtBQUNBO0FBQ0E7QUFOSTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBUVo7QUFDQTtBQUNBO0FBQ0E7QUFOSTtBQUNJO0FBUVI7QUFDQTtBQU5RO0FBQ0k7QUFRWjtBQUNBO0FBQ0E7QUFDQTtBQU5ZO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVFoQjtBQU5nQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUWhCO0FBQ0E7QUFDQTtBQUNBO0FBTkk7QUFDSTtBQVFSO0FBTlE7QUFDSTtBQUNBO0FBUVo7QUFDQTtBQU5JO0FBQ0k7QUFRUjtBQUNBO0FBQ0E7QUFOUTtBQUNBO0FBQ0E7QUFRUjtBQUNBO0FBTkk7QUFRSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxU0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSjtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSjtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDUjtBQUNJO0FBQ0k7QUFDUjtBQUNJO0FBQ0k7QUFDUjtBQUNJO0FBQ0k7QUFDUjtBQUNBO0FBQ0k7QUFDSTtBQUNSO0FBQ0k7QUFDSTtBQUNBO0FBQ1I7QUFDQTtBQUNJO0FBQ0k7QUFDUjtBQUNBO0FBQ0k7QUFDSztBQUNUO0FBQ0k7QUFDSjtBQUNRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURZO0FBQ0k7QUFDSTtBQUdwQjtBQURvQjtBQUdwQjtBQURvQjtBQUdwQjtBQUNBO0FBRGdCO0FBQ0k7QUFHcEI7QUFEb0I7QUFHcEI7QUFEb0I7QUFHcEI7QUFDQTtBQURnQjtBQUNJO0FBR3BCO0FBRG9CO0FBR3BCO0FBRG9CO0FBR3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIOaji+WtkOeuoeeQhlxubGV0IGNoZXNzID0gW107XG5cbmNoZXNzWzBdID0ge1xuICAgIGN1cnJlbnRQb3NpdG9uIDogMCxcbiAgICBpc0RlYWQgOiBmYWxzZSxcbiAgICBjb2xvcjogJ3doaXRlJ1xufTtcblxuY2hlc3NbMV0gPSB7XG4gICAgY3VycmVudFBvc2l0b24gOiAxLFxuICAgIGlzRGVhZCA6IGZhbHNlLFxuICAgIGNvbG9yOiAnd2hpdGUnXG59O1xuXG5jaGVzc1syXSA9IHtcbiAgICBjdXJyZW50UG9zaXRvbiA6IDIsXG4gICAgaXNEZWFkIDogZmFsc2UsXG4gICAgY29sb3I6ICd3aGl0ZSdcbn07XG5cbmNoZXNzWzNdID0ge307XG5cbmNoZXNzWzRdID0ge1xuICAgIGN1cnJlbnRQb3NpdG9uIDogNCxcbiAgICBpc0RlYWQgOiBmYWxzZSxcbiAgICBjb2xvcjogJ2JsYWNrJ1xufTtcblxuY2hlc3NbNV0gPSB7XG4gICAgY3VycmVudFBvc2l0b24gOiA1LFxuICAgIGlzRGVhZCA6IGZhbHNlLFxuICAgIGNvbG9yOiAnYmxhY2snXG59O1xuXG5jaGVzc1s2XSA9IHtcbiAgICBjdXJyZW50UG9zaXRvbiA6IDYsXG4gICAgaXNEZWFkIDogZmFsc2UsXG4gICAgY29sb3I6ICdibGFjaydcbn07XG5cbmNoZXNzWzddID0ge307XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdldFN0YXR1czogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGNoZXNzW2luZGV4XS5pc0RlYWQ7XG4gICAgfSxcbiAgICBnZXRDdXJyZW50UG9zaXRpb246IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIHJldHVybiBjaGVzc1tpbmRleF0uY3VycmVudFBvc2l0b247XG4gICAgfSxcbiAgICBnZXRDb2xvcjogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgaWYoaW5kZXggIT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBjaGVzc1tpbmRleF0uY29sb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldFN0YXR1czogZnVuY3Rpb24oaW5kZXgsIG5ld1N0YXR1cykge1xuICAgICAgICBjaGVzc1tpbmRleF0uaXNEZWFkID0gbmV3U3RhdHVzO1xuICAgIH0sXG4gICAgc2V0Q3VycmVudFBvc2l0aW9uOiBmdW5jdGlvbihpbmRleCwgbmV3UG9zaXRpb24pIHtcbiAgICAgICAgY2hlc3NbaW5kZXhdLmN1cnJlbnRQb3NpdG9uID0gbmV3UG9zaXRpb247XG4gICAgfSxcbiAgICBzZXRDb2xvcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIOeQhuiuuuS4iuS4jeiDvemHjeaWsOiuvue9ruaji+WtkOminOiJslxuICAgIH0sXG5cbn07IiwiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgY2hlc3M6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGxldCBjaGVzc01nciA9IHJlcXVpcmUoJ2NoZXNzTWdyJyk7XG4gICAgICAgIC8vIHRoaXMuY2hlc3Muc2V0UG9zaXRpb24oY2hlc3NNZ3IuZ2V0UG9zaXRpb24oKSk7XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsInZhciBwb2ludE1nciA9IHJlcXVpcmUoJ3BvaW50TWdyJyksXG4gICAgY2hlc3NNZ3IgPSByZXF1aXJlKCdjaGVzc01ncicpLFxuICAgIHNvY2tldCA9IHdpbmRvdy5pbygnaHR0cDovL2xvY2FsaG9zdDozMDAwJyk7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBiYWNrZ3JvdW5kQXVkaW86IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgICAgICBwaWNrQXVkaW86IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgICAgICBwdXRBdWRpbzoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG4gICAgICAgIGNoZXNzRGllQXVkaW86IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgICAgICBibGFja0NoZXNzUHJlZmFiOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH0sXG4gICAgICAgIHdoaXRlQ2hlc3NQcmVmYWI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcbiAgICAgICAgfSxcbiAgICAgICAgbW92ZUFibGU6IGZhbHNlLFxuICAgICAgICBtb3ZpbmdDaGVzc05hbWU6IFwiXCIsXG4gICAgICAgIG1vdmluZ0NoZXNzQ29sb3I6IFwiXCIsXG4gICAgICAgIG1vdmluZ0NoZXNzSW5kZXg6IDAsXG4gICAgICAgIG9sZFBvc2l0aW9uWDogMCxcbiAgICAgICAgb2xkUG9zaXRpb25ZOiAwLFxuICAgICAgICBjdXJyZW50Q2FuTW92ZUNvbG9yOiAnYmxhY2snXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIGdldElkID0gd2luZG93LmlvKCdodHRwOi8vbG9jYWxob3N0OjMwMDAvZ2V0SWQnKTtcblxuICAgICAgICBzb2NrZXQub24oJ2Nvbm5lY3RlZCcsIGZ1bmN0aW9uKG1zZykge1xuICAgICAgICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgICAgIHNvY2tldC5vbignZ2V0VXNlcklkJywgZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzLnV1aWQgPSBpZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmluaXRDaGVzc1RvUG9pbnQoKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKFwidG91Y2hzdGFydFwiLCB0aGlzLm9uUHV0LCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKFwiY2hhbmdlUGxheWVyXCIsIHRoaXMub25DaGFuZ2VQbGF5ZXIsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oXCJjaGVja0RpZVBpZWNlXCIsIHRoaXMub25DaGVja0RpZVBpZWNlLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdjaGVzc01vdmVkJywgdGhpcy5vbkNoZXNzTW92ZWQsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oJ2NoZXNzTW92ZVRvJywgdGhpcy5vbkNoZXNzTW92ZVRvLCB0aGlzKTtcbiAgICAgICAgXG4gICAgICAgIHNvY2tldC5vbignY2hlc3NNb3ZlVG8nLCBmdW5jdGlvbihtb3ZlRGF0YSkge1xuICAgICAgICAgICAgY2MuZmluZCgnQ2FudmFzJykuZW1pdCgnY2hlc3NNb3ZlVG8nLCBtb3ZlRGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBvbkNoZXNzTW92ZWQ6IGZ1bmN0aW9uKG1vdmVEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKG1vdmVEYXRhLmRldGFpbCk7XG4gICAgICAgIGNvbnNvbGUubG9nKG1vdmVEYXRhLmRldGFpbC5jaGVzc051bWJlciwgbW92ZURhdGEuZGV0YWlsLm5ld1Bvc2l0aW9uKTtcbiAgICAgICAgc29ja2V0LmVtaXQoJ2NoZXNzTW92ZVRvJywgbW92ZURhdGEuZGV0YWlsKTtcbiAgICB9LFxuXG4gICAgb25DaGVzc01vdmVUbzogZnVuY3Rpb24oZSkge1xuICAgICAgICBsZXQgY2hlc3NOdW1iZXIgPSBlLmRldGFpbC5jaGVzc051bWJlcixcbiAgICAgICAgICAgIG5ld1Bvc2l0aW9uID0gcGFyc2VJbnQoZS5kZXRhaWwubmV3UG9zaXRpb24pLFxuICAgICAgICAgICAgcG9pbnRNZ3IgPSByZXF1aXJlKCdwb2ludE1ncicpLFxuICAgICAgICAgICAgbW92ZUNoZXNzTm9kZSA9IGNjLmZpbmQoJ0NhbnZhcycpLmdldENoaWxkQnlOYW1lKCdjaGVzc1BpZWNlJytjaGVzc051bWJlciksXG4gICAgICAgICAgICBwb3NpdGlvbiA9IHBvaW50TWdyLmdldFBvc2l0aW9uKHBhcnNlSW50KG5ld1Bvc2l0aW9uKSk7XG4gICAgICAgIGNjLmxvZyhuZXdQb3NpdGlvbik7XG4gICAgICAgIG1vdmVDaGVzc05vZGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjEsIHBvc2l0aW9uKSk7XG4gICAgfSxcblxuICAgIG9uVG91Y2hTdGFydDogZnVuY3Rpb24oZSkge1xuICAgICAgICAvLyDog73lpJ/ojrflj5blsZ7mgKfnmoTnsbtcbiAgICAgICAgbGV0IG1haW4gPSBjYy5maW5kKCdDYW52YXMnKS5nZXRDb21wb25lbnQoJ21haW4nKTtcbiAgICAgICAgY2MubG9nKCduYW1lOicsdGhpcy5uYW1lKVxuICAgICAgICAvLyDmo4DmtYvlvZPliY3otbDmo4vlr7nosaHpopzoibJcbiAgICAgICAgaWYodGhpcy5jaGVzc0NvbG9yID09ICBtYWluLmN1cnJlbnRDYW5Nb3ZlQ29sb3IpIHtcbiAgICAgICAgICAgIGNjLmZpbmQoJ0NhbnZhcycpLmVtaXQoJ3BpY2snLCB0aGlzLm5hbWUpO1xuICAgICAgICAgICAgdGhpcy5ydW5BY3Rpb24oY2Muc2NhbGVUbygwLjEsIDEuMiwgMS4yKSk7XG4gICAgICAgICAgICBjYy5sb2codGhpcy5jaGVzc0NvbG9yKTtcbiAgICAgICAgICAgIG1haW4ubW92ZUFibGUgPSB0cnVlO1xuICAgICAgICAgICAgbWFpbi5tb3ZpbmdDaGVzc05hbWUgPSB0aGlzLm5hbWU7XG4gICAgICAgICAgICBtYWluLm1vdmluZ0NoZXNzQ29sb3IgPSB0aGlzLmNoZXNzQ29sb3I7XG4gICAgICAgICAgICBtYWluLm1vdmluZ0NoZXNzSW5kZXggPSB0aGlzLmNoZXNzSW5kZXg7XG4gICAgICAgICAgICBtYWluLm9sZFBvc2l0aW9uWCA9IHRoaXMueDtcbiAgICAgICAgICAgIG1haW4ub2xkUG9zaXRpb25ZID0gdGhpcy55O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWxlcnQoJ+i/mOayoeWIsOS9oOi1sOaji+WTpu+8gScpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyDmjaHotbfmo4vlrZBcbiAgICBvblBpY2s6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYoZS5kZXRhaWwgIT09IHRoaXMubmFtZSkge1xuICAgICAgICAgICAgdGhpcy5ydW5BY3Rpb24oY2Muc2NhbGVUbygwLjEsMSwgMSkpO1xuICAgICAgICAgICAgY2MuZmluZCgnQ2FudmFzJykuZ2V0Q29tcG9uZW50KCdtYWluJykubW92ZUFibGUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNjLmZpbmQoJ0NhbnZhcycpLmVtaXQoJ3B1dCcsIHRoaXMubmFtZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vIOS6pOaNoumAieaJi1xuICAgIG9uQ2hhbmdlUGxheWVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY2MubG9nKHRoaXMpO1xuICAgICAgICBpZih0aGlzLmN1cnJlbnRDYW5Nb3ZlQ29sb3IgPT0gJ2JsYWNrJykgeyAgIFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Q2FuTW92ZUNvbG9yID0gJ3doaXRlJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudENhbk1vdmVDb2xvciA9ICdibGFjayc7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vIOiQveWtkFxuICAgIG9uUHV0OiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGxldCB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIG9sZFBvaW50ID0ge3g6IHRoYXQub2xkUG9zaXRpb25YICx5OiB0aGF0Lm9sZFBvc2l0aW9uWX0sXG4gICAgICAgICAgICBtb3ZlQWJsZSA9IGNjLmZpbmQoJ0NhbnZhcycpLmdldENvbXBvbmVudCgnbWFpbicpLm1vdmVBYmxlLCAgIC8vIOaYr+WQpuWPr+enu+WKqFxuICAgICAgICAgICAgbW92aW5nQ2hlc3NOYW1lID0gY2MuZmluZCgnQ2FudmFzJykuZ2V0Q29tcG9uZW50KCdtYWluJykubW92aW5nQ2hlc3NOYW1lLCAgIC8vIOWPr+enu+WKqOeahOaji+WtkCBuYW1lXG4gICAgICAgICAgICBtb3ZpbmdDaGVzc0NvbG9yID0gY2MuZmluZCgnQ2FudmFzJykuZ2V0Q29tcG9uZW50KCdtYWluJykubW92aW5nQ2hlc3NDb2xvciwgICAvLyDlj6/np7vliqjnmoTmo4vlrZDpopzoibJcbiAgICAgICAgICAgIG1vdmluZ0NoZXNzSW5kZXggPSBjYy5maW5kKCdDYW52YXMnKS5nZXRDb21wb25lbnQoJ21haW4nKS5tb3ZpbmdDaGVzc0luZGV4LCAgIC8vIOWPr+enu+WKqOeahOaji+WtkOe8luWPt1xuICAgICAgICAgICAgbW92ZUNoZXNzTm9kZSA9IGNjLmZpbmQoJ0NhbnZhcycpLmdldENoaWxkQnlOYW1lKG1vdmluZ0NoZXNzTmFtZSksICAvLyDlj6/np7vliqjmo4vlrZDnmoToioLngrlcbiAgICAgICAgICAgIHRhcmdldFBvaW50ID0gdGhpcy5ub2RlLmNvbnZlcnRUb05vZGVTcGFjZUFSKGUuZ2V0TG9jYXRpb24oKSksXG4gICAgICAgICAgICBwb2ludE1nciA9IHJlcXVpcmUoJ3BvaW50TWdyJyksXG4gICAgICAgICAgICBjaGVzc01nciA9IHJlcXVpcmUoJ2NoZXNzTWdyJyk7XG5cbiAgICAgICAgLy8gY2MubG9nKG9sZFBvaW50KTtcbiAgICAgICAgcG9pbnRNZ3IuaXNJbnBvaW50KHRhcmdldFBvaW50LCBmdW5jdGlvbihpbmRleCkgeyAgIC8vIOS8oOmAkuebruagh+WdkOagh++8jOWmguaenOWcqOW3suWumuS5ieeahOeCueiMg+WbtOWGheWImei/lOWbnuivpeW3suWumuS5ieeCueeahOe0ouW8lVxuICAgICAgICAgICAgbGV0IHBvaW50WCA9IHBvaW50TWdyLmdldFBvaW50KGluZGV4KS54LCBcbiAgICAgICAgICAgICAgICBwb2ludFkgPSBwb2ludE1nci5nZXRQb2ludChpbmRleCkueTtcbiAgICAgICAgICAgIC8vIGNjLmxvZyhwb2ludFgsIHBvaW50WSlcbiAgICAgICAgICAgIGlmKHBvaW50WCAmJiBwb2ludFkgJiYgcG9pbnRNZ3IuZ2V0U3RhdHVzKGluZGV4KSkgeyAvLyDliKTmlq3mmK/lkKbmnInmo4vlrZDvvIzlnZDmoIfmmK/lkKblrZjlnKhcbiAgICAgICAgICAgICAgICBpZihtb3ZlQ2hlc3NOb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdmVDaGVzc05vZGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjEsIHBvaW50WCwgcG9pbnRZKSk7ICAgLy8g5qC55o2u5LqL5Lu25Lyg6L+H5p2l55qE55uu5qCH54K55YGa56e75YqoXG4gICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoJ0NhbnZhcycpLmdldENvbXBvbmVudCgnbWFpbicpLm1vdmluZ0NoZXNzTmFtZSA9ICcnOyAgLy8g5riF56m65Y+v6LWw5qOL5a2QXG4gICAgICAgICAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhhdC5wdXRBdWRpbywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBwb2ludE1nci5zZXRTdGF0dXMoaW5kZXgsIGZhbHNlKTsgICAgIC8vIOiuvue9ruivpeS9jee9ruW3suWNoOeUqFxuICAgICAgICAgICAgICAgICAgICBwb2ludE1nci5zZXRDb2xvcihpbmRleCwgbW92aW5nQ2hlc3NDb2xvcik7ICAgICAvLyDorr7nva7ntKLlvJXlgLzkvY3nva7mlrDpopzoibJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5zZXRPbGRQb3NpdGlvbihvbGRQb2ludCwgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBpZih0YXJnZXRQb2ludCAhPT0gb2xkUG9pbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmxvZygn5b2T5YmN56e75Yqo5qOL5a2Q5Li677yaJywgbW92aW5nQ2hlc3NJbmRleCwgJ+enu+WKqOWIsO+8miAnLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbW92ZURhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlc3NOdW1iZXI6bW92aW5nQ2hlc3NJbmRleCwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3UG9zaXRpb246aW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKCdDYW52YXMnKS5lbWl0KCdjaGVzc01vdmVkJywgbW92ZURhdGEpOyAvLyDlj5HlsIQgc29ja2V0IOS6i+S7tlxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRNZ3Iuc2V0Q3VycmVudFBpZWNlKGluZGV4LCBtb3ZpbmdDaGVzc0luZGV4KTsgICAvLyDorr7nva7lr7nlupTkvY3nva7nmoTmo4vlrZDnvJblj7dcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmZpbmQoJ0NhbnZhcycpLmVtaXQoJ2NoYW5nZVBsYXllcicsIHRoYXQpOyAgICAvLyDlj5HlsITkuqTmjaLpgInmiYvkuovku7ZcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNjLmZpbmQoJ0NhbnZhcycpLmVtaXQoJ2NoZWNrRGllUGllY2UnLCB0aGF0KTsgICAgLy8g5Y+R5bCE5qOA5p+l5piv5ZCm6ZyA6KaB5o6Q5a2Q5LqL5Lu2XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm9uQ2hlY2tEaWVQaWVjZShpbmRleCwgZnVuY3Rpb24ocGllY2VOdW1iZXIsIHBvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MubG9nKHBpZWNlTnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiggKHBpZWNlTnVtYmVyICE9PSAnJykgJiYgKCBwaWVjZU51bWJlciAhPT0gLTEgKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ2NoZXNzUGllY2UnK3BpZWNlTnVtYmVyKS5kZXN0cm95KCk7ICAvLyDplIDmr4HmrbvkuqHnmoTmo4vlrZDoioLngrlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MubG9nKCfmo4vlrZAnLCBwaWVjZU51bWJlciwgJ+atu+S6oScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoYXQuY2hlc3NEaWVBdWRpbywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludE1nci5zZXRTdGF0dXMocG9pbnQsIHRydWUpOyAgLy8g6K6+572u5qOL5a2Q5bey5q275Lqh5L2N572u5Y+v6YeN5paw6JC95a2QXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZXNzTWdyLnNldFN0YXR1cyhwaWVjZU51bWJlciwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgLy8g5qOA5p+l5piv5ZCm6ZyA6KaB5o6Q5a2QXG4gICAgLy8gQGluZGV4IOS4uuW9k+WJjeS9jee9rue0ouW8lVxuICAgIG9uQ2hlY2tEaWVQaWVjZTogZnVuY3Rpb24oaW5kZXgsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNjLmxvZygn56e75Yqo5Yiw5LqGOicsIGluZGV4KVxuICAgICAgICBsZXQgcG9pbnRNZ3IgPSByZXF1aXJlKCdwb2ludE1ncicpLFxuICAgICAgICAgICAgY2hlc3NNZ3IgPSByZXF1aXJlKCdjaGVzc01ncicpO1xuICAgICAgICBpZihpbmRleCA9PSAxKSB7XG4gICAgICAgICAgICBsZXQgcDFDb2xvciA9IGNoZXNzTWdyLmdldENvbG9yKHBvaW50TWdyLmdldEN1cnJlbnRQaWVjZSgxKSksIFxuICAgICAgICAgICAgICAgIHAwQ29sb3IgPSBjaGVzc01nci5nZXRDb2xvcihwb2ludE1nci5nZXRDdXJyZW50UGllY2UoMCkpLCBcbiAgICAgICAgICAgICAgICBwN0NvbG9yID0gY2hlc3NNZ3IuZ2V0Q29sb3IocG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDcpKSwgXG4gICAgICAgICAgICAgICAgcDJDb2xvciA9IGNoZXNzTWdyLmdldENvbG9yKHBvaW50TWdyLmdldEN1cnJlbnRQaWVjZSgyKSksIFxuICAgICAgICAgICAgICAgIHAzQ29sb3IgPSBjaGVzc01nci5nZXRDb2xvcihwb2ludE1nci5nZXRDdXJyZW50UGllY2UoMykpO1xuICAgICAgICAgICAgaWYoKHAxQ29sb3IgPT0gcDdDb2xvcikgJiYgKHAxQ29sb3IgIT0gcDBDb2xvcikgJiYgKHAwQ29sb3IgIT0gJ3VuZGVmaW5lZCcpKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2socG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDApLCAwKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZigocDFDb2xvciA9PSBwM0NvbG9yKSAmJiAocDFDb2xvciAhPSBwMkNvbG9yKSAmJiAocDJDb2xvciAhPSAndW5kZWZpbmVkJykgKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2socG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDIpLCAyKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH1cbiAgICAgICAgaWYoaW5kZXggPT0gMykge1xuICAgICAgICAgICAgbGV0IHAxQ29sb3IgPSBjaGVzc01nci5nZXRDb2xvcihwb2ludE1nci5nZXRDdXJyZW50UGllY2UoMSkpLCBcbiAgICAgICAgICAgICAgICBwMkNvbG9yID0gY2hlc3NNZ3IuZ2V0Q29sb3IocG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDIpKSwgXG4gICAgICAgICAgICAgICAgcDNDb2xvciA9IGNoZXNzTWdyLmdldENvbG9yKHBvaW50TWdyLmdldEN1cnJlbnRQaWVjZSgzKSksXG4gICAgICAgICAgICAgICAgcDRDb2xvciA9IGNoZXNzTWdyLmdldENvbG9yKHBvaW50TWdyLmdldEN1cnJlbnRQaWVjZSg0KSksIFxuICAgICAgICAgICAgICAgIHA1Q29sb3IgPSBjaGVzc01nci5nZXRDb2xvcihwb2ludE1nci5nZXRDdXJyZW50UGllY2UoNSkpO1xuICAgICAgICAgICAgaWYoKHAxQ29sb3IgPT0gcDNDb2xvcikgJiYgKHAxQ29sb3IgIT0gcDJDb2xvcikgJiYgKHAyQ29sb3IgIT0gJ3VuZGVmaW5lZCcpKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2socG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDIpLCAyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZigocDNDb2xvciA9PSBwNUNvbG9yKSAmJiAocDNDb2xvciAhPSBwNENvbG9yKSAmJiAocDRDb2xvciAhPSAndW5kZWZpbmVkJykgKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2socG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDQpLCA0KTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH1cbiAgICAgICAgaWYoaW5kZXggPT0gNSkge1xuICAgICAgICAgICAgbGV0IHAzQ29sb3IgPSBjaGVzc01nci5nZXRDb2xvcihwb2ludE1nci5nZXRDdXJyZW50UGllY2UoMykpLCBcbiAgICAgICAgICAgICAgICBwNENvbG9yID0gY2hlc3NNZ3IuZ2V0Q29sb3IocG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDQpKSwgXG4gICAgICAgICAgICAgICAgcDVDb2xvciA9IGNoZXNzTWdyLmdldENvbG9yKHBvaW50TWdyLmdldEN1cnJlbnRQaWVjZSg1KSksXG4gICAgICAgICAgICAgICAgcDZDb2xvciA9IGNoZXNzTWdyLmdldENvbG9yKHBvaW50TWdyLmdldEN1cnJlbnRQaWVjZSg2KSksIFxuICAgICAgICAgICAgICAgIHA3Q29sb3IgPSBjaGVzc01nci5nZXRDb2xvcihwb2ludE1nci5nZXRDdXJyZW50UGllY2UoNykpO1xuICAgICAgICAgICAgaWYoKHAzQ29sb3IgPT0gcDVDb2xvcikgJiYgKHAzQ29sb3IgIT0gcDRDb2xvcikgJiYgKHA0Q29sb3IgIT0gJ3VuZGVmaW5lZCcpKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2socG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDQpLCA0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZigocDVDb2xvciA9PSBwN0NvbG9yKSAmJiAocDVDb2xvciAhPSBwNkNvbG9yKSAmJiAocDZDb2xvciAhPSAndW5kZWZpbmVkJykgKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2socG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDYpLCA2KTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH1cblxuICAgICAgICBpZihpbmRleCA9PSA3KSB7XG4gICAgICAgICAgICBsZXQgcDVDb2xvciA9IGNoZXNzTWdyLmdldENvbG9yKHBvaW50TWdyLmdldEN1cnJlbnRQaWVjZSg1KSksIFxuICAgICAgICAgICAgICAgIHA2Q29sb3IgPSBjaGVzc01nci5nZXRDb2xvcihwb2ludE1nci5nZXRDdXJyZW50UGllY2UoNikpLCBcbiAgICAgICAgICAgICAgICBwN0NvbG9yID0gY2hlc3NNZ3IuZ2V0Q29sb3IocG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDcpKSxcbiAgICAgICAgICAgICAgICBwMENvbG9yID0gY2hlc3NNZ3IuZ2V0Q29sb3IocG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDApKSwgXG4gICAgICAgICAgICAgICAgcDFDb2xvciA9IGNoZXNzTWdyLmdldENvbG9yKHBvaW50TWdyLmdldEN1cnJlbnRQaWVjZSgxKSk7XG4gICAgICAgICAgICBpZigocDVDb2xvciA9PSBwN0NvbG9yKSAmJiAocDVDb2xvciAhPSBwNkNvbG9yKSAmJiAocDZDb2xvciAhPSAndW5kZWZpbmVkJykpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhwb2ludE1nci5nZXRDdXJyZW50UGllY2UoNiksIDYpO1xuICAgICAgICAgICAgfSBlbHNlIGlmKChwN0NvbG9yID09IHAxQ29sb3IpICYmIChwN0NvbG9yICE9IHAwQ29sb3IpICYmIChwMENvbG9yICE9ICd1bmRlZmluZWQnKSApIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhwb2ludE1nci5nZXRDdXJyZW50UGllY2UoMCksIDApO1xuICAgICAgICAgICAgfSBcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzZXRPbGRQb3NpdGlvbjogZnVuY3Rpb24ob2xkUG9pbnQpIHtcbiAgICAgICAgbGV0IHBvaW50TWdyID0gcmVxdWlyZSgncG9pbnRNZ3InKTtcbiAgICAgICAgcG9pbnRNZ3IuaXNJbnBvaW50KG9sZFBvaW50LCBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgcG9pbnRNZ3Iuc2V0U3RhdHVzKGluZGV4LCB0cnVlKTsgICAgICAgIC8vIOiuvue9ruW3suenu+mZpOaji+WtkOS9jee9rueahOeKtuaAgVxuICAgICAgICAgICAgcG9pbnRNZ3Iuc2V0Q3VycmVudFBpZWNlKGluZGV4LCAtMSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyDliJ3lp4vljJbmlL7nva7mo4vlrZDliLDpu5jorqTkvY3nva5cbiAgICBpbml0Q2hlc3NUb1BvaW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgcG9pbnRNZ3IgPSByZXF1aXJlKCdwb2ludE1ncicpLFxuICAgICAgICAgICAgY2hlc3NNZ3IgPSByZXF1aXJlKCdjaGVzc01ncicpO1xuICAgICAgICBmb3IobGV0IGk9MDtpPDg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHBvaW50ID0gcG9pbnRNZ3IuZ2V0UG9pbnQoaSksIFxuICAgICAgICAgICAgICAgIGNoZXNzTWdyQ29sb3IgPSBjaGVzc01nci5nZXRDb2xvcihpKSxcbiAgICAgICAgICAgICAgICB4ID0gcG9pbnQueCwgXG4gICAgICAgICAgICAgICAgeSA9IHBvaW50Lnk7XG5cbiAgICAgICAgICAgIGlmKGNoZXNzTWdyQ29sb3IgPT0gJ3doaXRlJykge1xuICAgICAgICAgICAgICAgIGxldCBuZXdDaGVzcyA9IGNjLmluc3RhbnRpYXRlKHRoYXQud2hpdGVDaGVzc1ByZWZhYik7XG4gICAgICAgICAgICAgICAgdGhhdC5ub2RlLmFkZENoaWxkKG5ld0NoZXNzKTtcbiAgICAgICAgICAgICAgICBuZXdDaGVzcy5zZXRQb3NpdGlvbih4LCB5KTtcbiAgICAgICAgICAgICAgICBuZXdDaGVzcy5uYW1lID0gJ2NoZXNzUGllY2UnK2k7XG4gICAgICAgICAgICAgICAgbmV3Q2hlc3MuY2hlc3NDb2xvciA9ICd3aGl0ZSc7XG4gICAgICAgICAgICAgICAgbmV3Q2hlc3MuY2hlc3NJbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgY2MuZmluZCgnQ2FudmFzJykub24oJ3BpY2snLCB0aGF0Lm9uUGljaywgbmV3Q2hlc3MpO1xuICAgICAgICAgICAgICAgIG5ld0NoZXNzLm9uKCd0b3VjaHN0YXJ0JywgdGhhdC5vblRvdWNoU3RhcnQsIG5ld0NoZXNzKTtcbiAgICAgICAgICAgIH0gIGVsc2UgaWYoY2hlc3NNZ3JDb2xvciA9PSAnYmxhY2snKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5ld0NoZXNzID0gY2MuaW5zdGFudGlhdGUodGhpcy5ibGFja0NoZXNzUHJlZmFiKTtcbiAgICAgICAgICAgICAgICB0aGF0Lm5vZGUuYWRkQ2hpbGQobmV3Q2hlc3MpO1xuICAgICAgICAgICAgICAgIG5ld0NoZXNzLnNldFBvc2l0aW9uKHgsIHkpO1xuICAgICAgICAgICAgICAgIG5ld0NoZXNzLm5hbWUgPSAnY2hlc3NQaWVjZScraTtcbiAgICAgICAgICAgICAgICBuZXdDaGVzcy5jaGVzc0NvbG9yID0gJ2JsYWNrJztcbiAgICAgICAgICAgICAgICBuZXdDaGVzcy5jaGVzc0luZGV4ID0gaTtcbiAgICAgICAgICAgICAgICBjYy5maW5kKCdDYW52YXMnKS5vbigncGljaycsIHRoYXQub25QaWNrLCBuZXdDaGVzcyk7XG4gICAgICAgICAgICAgICAgbmV3Q2hlc3Mub24oJ3RvdWNoc3RhcnQnLCB0aGF0Lm9uVG91Y2hTdGFydCwgbmV3Q2hlc3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyDmo4vlrZDnp7vliqhcbiAgICBjaGVzc01vdmU6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIGxldCB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIGlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgIGVsLm9uKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2NhbGVBY3Rpb24gPSBjYy5zY2FsZUJ5KDAuMSwxLjUsIDEuNSk7XG4gICAgICAgICAgICB0aGlzLnJ1bkFjdGlvbihzY2FsZUFjdGlvbik7XG4gICAgICAgIH0uYmluZChlbCkpO1xuICAgIH0sXG4gICAgYWRkTmV3Q2hlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgY2hlc3NNZ3IgPSByZXF1aXJlKCdjaGVzc01ncicpLFxuICAgICAgICAgICAgeCA9IGNoZXNzTWdyLmdldFBvc2l0aW9uWCgpLFxuICAgICAgICAgICAgeSA9IGNoZXNzTWdyLmdldFBvc2l0aW9uWSgpLFxuICAgICAgICAgICAgbmV3Q2hlc3MgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNoZXNzUHJlZmFiKTtcbiAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKG5ld0NoZXNzKTtcbiAgICAgICAgY29uc29sZS5sb2coeCwgeSk7XG4gICAgICAgIG5ld0NoZXNzLnNldFBvc2l0aW9uKHgsIHkpO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgfVxufSk7XG4iLCIvLyDmo4vnm5jnrqHnkIZcbmxldCBwb2ludCA9IFtdO1xucG9pbnRbMF0gPSB7XG4gICAgeDogLTI0NixcbiAgICB5OiAyNjYsXG4gICAgaXNFbXB0eTogZmFsc2UsXG4gICAgY29sb3I6IFwid2hpdGVcIixcbiAgICBjdXJyZW50UGllY2U6IDBcbn07XG5wb2ludFsxXSA9IHtcbiAgICB4OiA0LFxuICAgIHk6IDI2NixcbiAgICBpc0VtcHR5OiBmYWxzZSxcbiAgICBjb2xvcjogXCJ3aGl0ZVwiLFxuICAgIGN1cnJlbnRQaWVjZTogMVxufTtcbnBvaW50WzJdID0ge1xuICAgIHg6IDI0NixcbiAgICB5OiAyNjYsXG4gICAgaXNFbXB0eTogZmFsc2UsXG4gICAgY29sb3I6IFwid2hpdGVcIixcbiAgICBjdXJyZW50UGllY2U6IDJcbn07XG5cbnBvaW50WzNdID0ge1xuICAgIHg6IDI1MCxcbiAgICB5OiAyMCxcbiAgICBpc0VtcHR5OiB0cnVlLFxuICAgIGNvbG9yOiBcIlwiLFxuICAgIGN1cnJlbnRQaWVjZTogLTFcbn07XG5cbnBvaW50WzRdID0ge1xuICAgIHg6IDI0NCxcbiAgICB5OiAtMjI3LFxuICAgIGlzRW1wdHk6IGZhbHNlLFxuICAgIGNvbG9yOiBcImJsYWNrXCIsXG4gICAgY3VycmVudFBpZWNlOiA0XG59O1xuXG5wb2ludFs1XSA9IHtcbiAgICB4OiAxLFxuICAgIHk6IC0yMzEsXG4gICAgaXNFbXB0eTogZmFsc2UsXG4gICAgY29sb3I6IFwiYmxhY2tcIixcbiAgICBjdXJyZW50UGllY2U6IDVcbn07XG5cbnBvaW50WzZdID0ge1xuICAgIHg6IC0yNTAsXG4gICAgeTogLTIyNyxcbiAgICBpc0VtcHR5OiBmYWxzZSxcbiAgICBjb2xvcjogXCJibGFja1wiLFxuICAgIGN1cnJlbnRQaWVjZTogNlxufTtcblxucG9pbnRbN10gPSB7XG4gICAgeDogLTI1MCxcbiAgICB5OiAxNCxcbiAgICBpc0VtcHR5OiB0cnVlLFxuICAgIGNvbG9yOiBcIlwiLFxuICAgIGN1cnJlbnRQaWVjZTogLTFcbn07XG5cbi8vIGNvbnNvbGUubG9nKHBvaW50KVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBwb2ludDogcG9pbnQsXG4gICAgZ2V0UG9pbnQ6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIHJldHVybiBwb2ludFtpbmRleF07XG4gICAgfSxcbiAgICBnZXRQb3NpdGlvbjogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuKHBvaW50W2luZGV4XS54ICsgJywnICsgcG9pbnRbaW5kZXhdLnkpO1xuICAgIH0sXG4gICAgZ2V0U3RhdHVzOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICByZXR1cm4gcG9pbnRbaW5kZXhdLmlzRW1wdHk7XG4gICAgfSxcbiAgICBnZXRDb2xvcjogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHBvaW50W2luZGV4XS5jb2xvcjtcbiAgICB9LFxuICAgIC8vIOi/lOWbnue0ouW8leWAvOS9jee9rueCueWvueW6lOeahOaji+WtkOe8luWPt1xuICAgIGdldEN1cnJlbnRQaWVjZTogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHBvaW50W2luZGV4XS5jdXJyZW50UGllY2U7XG4gICAgfSxcbiAgICBzZXRTdGF0dXM6IGZ1bmN0aW9uKGluZGV4LCBib29sKSB7XG4gICAgICAgIHBvaW50W2luZGV4XS5pc0VtcHR5ID0gYm9vbDtcbiAgICAgICAgY2MubG9nKCforr7nva4nLCBpbmRleCwgJ+S4uicsIGJvb2wpO1xuICAgICAgICAvL2NjLmxvZyhwb2ludFtpbmRleF0pO1xuICAgIH0sXG4gICAgc2V0Q29sb3I6IGZ1bmN0aW9uKGluZGV4LCBuZXdDb2xvcikge1xuICAgICAgICBwb2ludFtpbmRleF0uY29sb3IgPSBuZXdDb2xvcjtcbiAgICB9LFxuICAgIC8vIOiuvue9rue0ouW8leWAvCBpbmRleCDlr7nlupTnmoQgY3VycmVudFBpZWNlIOS4uiBjaGVzc051bWJlciDlj7fmo4vlrZBcbiAgICBzZXRDdXJyZW50UGllY2U6IGZ1bmN0aW9uKGluZGV4LCBjaGVzc051bWJlcikge1xuICAgICAgICAgcG9pbnRbaW5kZXhdLmN1cnJlbnRQaWVjZSA9IGNoZXNzTnVtYmVyO1xuICAgIH0sXG4gICAgaXNJbnBvaW50OiBmdW5jdGlvbih0YXJnZXRQb2ludCwgY2FsbGJhY2spIHtcbiAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXRQb2ludCk7XG4gICAgICAgIGxldCB0YXJnZXRQb2ludFggPSB0YXJnZXRQb2ludC54LCB0YXJnZXRQb2ludFkgPSB0YXJnZXRQb2ludC55LCByYW5nZSA9IDEyMCAgO1xuICAgICAgICAvL2Zvcih2YXIgaSA9IDA7IGkgPiBwb2ludC5sZW5ndGg7IGkgKysgKSB7XG4gICAgICAgICAgICAvL2xldCB4ID0gcG9pbnRbaV0ueCwgeSA9IHBvaW50W2ldLnksIFxuICAgICAgICAgICAgLy8g6IyD5Zu05Z2Q5qCHXG4gICAgICAgICAgICBpZih0YXJnZXRQb2ludFggPiByYW5nZSApIHtcbiAgICAgICAgICAgICAgICBpZih0YXJnZXRQb2ludFk8PXJhbmdlJiZ0YXJnZXRQb2ludFk+PS1yYW5nZSl7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKDMpO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmICh0YXJnZXRQb2ludFk+cmFuZ2Upe1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygyKTtcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZiAodGFyZ2V0UG9pbnRZPC1yYW5nZSl7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKDQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNlIGlmKHRhcmdldFBvaW50WDwtcmFuZ2Upe1xuICAgICAgICAgICAgICAgIGlmKHRhcmdldFBvaW50WT5yYW5nZSl7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKDApO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmKHRhcmdldFBvaW50WTw9cmFuZ2UmJnRhcmdldFBvaW50WT49LXJhbmdlKXtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soNyk7XG4gICAgICAgICAgICAgICAgfWVsc2UgaWYodGFyZ2V0UG9pbnRZPC1yYW5nZSl7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKDYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGlmKHRhcmdldFBvaW50WT5yYW5nZSl7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKDEpO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmKHRhcmdldFBvaW50WTwtcmFuZ2Upe1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayg1KTtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAvL31cbiAgICB9XG59O1xuXG4iXX0=