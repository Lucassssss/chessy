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
        chessDieAudio: {
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
        movingChessColor: "",
        movingChessIndex: 0,
        oldPositionX: 0,
        oldPositionY: 0,
        currentCanMoveColor: 'black'
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.initChessToPoint();
        this.node.on("touchstart", this.onPut, this);
        this.node.on("changePlayer", this.onChangePlayer, this);
        this.node.on("checkDiePiece", this.onCheckDiePiece, this);
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
                    cc.audioEngine.playEffect(that.putAudio, false);
                    pointMgr.setStatus(index, false); // 设置该位置已占用
                    pointMgr.setColor(index, movingChessColor); // 设置索引值位置新颜色
                    that.setOldPosition(oldPoint, index);
                    if (targetPoint !== oldPoint) {
                        cc.log('当前移动棋子为：', movingChessIndex, '移动到： ', index);
                        pointMgr.setCurrentPiece(index, movingChessIndex); // 设置对应位置的棋子编号
                        cc.find('Canvas').emit('changePlayer', that); // 发射交换选手事件
                        // cc.find('Canvas').emit('checkDiePiece', that);    // 发射检查是否需要掐子事件
                        that.onCheckDiePiece(index, function (pieceNumber) {
                            cc.log(pieceNumber);
                            if (pieceNumber !== '' && pieceNumber !== -1) {
                                that.node.getChildByName('chessPiece' + pieceNumber).destroy(); // 销毁死亡的棋子节点
                                cc.log('棋子', pieceNumber, '死亡');
                                cc.audioEngine.playEffect(that.chessDieAudio, false);
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
                callback(pointMgr.getCurrentPiece(0));
            } else if (p1Color == p3Color && p1Color != p2Color && p2Color != 'undefined') {
                callback(pointMgr.getCurrentPiece(2));
            }
        }
        if (index == 3) {
            var p1Color = chessMgr.getColor(pointMgr.getCurrentPiece(1)),
                p2Color = chessMgr.getColor(pointMgr.getCurrentPiece(2)),
                p3Color = chessMgr.getColor(pointMgr.getCurrentPiece(3)),
                p4Color = chessMgr.getColor(pointMgr.getCurrentPiece(4)),
                p5Color = chessMgr.getColor(pointMgr.getCurrentPiece(5));
            if (p1Color == p3Color && p1Color != p2Color && p2Color != 'undefined') {
                callback(pointMgr.getCurrentPiece(2));
            } else if (p3Color == p5Color && p3Color != p4Color && p4Color != 'undefined') {
                callback(pointMgr.getCurrentPiece(4));
            }
        }
        if (index == 5) {
            var p3Color = chessMgr.getColor(pointMgr.getCurrentPiece(3)),
                p4Color = chessMgr.getColor(pointMgr.getCurrentPiece(4)),
                p5Color = chessMgr.getColor(pointMgr.getCurrentPiece(5)),
                p6Color = chessMgr.getColor(pointMgr.getCurrentPiece(6)),
                p7Color = chessMgr.getColor(pointMgr.getCurrentPiece(7));
            if (p3Color == p5Color && p3Color != p4Color && p4Color != 'undefined') {
                callback(pointMgr.getCurrentPiece(4));
            } else if (p5Color == p7Color && p5Color != p6Color && p6Color != 'undefined') {
                callback(pointMgr.getCurrentPiece(6));
            }
        }

        if (index == 7) {
            var p5Color = chessMgr.getColor(pointMgr.getCurrentPiece(5)),
                p6Color = chessMgr.getColor(pointMgr.getCurrentPiece(6)),
                p7Color = chessMgr.getColor(pointMgr.getCurrentPiece(7)),
                p0Color = chessMgr.getColor(pointMgr.getCurrentPiece(0)),
                p1Color = chessMgr.getColor(pointMgr.getCurrentPiece(1));
            if (p5Color == p7Color && p5Color != p6Color && p6Color != 'undefined') {
                callback(pointMgr.getCurrentPiece(6));
            } else if (p7Color == p1Color && p7Color != p0Color && p0Color != 'undefined') {
                callback(pointMgr.getCurrentPiece(0));
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL1NjcmlwdC9jaGVzc01nci5qcyIsImFzc2V0cy9TY3JpcHQvY2hlc3MuanMiLCJhc3NldHMvU2NyaXB0L21haW4uanMiLCJhc3NldHMvU2NyaXB0L3BvaW50TWdyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ1I7QUFDSTtBQUNJO0FBQ1I7QUFDSTtBQUNJO0FBQ0k7QUFDWjtBQUNZO0FBQ1o7QUFDQTtBQUNJO0FBQ0k7QUFDUjtBQUNJO0FBQ0k7QUFDUjtBQUNJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0k7QUFDSjtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDSTtBQUNKO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNSO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDUjtBQUNBO0FBQ0k7QUFDSjtBQUNRO0FBQ0E7QUFDUjtBQUNRO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ1o7QUFDWTtBQUNaO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ1o7QUFDWTtBQUNaO0FBQ0E7QUFDQTtBQUNJO0FBQ0o7QUFDUTtBQUNJO0FBQ1o7QUFDWTtBQUNaO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDUjtBQUNBO0FBQ0E7QUFBWTtBQUVaO0FBRFk7QUFHWjtBQUZZO0FBSVo7QUFIWTtBQUtaO0FBSlk7QUFNWjtBQUNBO0FBQ0E7QUFDQTtBQUpZO0FBTVo7QUFMZ0I7QUFPaEI7QUFDQTtBQUxnQjtBQU9oQjtBQU5vQjtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQVE1QjtBQU40QjtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFRcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTkk7QUFDSTtBQUNBO0FBUVI7QUFOUTtBQUNJO0FBUVo7QUFDQTtBQUNBO0FBQ0E7QUFOWTtBQUNJO0FBUWhCO0FBTmdCO0FBUWhCO0FBQ0E7QUFOUTtBQUNJO0FBUVo7QUFDQTtBQUNBO0FBQ0E7QUFOWTtBQUNJO0FBUWhCO0FBTmdCO0FBUWhCO0FBQ0E7QUFOUTtBQUNJO0FBUVo7QUFDQTtBQUNBO0FBQ0E7QUFOWTtBQUNJO0FBUWhCO0FBTmdCO0FBUWhCO0FBQ0E7QUFDQTtBQU5RO0FBQ0k7QUFRWjtBQUNBO0FBQ0E7QUFDQTtBQU5ZO0FBQ0k7QUFRaEI7QUFOZ0I7QUFRaEI7QUFDQTtBQUNBO0FBQ0E7QUFOSTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBUVo7QUFDQTtBQUNBO0FBQ0E7QUFOSTtBQUNJO0FBUVI7QUFDQTtBQU5RO0FBQ0k7QUFRWjtBQUNBO0FBQ0E7QUFDQTtBQU5ZO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVFoQjtBQU5nQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUWhCO0FBQ0E7QUFDQTtBQUNBO0FBTkk7QUFDSTtBQVFSO0FBTlE7QUFDSTtBQUNBO0FBUVo7QUFDQTtBQU5JO0FBQ0k7QUFRUjtBQUNBO0FBQ0E7QUFOUTtBQUNBO0FBQ0E7QUFRUjtBQUNBO0FBTkk7QUFRSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvUEE7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSjtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSjtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ1I7QUFDSTtBQUNJO0FBQ1I7QUFDSTtBQUNJO0FBQ1I7QUFDSTtBQUNJO0FBQ1I7QUFDQTtBQUNJO0FBQ0k7QUFDUjtBQUNJO0FBQ0k7QUFDQTtBQUNSO0FBQ0E7QUFDSTtBQUNJO0FBQ1I7QUFDQTtBQUNJO0FBQ0s7QUFDVDtBQUNJO0FBQ0o7QUFDUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEWTtBQUNJO0FBQ0k7QUFHcEI7QUFEb0I7QUFHcEI7QUFEb0I7QUFHcEI7QUFDQTtBQURnQjtBQUNJO0FBR3BCO0FBRG9CO0FBR3BCO0FBRG9CO0FBR3BCO0FBQ0E7QUFEZ0I7QUFDSTtBQUdwQjtBQURvQjtBQUdwQjtBQURvQjtBQUdwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyDmo4vlrZDnrqHnkIZcbmxldCBjaGVzcyA9IFtdO1xuXG5jaGVzc1swXSA9IHtcbiAgICBjdXJyZW50UG9zaXRvbiA6IDAsXG4gICAgaXNEZWFkIDogZmFsc2UsXG4gICAgY29sb3I6ICd3aGl0ZSdcbn07XG5cbmNoZXNzWzFdID0ge1xuICAgIGN1cnJlbnRQb3NpdG9uIDogMSxcbiAgICBpc0RlYWQgOiBmYWxzZSxcbiAgICBjb2xvcjogJ3doaXRlJ1xufTtcblxuY2hlc3NbMl0gPSB7XG4gICAgY3VycmVudFBvc2l0b24gOiAyLFxuICAgIGlzRGVhZCA6IGZhbHNlLFxuICAgIGNvbG9yOiAnd2hpdGUnXG59O1xuXG5jaGVzc1szXSA9IHt9O1xuXG5jaGVzc1s0XSA9IHtcbiAgICBjdXJyZW50UG9zaXRvbiA6IDQsXG4gICAgaXNEZWFkIDogZmFsc2UsXG4gICAgY29sb3I6ICdibGFjaydcbn07XG5cbmNoZXNzWzVdID0ge1xuICAgIGN1cnJlbnRQb3NpdG9uIDogNSxcbiAgICBpc0RlYWQgOiBmYWxzZSxcbiAgICBjb2xvcjogJ2JsYWNrJ1xufTtcblxuY2hlc3NbNl0gPSB7XG4gICAgY3VycmVudFBvc2l0b24gOiA2LFxuICAgIGlzRGVhZCA6IGZhbHNlLFxuICAgIGNvbG9yOiAnYmxhY2snXG59O1xuXG5jaGVzc1s3XSA9IHt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZXRTdGF0dXM6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIHJldHVybiBjaGVzc1tpbmRleF0uaXNEZWFkO1xuICAgIH0sXG4gICAgZ2V0Q3VycmVudFBvc2l0aW9uOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICByZXR1cm4gY2hlc3NbaW5kZXhdLmN1cnJlbnRQb3NpdG9uO1xuICAgIH0sXG4gICAgZ2V0Q29sb3I6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIGlmKGluZGV4ICE9IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gY2hlc3NbaW5kZXhdLmNvbG9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXRTdGF0dXM6IGZ1bmN0aW9uKGluZGV4LCBuZXdTdGF0dXMpIHtcbiAgICAgICAgY2hlc3NbaW5kZXhdLmlzRGVhZCA9IG5ld1N0YXR1cztcbiAgICB9LFxuICAgIHNldEN1cnJlbnRQb3NpdGlvbjogZnVuY3Rpb24oaW5kZXgsIG5ld1Bvc2l0aW9uKSB7XG4gICAgICAgIGNoZXNzW2luZGV4XS5jdXJyZW50UG9zaXRvbiA9IG5ld1Bvc2l0aW9uO1xuICAgIH0sXG4gICAgc2V0Q29sb3I6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDnkIborrrkuIrkuI3og73ph43mlrDorr7nva7mo4vlrZDpopzoibJcbiAgICB9LFxuXG59OyIsImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGNoZXNzOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBsZXQgY2hlc3NNZ3IgPSByZXF1aXJlKCdjaGVzc01ncicpO1xuICAgICAgICAvLyB0aGlzLmNoZXNzLnNldFBvc2l0aW9uKGNoZXNzTWdyLmdldFBvc2l0aW9uKCkpO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBiYWNrZ3JvdW5kQXVkaW86IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgICAgICBwaWNrQXVkaW86IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgICAgICBwdXRBdWRpbzoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG4gICAgICAgIGNoZXNzRGllQXVkaW86IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgICAgICBibGFja0NoZXNzUHJlZmFiOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH0sXG4gICAgICAgIHdoaXRlQ2hlc3NQcmVmYWI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcbiAgICAgICAgfSxcbiAgICAgICAgbW92ZUFibGU6IGZhbHNlLFxuICAgICAgICBtb3ZpbmdDaGVzc05hbWU6IFwiXCIsXG4gICAgICAgIG1vdmluZ0NoZXNzQ29sb3I6IFwiXCIsXG4gICAgICAgIG1vdmluZ0NoZXNzSW5kZXg6IDAsXG4gICAgICAgIG9sZFBvc2l0aW9uWDogMCxcbiAgICAgICAgb2xkUG9zaXRpb25ZOiAwLFxuICAgICAgICBjdXJyZW50Q2FuTW92ZUNvbG9yOiAnYmxhY2snXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmluaXRDaGVzc1RvUG9pbnQoKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKFwidG91Y2hzdGFydFwiLCB0aGlzLm9uUHV0LCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKFwiY2hhbmdlUGxheWVyXCIsIHRoaXMub25DaGFuZ2VQbGF5ZXIsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oXCJjaGVja0RpZVBpZWNlXCIsIHRoaXMub25DaGVja0RpZVBpZWNlLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgb25Ub3VjaFN0YXJ0OiBmdW5jdGlvbihlKSB7XG4gICAgICAgIC8vIOiDveWkn+iOt+WPluWxnuaAp+eahOexu1xuICAgICAgICBsZXQgbWFpbiA9IGNjLmZpbmQoJ0NhbnZhcycpLmdldENvbXBvbmVudCgnbWFpbicpO1xuICAgICAgICBjYy5sb2coJ25hbWU6Jyx0aGlzLm5hbWUpXG4gICAgICAgIC8vIOajgOa1i+W9k+WJjei1sOaji+WvueixoeminOiJslxuICAgICAgICBpZih0aGlzLmNoZXNzQ29sb3IgPT0gIG1haW4uY3VycmVudENhbk1vdmVDb2xvcikge1xuICAgICAgICAgICAgY2MuZmluZCgnQ2FudmFzJykuZW1pdCgncGljaycsIHRoaXMubmFtZSk7XG4gICAgICAgICAgICB0aGlzLnJ1bkFjdGlvbihjYy5zY2FsZVRvKDAuMSwgMS4yLCAxLjIpKTtcbiAgICAgICAgICAgIGNjLmxvZyh0aGlzLmNoZXNzQ29sb3IpO1xuICAgICAgICAgICAgbWFpbi5tb3ZlQWJsZSA9IHRydWU7XG4gICAgICAgICAgICBtYWluLm1vdmluZ0NoZXNzTmFtZSA9IHRoaXMubmFtZTtcbiAgICAgICAgICAgIG1haW4ubW92aW5nQ2hlc3NDb2xvciA9IHRoaXMuY2hlc3NDb2xvcjtcbiAgICAgICAgICAgIG1haW4ubW92aW5nQ2hlc3NJbmRleCA9IHRoaXMuY2hlc3NJbmRleDtcbiAgICAgICAgICAgIG1haW4ub2xkUG9zaXRpb25YID0gdGhpcy54O1xuICAgICAgICAgICAgbWFpbi5vbGRQb3NpdGlvblkgPSB0aGlzLnk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydCgn6L+Y5rKh5Yiw5L2g6LWw5qOL5ZOm77yBJyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vIOaNoei1t+aji+WtkFxuICAgIG9uUGljazogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZihlLmRldGFpbCAhPT0gdGhpcy5uYW1lKSB7XG4gICAgICAgICAgICB0aGlzLnJ1bkFjdGlvbihjYy5zY2FsZVRvKDAuMSwxLCAxKSk7XG4gICAgICAgICAgICBjYy5maW5kKCdDYW52YXMnKS5nZXRDb21wb25lbnQoJ21haW4nKS5tb3ZlQWJsZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2MuZmluZCgnQ2FudmFzJykuZW1pdCgncHV0JywgdGhpcy5uYW1lKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy8g5Lqk5o2i6YCJ5omLXG4gICAgb25DaGFuZ2VQbGF5ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBjYy5sb2codGhpcyk7XG4gICAgICAgIGlmKHRoaXMuY3VycmVudENhbk1vdmVDb2xvciA9PSAnYmxhY2snKSB7ICAgXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDYW5Nb3ZlQ29sb3IgPSAnd2hpdGUnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50Q2FuTW92ZUNvbG9yID0gJ2JsYWNrJztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy8g6JC95a2QXG4gICAgb25QdXQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgb2xkUG9pbnQgPSB7eDogdGhhdC5vbGRQb3NpdGlvblggLHk6IHRoYXQub2xkUG9zaXRpb25ZfSxcbiAgICAgICAgICAgIG1vdmVBYmxlID0gY2MuZmluZCgnQ2FudmFzJykuZ2V0Q29tcG9uZW50KCdtYWluJykubW92ZUFibGUsICAgLy8g5piv5ZCm5Y+v56e75YqoXG4gICAgICAgICAgICBtb3ZpbmdDaGVzc05hbWUgPSBjYy5maW5kKCdDYW52YXMnKS5nZXRDb21wb25lbnQoJ21haW4nKS5tb3ZpbmdDaGVzc05hbWUsICAgLy8g5Y+v56e75Yqo55qE5qOL5a2QIG5hbWVcbiAgICAgICAgICAgIG1vdmluZ0NoZXNzQ29sb3IgPSBjYy5maW5kKCdDYW52YXMnKS5nZXRDb21wb25lbnQoJ21haW4nKS5tb3ZpbmdDaGVzc0NvbG9yLCAgIC8vIOWPr+enu+WKqOeahOaji+WtkOminOiJslxuICAgICAgICAgICAgbW92aW5nQ2hlc3NJbmRleCA9IGNjLmZpbmQoJ0NhbnZhcycpLmdldENvbXBvbmVudCgnbWFpbicpLm1vdmluZ0NoZXNzSW5kZXgsICAgLy8g5Y+v56e75Yqo55qE5qOL5a2Q57yW5Y+3XG4gICAgICAgICAgICBtb3ZlQ2hlc3NOb2RlID0gY2MuZmluZCgnQ2FudmFzJykuZ2V0Q2hpbGRCeU5hbWUobW92aW5nQ2hlc3NOYW1lKSwgIC8vIOWPr+enu+WKqOaji+WtkOeahOiKgueCuVxuICAgICAgICAgICAgdGFyZ2V0UG9pbnQgPSB0aGlzLm5vZGUuY29udmVydFRvTm9kZVNwYWNlQVIoZS5nZXRMb2NhdGlvbigpKSxcbiAgICAgICAgICAgIHBvaW50TWdyID0gcmVxdWlyZSgncG9pbnRNZ3InKSxcbiAgICAgICAgICAgIGNoZXNzTWdyID0gcmVxdWlyZSgnY2hlc3NNZ3InKTtcblxuICAgICAgICAgICAgLy8gY2MubG9nKG9sZFBvaW50KTtcbiAgICAgICAgICAgIHBvaW50TWdyLmlzSW5wb2ludCh0YXJnZXRQb2ludCwgZnVuY3Rpb24oaW5kZXgpIHsgICAvLyDkvKDpgJLnm67moIflnZDmoIfvvIzlpoLmnpzlnKjlt7LlrprkuYnnmoTngrnojIPlm7TlhoXliJnov5Tlm57or6Xlt7LlrprkuYnngrnnmoTntKLlvJVcbiAgICAgICAgICAgICAgICBsZXQgcG9pbnRYID0gcG9pbnRNZ3IuZ2V0UG9pbnQoaW5kZXgpLngsIFxuICAgICAgICAgICAgICAgICAgICBwb2ludFkgPSBwb2ludE1nci5nZXRQb2ludChpbmRleCkueTtcbiAgICAgICAgICAgICAgICAvLyBjYy5sb2cocG9pbnRYLCBwb2ludFkpXG4gICAgICAgICAgICAgICAgaWYocG9pbnRYICYmIHBvaW50WSAmJiBwb2ludE1nci5nZXRTdGF0dXMoaW5kZXgpKSB7IC8vIOWIpOaWreaYr+WQpuacieaji+WtkO+8jOWdkOagh+aYr+WQpuWtmOWcqFxuICAgICAgICAgICAgICAgICAgICBpZihtb3ZlQ2hlc3NOb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb3ZlQ2hlc3NOb2RlLnJ1bkFjdGlvbihjYy5tb3ZlVG8oMC4xLCBwb2ludFgsIHBvaW50WSkpOyAgIC8vIOagueaNruS6i+S7tuS8oOi/h+adpeeahOebruagh+eCueWBmuenu+WKqFxuICAgICAgICAgICAgICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGF0LnB1dEF1ZGlvLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludE1nci5zZXRTdGF0dXMoaW5kZXgsIGZhbHNlKTsgICAgIC8vIOiuvue9ruivpeS9jee9ruW3suWNoOeUqFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRNZ3Iuc2V0Q29sb3IoaW5kZXgsIG1vdmluZ0NoZXNzQ29sb3IpOyAgICAgLy8g6K6+572u57Si5byV5YC85L2N572u5paw6aKc6ImyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnNldE9sZFBvc2l0aW9uKG9sZFBvaW50LCBpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0YXJnZXRQb2ludCAhPT0gb2xkUG9pbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5sb2coJ+W9k+WJjeenu+WKqOaji+WtkOS4uu+8micsIG1vdmluZ0NoZXNzSW5kZXgsICfnp7vliqjliLDvvJogJywgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50TWdyLnNldEN1cnJlbnRQaWVjZShpbmRleCwgbW92aW5nQ2hlc3NJbmRleCk7ICAgLy8g6K6+572u5a+55bqU5L2N572u55qE5qOL5a2Q57yW5Y+3XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MuZmluZCgnQ2FudmFzJykuZW1pdCgnY2hhbmdlUGxheWVyJywgdGhhdCk7ICAgIC8vIOWPkeWwhOS6pOaNoumAieaJi+S6i+S7tlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNjLmZpbmQoJ0NhbnZhcycpLmVtaXQoJ2NoZWNrRGllUGllY2UnLCB0aGF0KTsgICAgLy8g5Y+R5bCE5qOA5p+l5piv5ZCm6ZyA6KaB5o6Q5a2Q5LqL5Lu2XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5vbkNoZWNrRGllUGllY2UoaW5kZXgsIGZ1bmN0aW9uKHBpZWNlTnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLmxvZyhwaWVjZU51bWJlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCAocGllY2VOdW1iZXIgIT09ICcnKSAmJiAoIHBpZWNlTnVtYmVyICE9PSAtMSApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ2NoZXNzUGllY2UnK3BpZWNlTnVtYmVyKS5kZXN0cm95KCk7ICAvLyDplIDmr4HmrbvkuqHnmoTmo4vlrZDoioLngrlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLmxvZygn5qOL5a2QJywgcGllY2VOdW1iZXIsICfmrbvkuqEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhhdC5jaGVzc0RpZUF1ZGlvLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH0sXG4gICAgLy8g5qOA5p+l5piv5ZCm6ZyA6KaB5o6Q5a2QXG4gICAgLy8gQGluZGV4IOS4uuW9k+WJjeS9jee9rue0ouW8lVxuICAgIG9uQ2hlY2tEaWVQaWVjZTogZnVuY3Rpb24oaW5kZXgsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNjLmxvZygn56e75Yqo5Yiw5LqGOicsIGluZGV4KVxuICAgICAgICBsZXQgcG9pbnRNZ3IgPSByZXF1aXJlKCdwb2ludE1ncicpLFxuICAgICAgICAgICAgY2hlc3NNZ3IgPSByZXF1aXJlKCdjaGVzc01ncicpO1xuICAgICAgICBpZihpbmRleCA9PSAxKSB7XG4gICAgICAgICAgICBsZXQgcDFDb2xvciA9IGNoZXNzTWdyLmdldENvbG9yKHBvaW50TWdyLmdldEN1cnJlbnRQaWVjZSgxKSksIFxuICAgICAgICAgICAgICAgIHAwQ29sb3IgPSBjaGVzc01nci5nZXRDb2xvcihwb2ludE1nci5nZXRDdXJyZW50UGllY2UoMCkpLCBcbiAgICAgICAgICAgICAgICBwN0NvbG9yID0gY2hlc3NNZ3IuZ2V0Q29sb3IocG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDcpKSwgXG4gICAgICAgICAgICAgICAgcDJDb2xvciA9IGNoZXNzTWdyLmdldENvbG9yKHBvaW50TWdyLmdldEN1cnJlbnRQaWVjZSgyKSksIFxuICAgICAgICAgICAgICAgIHAzQ29sb3IgPSBjaGVzc01nci5nZXRDb2xvcihwb2ludE1nci5nZXRDdXJyZW50UGllY2UoMykpO1xuICAgICAgICAgICAgaWYoKHAxQ29sb3IgPT0gcDdDb2xvcikgJiYgKHAxQ29sb3IgIT0gcDBDb2xvcikgJiYgKHAwQ29sb3IgIT0gJ3VuZGVmaW5lZCcpKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2socG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDApKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZigocDFDb2xvciA9PSBwM0NvbG9yKSAmJiAocDFDb2xvciAhPSBwMkNvbG9yKSAmJiAocDJDb2xvciAhPSAndW5kZWZpbmVkJykgKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2socG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDIpKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH1cbiAgICAgICAgaWYoaW5kZXggPT0gMykge1xuICAgICAgICAgICAgbGV0IHAxQ29sb3IgPSBjaGVzc01nci5nZXRDb2xvcihwb2ludE1nci5nZXRDdXJyZW50UGllY2UoMSkpLCBcbiAgICAgICAgICAgICAgICBwMkNvbG9yID0gY2hlc3NNZ3IuZ2V0Q29sb3IocG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDIpKSwgXG4gICAgICAgICAgICAgICAgcDNDb2xvciA9IGNoZXNzTWdyLmdldENvbG9yKHBvaW50TWdyLmdldEN1cnJlbnRQaWVjZSgzKSksXG4gICAgICAgICAgICAgICAgcDRDb2xvciA9IGNoZXNzTWdyLmdldENvbG9yKHBvaW50TWdyLmdldEN1cnJlbnRQaWVjZSg0KSksIFxuICAgICAgICAgICAgICAgIHA1Q29sb3IgPSBjaGVzc01nci5nZXRDb2xvcihwb2ludE1nci5nZXRDdXJyZW50UGllY2UoNSkpO1xuICAgICAgICAgICAgaWYoKHAxQ29sb3IgPT0gcDNDb2xvcikgJiYgKHAxQ29sb3IgIT0gcDJDb2xvcikgJiYgKHAyQ29sb3IgIT0gJ3VuZGVmaW5lZCcpKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2socG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDIpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZigocDNDb2xvciA9PSBwNUNvbG9yKSAmJiAocDNDb2xvciAhPSBwNENvbG9yKSAmJiAocDRDb2xvciAhPSAndW5kZWZpbmVkJykgKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2socG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDQpKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH1cbiAgICAgICAgaWYoaW5kZXggPT0gNSkge1xuICAgICAgICAgICAgbGV0IHAzQ29sb3IgPSBjaGVzc01nci5nZXRDb2xvcihwb2ludE1nci5nZXRDdXJyZW50UGllY2UoMykpLCBcbiAgICAgICAgICAgICAgICBwNENvbG9yID0gY2hlc3NNZ3IuZ2V0Q29sb3IocG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDQpKSwgXG4gICAgICAgICAgICAgICAgcDVDb2xvciA9IGNoZXNzTWdyLmdldENvbG9yKHBvaW50TWdyLmdldEN1cnJlbnRQaWVjZSg1KSksXG4gICAgICAgICAgICAgICAgcDZDb2xvciA9IGNoZXNzTWdyLmdldENvbG9yKHBvaW50TWdyLmdldEN1cnJlbnRQaWVjZSg2KSksIFxuICAgICAgICAgICAgICAgIHA3Q29sb3IgPSBjaGVzc01nci5nZXRDb2xvcihwb2ludE1nci5nZXRDdXJyZW50UGllY2UoNykpO1xuICAgICAgICAgICAgaWYoKHAzQ29sb3IgPT0gcDVDb2xvcikgJiYgKHAzQ29sb3IgIT0gcDRDb2xvcikgJiYgKHA0Q29sb3IgIT0gJ3VuZGVmaW5lZCcpKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2socG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDQpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZigocDVDb2xvciA9PSBwN0NvbG9yKSAmJiAocDVDb2xvciAhPSBwNkNvbG9yKSAmJiAocDZDb2xvciAhPSAndW5kZWZpbmVkJykgKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2socG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDYpKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH1cblxuICAgICAgICBpZihpbmRleCA9PSA3KSB7XG4gICAgICAgICAgICBsZXQgcDVDb2xvciA9IGNoZXNzTWdyLmdldENvbG9yKHBvaW50TWdyLmdldEN1cnJlbnRQaWVjZSg1KSksIFxuICAgICAgICAgICAgICAgIHA2Q29sb3IgPSBjaGVzc01nci5nZXRDb2xvcihwb2ludE1nci5nZXRDdXJyZW50UGllY2UoNikpLCBcbiAgICAgICAgICAgICAgICBwN0NvbG9yID0gY2hlc3NNZ3IuZ2V0Q29sb3IocG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDcpKSxcbiAgICAgICAgICAgICAgICBwMENvbG9yID0gY2hlc3NNZ3IuZ2V0Q29sb3IocG9pbnRNZ3IuZ2V0Q3VycmVudFBpZWNlKDApKSwgXG4gICAgICAgICAgICAgICAgcDFDb2xvciA9IGNoZXNzTWdyLmdldENvbG9yKHBvaW50TWdyLmdldEN1cnJlbnRQaWVjZSgxKSk7XG4gICAgICAgICAgICBpZigocDVDb2xvciA9PSBwN0NvbG9yKSAmJiAocDVDb2xvciAhPSBwNkNvbG9yKSAmJiAocDZDb2xvciAhPSAndW5kZWZpbmVkJykpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhwb2ludE1nci5nZXRDdXJyZW50UGllY2UoNikpO1xuICAgICAgICAgICAgfSBlbHNlIGlmKChwN0NvbG9yID09IHAxQ29sb3IpICYmIChwN0NvbG9yICE9IHAwQ29sb3IpICYmIChwMENvbG9yICE9ICd1bmRlZmluZWQnKSApIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhwb2ludE1nci5nZXRDdXJyZW50UGllY2UoMCkpO1xuICAgICAgICAgICAgfSBcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzZXRPbGRQb3NpdGlvbjogZnVuY3Rpb24ob2xkUG9pbnQpIHtcbiAgICAgICAgbGV0IHBvaW50TWdyID0gcmVxdWlyZSgncG9pbnRNZ3InKTtcbiAgICAgICAgcG9pbnRNZ3IuaXNJbnBvaW50KG9sZFBvaW50LCBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgcG9pbnRNZ3Iuc2V0U3RhdHVzKGluZGV4LCB0cnVlKTsgICAgICAgIC8vIOiuvue9ruW3suenu+mZpOaji+WtkOS9jee9rueahOeKtuaAgVxuICAgICAgICAgICAgcG9pbnRNZ3Iuc2V0Q3VycmVudFBpZWNlKGluZGV4LCAtMSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyDliJ3lp4vljJbmlL7nva7mo4vlrZDliLDpu5jorqTkvY3nva5cbiAgICBpbml0Q2hlc3NUb1BvaW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgcG9pbnRNZ3IgPSByZXF1aXJlKCdwb2ludE1ncicpLFxuICAgICAgICAgICAgY2hlc3NNZ3IgPSByZXF1aXJlKCdjaGVzc01ncicpO1xuICAgICAgICBmb3IobGV0IGk9MDtpPDg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHBvaW50ID0gcG9pbnRNZ3IuZ2V0UG9pbnQoaSksIFxuICAgICAgICAgICAgICAgIGNoZXNzTWdyQ29sb3IgPSBjaGVzc01nci5nZXRDb2xvcihpKSxcbiAgICAgICAgICAgICAgICB4ID0gcG9pbnQueCwgXG4gICAgICAgICAgICAgICAgeSA9IHBvaW50Lnk7XG5cbiAgICAgICAgICAgIGlmKGNoZXNzTWdyQ29sb3IgPT0gJ3doaXRlJykge1xuICAgICAgICAgICAgICAgIGxldCBuZXdDaGVzcyA9IGNjLmluc3RhbnRpYXRlKHRoYXQud2hpdGVDaGVzc1ByZWZhYik7XG4gICAgICAgICAgICAgICAgdGhhdC5ub2RlLmFkZENoaWxkKG5ld0NoZXNzKTtcbiAgICAgICAgICAgICAgICBuZXdDaGVzcy5zZXRQb3NpdGlvbih4LCB5KTtcbiAgICAgICAgICAgICAgICBuZXdDaGVzcy5uYW1lID0gJ2NoZXNzUGllY2UnK2k7XG4gICAgICAgICAgICAgICAgbmV3Q2hlc3MuY2hlc3NDb2xvciA9ICd3aGl0ZSc7XG4gICAgICAgICAgICAgICAgbmV3Q2hlc3MuY2hlc3NJbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgY2MuZmluZCgnQ2FudmFzJykub24oJ3BpY2snLCB0aGF0Lm9uUGljaywgbmV3Q2hlc3MpO1xuICAgICAgICAgICAgICAgIG5ld0NoZXNzLm9uKCd0b3VjaHN0YXJ0JywgdGhhdC5vblRvdWNoU3RhcnQsIG5ld0NoZXNzKTtcbiAgICAgICAgICAgIH0gIGVsc2UgaWYoY2hlc3NNZ3JDb2xvciA9PSAnYmxhY2snKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5ld0NoZXNzID0gY2MuaW5zdGFudGlhdGUodGhpcy5ibGFja0NoZXNzUHJlZmFiKTtcbiAgICAgICAgICAgICAgICB0aGF0Lm5vZGUuYWRkQ2hpbGQobmV3Q2hlc3MpO1xuICAgICAgICAgICAgICAgIG5ld0NoZXNzLnNldFBvc2l0aW9uKHgsIHkpO1xuICAgICAgICAgICAgICAgIG5ld0NoZXNzLm5hbWUgPSAnY2hlc3NQaWVjZScraTtcbiAgICAgICAgICAgICAgICBuZXdDaGVzcy5jaGVzc0NvbG9yID0gJ2JsYWNrJztcbiAgICAgICAgICAgICAgICBuZXdDaGVzcy5jaGVzc0luZGV4ID0gaTtcbiAgICAgICAgICAgICAgICBjYy5maW5kKCdDYW52YXMnKS5vbigncGljaycsIHRoYXQub25QaWNrLCBuZXdDaGVzcyk7XG4gICAgICAgICAgICAgICAgbmV3Q2hlc3Mub24oJ3RvdWNoc3RhcnQnLCB0aGF0Lm9uVG91Y2hTdGFydCwgbmV3Q2hlc3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyDmo4vlrZDnp7vliqhcbiAgICBjaGVzc01vdmU6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIGxldCB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIGlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgIGVsLm9uKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2NhbGVBY3Rpb24gPSBjYy5zY2FsZUJ5KDAuMSwxLjUsIDEuNSk7XG4gICAgICAgICAgICB0aGlzLnJ1bkFjdGlvbihzY2FsZUFjdGlvbik7XG4gICAgICAgIH0uYmluZChlbCkpO1xuICAgIH0sXG4gICAgYWRkTmV3Q2hlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgY2hlc3NNZ3IgPSByZXF1aXJlKCdjaGVzc01ncicpLFxuICAgICAgICAgICAgeCA9IGNoZXNzTWdyLmdldFBvc2l0aW9uWCgpLFxuICAgICAgICAgICAgeSA9IGNoZXNzTWdyLmdldFBvc2l0aW9uWSgpLFxuICAgICAgICAgICAgbmV3Q2hlc3MgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNoZXNzUHJlZmFiKTtcbiAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKG5ld0NoZXNzKTtcbiAgICAgICAgY29uc29sZS5sb2coeCwgeSk7XG4gICAgICAgIG5ld0NoZXNzLnNldFBvc2l0aW9uKHgsIHkpO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgfVxufSk7XG4iLCIvLyDmo4vnm5jnrqHnkIZcbmxldCBwb2ludCA9IFtdO1xucG9pbnRbMF0gPSB7XG4gICAgeDogLTI0NixcbiAgICB5OiAyNjYsXG4gICAgaXNFbXB0eTogZmFsc2UsXG4gICAgY29sb3I6IFwid2hpdGVcIixcbiAgICBjdXJyZW50UGllY2U6IDBcbn07XG5wb2ludFsxXSA9IHtcbiAgICB4OiA0LFxuICAgIHk6IDI2NixcbiAgICBpc0VtcHR5OiBmYWxzZSxcbiAgICBjb2xvcjogXCJ3aGl0ZVwiLFxuICAgIGN1cnJlbnRQaWVjZTogMVxufTtcbnBvaW50WzJdID0ge1xuICAgIHg6IDI0NixcbiAgICB5OiAyNjYsXG4gICAgaXNFbXB0eTogZmFsc2UsXG4gICAgY29sb3I6IFwid2hpdGVcIixcbiAgICBjdXJyZW50UGllY2U6IDJcbn07XG5cbnBvaW50WzNdID0ge1xuICAgIHg6IDI1MCxcbiAgICB5OiAyMCxcbiAgICBpc0VtcHR5OiB0cnVlLFxuICAgIGNvbG9yOiBcIlwiLFxuICAgIGN1cnJlbnRQaWVjZTogLTFcbn07XG5cbnBvaW50WzRdID0ge1xuICAgIHg6IDI0NCxcbiAgICB5OiAtMjI3LFxuICAgIGlzRW1wdHk6IGZhbHNlLFxuICAgIGNvbG9yOiBcImJsYWNrXCIsXG4gICAgY3VycmVudFBpZWNlOiA0XG59O1xuXG5wb2ludFs1XSA9IHtcbiAgICB4OiAxLFxuICAgIHk6IC0yMzEsXG4gICAgaXNFbXB0eTogZmFsc2UsXG4gICAgY29sb3I6IFwiYmxhY2tcIixcbiAgICBjdXJyZW50UGllY2U6IDVcbn07XG5cbnBvaW50WzZdID0ge1xuICAgIHg6IC0yNTAsXG4gICAgeTogLTIyNyxcbiAgICBpc0VtcHR5OiBmYWxzZSxcbiAgICBjb2xvcjogXCJibGFja1wiLFxuICAgIGN1cnJlbnRQaWVjZTogNlxufTtcblxucG9pbnRbN10gPSB7XG4gICAgeDogLTI1MCxcbiAgICB5OiAxNCxcbiAgICBpc0VtcHR5OiB0cnVlLFxuICAgIGNvbG9yOiBcIlwiLFxuICAgIGN1cnJlbnRQaWVjZTogLTFcbn07XG5cbi8vIGNvbnNvbGUubG9nKHBvaW50KVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZXRQb2ludDogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHBvaW50W2luZGV4XTtcbiAgICB9LFxuICAgIGdldFBvc2l0aW9uOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICByZXR1cm4ocG9pbnRbaW5kZXhdLnggKyAnLCcgKyBwb2ludFtpbmRleF0ueSk7XG4gICAgfSxcbiAgICBnZXRTdGF0dXM6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIHJldHVybiBwb2ludFtpbmRleF0uaXNFbXB0eTtcbiAgICB9LFxuICAgIGdldENvbG9yOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICByZXR1cm4gcG9pbnRbaW5kZXhdLmNvbG9yO1xuICAgIH0sXG4gICAgLy8g6L+U5Zue57Si5byV5YC85L2N572u54K55a+55bqU55qE5qOL5a2Q57yW5Y+3XG4gICAgZ2V0Q3VycmVudFBpZWNlOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICByZXR1cm4gcG9pbnRbaW5kZXhdLmN1cnJlbnRQaWVjZTtcbiAgICB9LFxuICAgIHNldFN0YXR1czogZnVuY3Rpb24oaW5kZXgsIGJvb2wpIHtcbiAgICAgICAgcG9pbnRbaW5kZXhdLmlzRW1wdHkgPSBib29sO1xuICAgICAgICBjYy5sb2coJ+iuvue9ricsIGluZGV4LCAn5Li6JywgYm9vbCk7XG4gICAgICAgIC8vY2MubG9nKHBvaW50W2luZGV4XSk7XG4gICAgfSxcbiAgICBzZXRDb2xvcjogZnVuY3Rpb24oaW5kZXgsIG5ld0NvbG9yKSB7XG4gICAgICAgIHBvaW50W2luZGV4XS5jb2xvciA9IG5ld0NvbG9yO1xuICAgIH0sXG4gICAgLy8g6K6+572u57Si5byV5YC8IGluZGV4IOWvueW6lOeahCBjdXJyZW50UGllY2Ug5Li6IGNoZXNzTnVtYmVyIOWPt+aji+WtkFxuICAgIHNldEN1cnJlbnRQaWVjZTogZnVuY3Rpb24oaW5kZXgsIGNoZXNzTnVtYmVyKSB7XG4gICAgICAgICBwb2ludFtpbmRleF0uY3VycmVudFBpZWNlID0gY2hlc3NOdW1iZXI7XG4gICAgfSxcbiAgICBpc0lucG9pbnQ6IGZ1bmN0aW9uKHRhcmdldFBvaW50LCBjYWxsYmFjaykge1xuICAgICAgIC8vIGNvbnNvbGUubG9nKHRhcmdldFBvaW50KTtcbiAgICAgICAgbGV0IHRhcmdldFBvaW50WCA9IHRhcmdldFBvaW50LngsIHRhcmdldFBvaW50WSA9IHRhcmdldFBvaW50LnksIHJhbmdlID0gMTIwICA7XG4gICAgICAgIC8vZm9yKHZhciBpID0gMDsgaSA+IHBvaW50Lmxlbmd0aDsgaSArKyApIHtcbiAgICAgICAgICAgIC8vbGV0IHggPSBwb2ludFtpXS54LCB5ID0gcG9pbnRbaV0ueSwgXG4gICAgICAgICAgICAvLyDojIPlm7TlnZDmoIdcbiAgICAgICAgICAgIGlmKHRhcmdldFBvaW50WCA+IHJhbmdlICkge1xuICAgICAgICAgICAgICAgIGlmKHRhcmdldFBvaW50WTw9cmFuZ2UmJnRhcmdldFBvaW50WT49LXJhbmdlKXtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soMyk7XG4gICAgICAgICAgICAgICAgfWVsc2UgaWYgKHRhcmdldFBvaW50WT5yYW5nZSl7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKDIpO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmICh0YXJnZXRQb2ludFk8LXJhbmdlKXtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soNCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2UgaWYodGFyZ2V0UG9pbnRYPC1yYW5nZSl7XG4gICAgICAgICAgICAgICAgaWYodGFyZ2V0UG9pbnRZPnJhbmdlKXtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soMCk7XG4gICAgICAgICAgICAgICAgfWVsc2UgaWYodGFyZ2V0UG9pbnRZPD1yYW5nZSYmdGFyZ2V0UG9pbnRZPj0tcmFuZ2Upe1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayg3KTtcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZih0YXJnZXRQb2ludFk8LXJhbmdlKXtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soNik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgaWYodGFyZ2V0UG9pbnRZPnJhbmdlKXtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soMSk7XG4gICAgICAgICAgICAgICAgfWVsc2UgaWYodGFyZ2V0UG9pbnRZPC1yYW5nZSl7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKDUpO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIC8vfVxuICAgIH1cbn07XG5cbiJdfQ==