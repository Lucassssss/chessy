require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"chessMgr":[function(require,module,exports){
"use strict";
cc._RFpush(module, '683d1m9EIVGZq90eO0xBzmw', 'chessMgr');
// Script/chessMgr.js

var chess = {
    postionX: 0,
    postionY: 0,
    isDead: false
};

module.exports = {
    // Set functions
    setStatus: function setStatus(is) {
        chess.isDead = is;
    },
    move: function move(x, y) {
        chess.postionX = x;
        chess.postionY = y;
    },
    // Get functions
    getStatus: function getStatus() {
        return chess.isDead;
    },
    getPositionX: function getPositionX() {
        return chess.postionX;
    },
    getPositionY: function getPositionY() {
        return chess.postionY;
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
},{"chessMgr":"chessMgr","pointMgr":"pointMgr"}],"pointMgr":[function(require,module,exports){
"use strict";
cc._RFpush(module, '01d78VFhoxOb42lekaigJsN', 'pointMgr');
// Script/pointMgr.js

var point = [];
point[0] = {
    x: -246,
    y: 266,
    isEmpty: false,
    color: "white"
};
point[1] = {
    x: 4,
    y: 266,
    isEmpty: false,
    color: "white"
};
point[2] = {
    x: 246,
    y: 266,
    isEmpty: false,
    color: "white"
};

point[3] = {
    x: 250,
    y: 20,
    isEmpty: true,
    color: ""
};

point[4] = {
    x: 244,
    y: -227,
    isEmpty: false,
    color: "black"
};

point[5] = {
    x: 1,
    y: -231,
    isEmpty: false,
    color: "black"
};

point[6] = {
    x: -250,
    y: -227,
    isEmpty: false,
    color: "black"
};

point[7] = {
    x: -250,
    y: 14,
    isEmpty: true,
    color: ""
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
    setStatus: function setStatus(index, bool) {
        point[index].isEmpty = bool;
        cc.log('设置', index, '为', bool);
        cc.log(point[index]);
    },
    setColor: function setColor(index, newColor) {
        point[index].color = newColor;
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL1NjcmlwdC9jaGVzc01nci5qcyIsImFzc2V0cy9TY3JpcHQvY2hlc3MuanMiLCJhc3NldHMvU2NyaXB0L21haW4uanMiLCJhc3NldHMvU2NyaXB0L3BvaW50TWdyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FBO0FBQ0k7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ1I7QUFDSTtBQUNJO0FBQ0E7QUFDUjtBQUNBO0FBQ0k7QUFDSTtBQUNSO0FBQ0k7QUFDSTtBQUNSO0FBQ0k7QUFDSTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0k7QUFDSjtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDSTtBQUNKO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDQTtBQUNBO0FBQ0E7QUFDUjtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDUjtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDUjtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDWjtBQUNZO0FBQ1o7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNSO0FBQ0E7QUFDQTtBQUFZO0FBRVo7QUFEWTtBQUdaO0FBRlk7QUFJWjtBQUNBO0FBQ0E7QUFGWTtBQUlaO0FBSGdCO0FBS2hCO0FBQ0E7QUFIZ0I7QUFLaEI7QUFKb0I7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQU14QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkk7QUFDSTtBQUNBO0FBQ0k7QUFNWjtBQUNBO0FBQ0E7QUFDQTtBQUpJO0FBQ0k7QUFNUjtBQUNBO0FBSlE7QUFDSTtBQU1aO0FBQ0E7QUFDQTtBQUpZO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTXBCO0FBSG9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZJO0FBQ0k7QUFJUjtBQUZRO0FBQ0k7QUFDQTtBQUlaO0FBQ0E7QUFGSTtBQUNJO0FBSVI7QUFDQTtBQUNBO0FBRlE7QUFDQTtBQUNBO0FBSVI7QUFDQTtBQUZJO0FBSUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEpBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSjtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNSO0FBQ0k7QUFDSTtBQUNSO0FBQ0k7QUFDSTtBQUNSO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDUjtBQUNJO0FBQ0k7QUFDUjtBQUNJO0FBQ0o7QUFDUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEWTtBQUNJO0FBQ0k7QUFHcEI7QUFEb0I7QUFHcEI7QUFEb0I7QUFHcEI7QUFDQTtBQURnQjtBQUNJO0FBR3BCO0FBRG9CO0FBR3BCO0FBRG9CO0FBR3BCO0FBQ0E7QUFEZ0I7QUFDSTtBQUdwQjtBQURvQjtBQUdwQjtBQURvQjtBQUdwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJsZXQgY2hlc3MgPSB7XG4gICAgcG9zdGlvblggOiAwLFxuICAgIHBvc3Rpb25ZOiAwLFxuICAgIGlzRGVhZDogZmFsc2Vcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIC8vIFNldCBmdW5jdGlvbnNcbiAgICBzZXRTdGF0dXM6IGZ1bmN0aW9uKGlzKSB7XG4gICAgICAgIGNoZXNzLmlzRGVhZCA9IGlzO1xuICAgIH0sXG4gICAgbW92ZTogZnVuY3Rpb24oeCwgeSkge1xuICAgICAgICBjaGVzcy5wb3N0aW9uWCA9IHg7XG4gICAgICAgIGNoZXNzLnBvc3Rpb25ZID0geTtcbiAgICB9LFxuICAgIC8vIEdldCBmdW5jdGlvbnNcbiAgICBnZXRTdGF0dXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY2hlc3MuaXNEZWFkO1xuICAgIH0sXG4gICAgZ2V0UG9zaXRpb25YOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNoZXNzLnBvc3Rpb25YO1xuICAgIH0sXG4gICAgZ2V0UG9zaXRpb25ZOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNoZXNzLnBvc3Rpb25ZO1xuICAgIH1cbn07IiwiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgY2hlc3M6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGxldCBjaGVzc01nciA9IHJlcXVpcmUoJ2NoZXNzTWdyJyk7XG4gICAgICAgIC8vIHRoaXMuY2hlc3Muc2V0UG9zaXRpb24oY2hlc3NNZ3IuZ2V0UG9zaXRpb24oKSk7XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGJhY2tncm91bmRBdWRpbzoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG4gICAgICAgIHBpY2tBdWRpbzoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG4gICAgICAgIHB1dEF1ZGlvOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICAgICAgYmxhY2tDaGVzc1ByZWZhYjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9LFxuICAgICAgICB3aGl0ZUNoZXNzUHJlZmFiOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH0sXG4gICAgICAgIG1vdmVBYmxlOiBmYWxzZSxcbiAgICAgICAgbW92aW5nQ2hlc3NOYW1lOiBcIlwiLFxuICAgICAgICBvbGRQb3NpdGlvblg6IDAsXG4gICAgICAgIG9sZFBvc2l0aW9uWTogMFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pbml0Q2hlc3NUb1BvaW50KCk7XG4gICAgICAgIHRoaXMubm9kZS5vbihcInRvdWNoc3RhcnRcIiwgdGhpcy5vblB1dCwgdGhpcyk7XG4gICAgfSxcblxuICAgIG9uVG91Y2hTdGFydDogZnVuY3Rpb24oZSkge1xuICAgICAgICBjYy5maW5kKCdDYW52YXMnKS5lbWl0KCdwaWNrJywgdGhpcy5uYW1lKTtcbiAgICAgICAgdGhpcy5ydW5BY3Rpb24oY2Muc2NhbGVUbygwLjEsIDEuMiwgMS4yKSk7XG4gICAgICAgIGNjLmZpbmQoJ0NhbnZhcycpLmdldENvbXBvbmVudCgnbWFpbicpLm1vdmVBYmxlID0gdHJ1ZTtcbiAgICAgICAgY2MuZmluZCgnQ2FudmFzJykuZ2V0Q29tcG9uZW50KCdtYWluJykubW92aW5nQ2hlc3NOYW1lID0gdGhpcy5uYW1lO1xuICAgICAgICBjYy5maW5kKCdDYW52YXMnKS5nZXRDb21wb25lbnQoJ21haW4nKS5vbGRQb3NpdGlvblggPSB0aGlzLng7XG4gICAgICAgIGNjLmZpbmQoJ0NhbnZhcycpLmdldENvbXBvbmVudCgnbWFpbicpLm9sZFBvc2l0aW9uWSA9IHRoaXMueTtcbiAgICB9LFxuXG4gICAgb25QaWNrOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmKGUuZGV0YWlsICE9PSB0aGlzLm5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMucnVuQWN0aW9uKGNjLnNjYWxlVG8oMC4xLDEsIDEpKTtcbiAgICAgICAgICAgIGNjLmZpbmQoJ0NhbnZhcycpLmdldENvbXBvbmVudCgnbWFpbicpLm1vdmVBYmxlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYy5maW5kKCdDYW52YXMnKS5lbWl0KCdwdXQnLCB0aGlzLm5hbWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uUHV0OiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGxldCB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIG9sZFBvaW50ID0ge3g6IHRoYXQub2xkUG9zaXRpb25YICx5OiB0aGF0Lm9sZFBvc2l0aW9uWX0sXG4gICAgICAgICAgICBtb3ZlQWJsZSA9IGNjLmZpbmQoJ0NhbnZhcycpLmdldENvbXBvbmVudCgnbWFpbicpLm1vdmVBYmxlLCAgIC8vIOaYr+WQpuWPr+enu+WKqFxuICAgICAgICAgICAgbW92aW5nQ2hlc3NOYW1lID0gY2MuZmluZCgnQ2FudmFzJykuZ2V0Q29tcG9uZW50KCdtYWluJykubW92aW5nQ2hlc3NOYW1lLCAgIC8vIOWPr+enu+WKqOeahOaji+WtkCBuYW1lXG4gICAgICAgICAgICBtb3ZlQ2hlc3NOb2RlID0gY2MuZmluZCgnQ2FudmFzJykuZ2V0Q2hpbGRCeU5hbWUobW92aW5nQ2hlc3NOYW1lKSwgIC8vIOWPr+enu+WKqOaji+WtkOeahOiKgueCuVxuICAgICAgICAgICAgdGFyZ2V0UG9pbnQgPSB0aGlzLm5vZGUuY29udmVydFRvTm9kZVNwYWNlQVIoZS5nZXRMb2NhdGlvbigpKSxcbiAgICAgICAgICAgIHBvaW50TWdyID0gcmVxdWlyZSgncG9pbnRNZ3InKTtcblxuICAgICAgICAgICAgLy8gY2MubG9nKG9sZFBvaW50KTtcbiAgICAgICAgICAgIHBvaW50TWdyLmlzSW5wb2ludCh0YXJnZXRQb2ludCwgZnVuY3Rpb24oaW5kZXgpIHsgICAvLyDkvKDpgJLnm67moIflnZDmoIfvvIzlpoLmnpzlnKjlt7LlrprkuYnnmoTngrnojIPlm7TlhoXliJnov5Tlm57or6Xlt7LlrprkuYnngrnnmoTntKLlvJVcbiAgICAgICAgICAgICAgICBsZXQgcG9pbnRYID0gcG9pbnRNZ3IuZ2V0UG9pbnQoaW5kZXgpLngsIFxuICAgICAgICAgICAgICAgICAgICBwb2ludFkgPSBwb2ludE1nci5nZXRQb2ludChpbmRleCkueTtcbiAgICAgICAgICAgICAgICAvLyBjYy5sb2cocG9pbnRYLCBwb2ludFkpXG4gICAgICAgICAgICAgICAgaWYocG9pbnRYICYmIHBvaW50WSAmJiBwb2ludE1nci5nZXRTdGF0dXMoaW5kZXgpKSB7IC8vIOWIpOaWreaYr+WQpuacieaji+WtkO+8jOWdkOagh+aYr+WQpuWtmOWcqFxuICAgICAgICAgICAgICAgICAgICBpZihtb3ZlQ2hlc3NOb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb3ZlQ2hlc3NOb2RlLnJ1bkFjdGlvbihjYy5tb3ZlVG8oMC4xLCBwb2ludFgsIHBvaW50WSkpOyAgIC8vIOagueaNruS6i+S7tuS8oOi/h+adpeeahOebruagh+eCueWBmuenu+WKqFxuICAgICAgICAgICAgICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGF0LnB1dEF1ZGlvLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludE1nci5zZXRTdGF0dXMoaW5kZXgsIGZhbHNlKTsgICAgIC8vIOiuvue9ruivpeS9jee9ruW3suWNoOeUqFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5zZXRPbGRQb3NpdGlvbihvbGRQb2ludCwgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNldE9sZFBvc2l0aW9uOiBmdW5jdGlvbihvbGRQb2ludCkge1xuICAgICAgICBsZXQgcG9pbnRNZ3IgPSByZXF1aXJlKCdwb2ludE1ncicpO1xuICAgICAgICBwb2ludE1nci5pc0lucG9pbnQob2xkUG9pbnQsIGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICBwb2ludE1nci5zZXRTdGF0dXMoaW5kZXgsIHRydWUpOyAgICAgICAgLy8g6K6+572u5bey56e76Zmk5qOL5a2Q5L2N572u55qE54q25oCBXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyDliJ3lp4vljJbmlL7nva7mo4vlrZDliLDpu5jorqTkvY3nva5cbiAgICBpbml0Q2hlc3NUb1BvaW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgcG9pbnRNZ3IgPSByZXF1aXJlKCdwb2ludE1ncicpLFxuICAgICAgICAgICAgY2hlc3NNZ3IgPSByZXF1aXJlKCdjaGVzc01ncicpO1xuICAgICAgICBmb3IobGV0IGk9MDtpPDg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHBvaW50ID0gcG9pbnRNZ3IuZ2V0UG9pbnQoaSksIFxuICAgICAgICAgICAgICAgIHggPSBwb2ludC54LCBcbiAgICAgICAgICAgICAgICB5ID0gcG9pbnQueTtcbiAgICAgICAgICAgIC8vIGNoZXNzTWdyLm1vdmUoeCwgeSk7XG4gICAgICAgICAgICBpZighcG9pbnQuaXNFbXB0eSkge1xuICAgICAgICAgICAgICAgIGlmKHBvaW50LmNvbG9yID09ICd3aGl0ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0NoZXNzID0gY2MuaW5zdGFudGlhdGUodGhpcy53aGl0ZUNoZXNzUHJlZmFiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5ub2RlLmFkZENoaWxkKG5ld0NoZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3Q2hlc3Muc2V0UG9zaXRpb24oeCwgeSk7XG4gICAgICAgICAgICAgICAgICAgIG5ld0NoZXNzLm5hbWUgPSAnd2hpdGVDaGVzcycraTtcbiAgICAgICAgICAgICAgICAgICAgY2MuZmluZCgnQ2FudmFzJykub24oJ3BpY2snLCB0aGF0Lm9uUGljaywgbmV3Q2hlc3MpLFxuICAgICAgICAgICAgICAgICAgICBuZXdDaGVzcy5vbigndG91Y2hzdGFydCcsIHRoYXQub25Ub3VjaFN0YXJ0LCBuZXdDaGVzcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0NoZXNzID0gY2MuaW5zdGFudGlhdGUodGhpcy5ibGFja0NoZXNzUHJlZmFiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5ub2RlLmFkZENoaWxkKG5ld0NoZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3Q2hlc3Muc2V0UG9zaXRpb24oeCwgeSk7XG4gICAgICAgICAgICAgICAgICAgIG5ld0NoZXNzLm5hbWUgPSAnd2hpdGVDaGVzcycraTtcbiAgICAgICAgICAgICAgICAgICAgY2MuZmluZCgnQ2FudmFzJykub24oJ3BpY2snLCB0aGF0Lm9uUGljaywgbmV3Q2hlc3MpLFxuICAgICAgICAgICAgICAgICAgICBuZXdDaGVzcy5vbigndG91Y2hzdGFydCcsIHRoYXQub25Ub3VjaFN0YXJ0LCBuZXdDaGVzcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy8g5qOL5a2Q56e75YqoXG4gICAgY2hlc3NNb3ZlOiBmdW5jdGlvbihlbCkge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICBpc01vdmluZyA9IGZhbHNlO1xuICAgICAgICBlbC5vbigndG91Y2hzdGFydCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNjYWxlQWN0aW9uID0gY2Muc2NhbGVCeSgwLjEsMS41LCAxLjUpO1xuICAgICAgICAgICAgdGhpcy5ydW5BY3Rpb24oc2NhbGVBY3Rpb24pO1xuICAgICAgICB9LmJpbmQoZWwpKTtcbiAgICB9LFxuICAgIGFkZE5ld0NoZXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGNoZXNzTWdyID0gcmVxdWlyZSgnY2hlc3NNZ3InKSxcbiAgICAgICAgICAgIHggPSBjaGVzc01nci5nZXRQb3NpdGlvblgoKSxcbiAgICAgICAgICAgIHkgPSBjaGVzc01nci5nZXRQb3NpdGlvblkoKSxcbiAgICAgICAgICAgIG5ld0NoZXNzID0gY2MuaW5zdGFudGlhdGUodGhpcy5jaGVzc1ByZWZhYik7XG4gICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChuZXdDaGVzcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHgsIHkpO1xuICAgICAgICBuZXdDaGVzcy5zZXRQb3NpdGlvbih4LCB5KTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcblxuICAgIH1cbn0pO1xuIiwibGV0IHBvaW50ID0gW107XG5wb2ludFswXSA9IHtcbiAgICB4OiAtMjQ2LFxuICAgIHk6IDI2NixcbiAgICBpc0VtcHR5OiBmYWxzZSxcbiAgICBjb2xvcjogXCJ3aGl0ZVwiXG59O1xucG9pbnRbMV0gPSB7XG4gICAgeDogNCxcbiAgICB5OiAyNjYsXG4gICAgaXNFbXB0eTogZmFsc2UsXG4gICAgY29sb3I6IFwid2hpdGVcIlxufTtcbnBvaW50WzJdID0ge1xuICAgIHg6IDI0NixcbiAgICB5OiAyNjYsXG4gICAgaXNFbXB0eTogZmFsc2UsXG4gICAgY29sb3I6IFwid2hpdGVcIlxufTtcblxucG9pbnRbM10gPSB7XG4gICAgeDogMjUwLFxuICAgIHk6IDIwLFxuICAgIGlzRW1wdHk6IHRydWUsXG4gICAgY29sb3I6IFwiXCJcbn07XG5cbnBvaW50WzRdID0ge1xuICAgIHg6IDI0NCxcbiAgICB5OiAtMjI3LFxuICAgIGlzRW1wdHk6IGZhbHNlLFxuICAgIGNvbG9yOiBcImJsYWNrXCJcbn07XG5cbnBvaW50WzVdID0ge1xuICAgIHg6IDEsXG4gICAgeTogLTIzMSxcbiAgICBpc0VtcHR5OiBmYWxzZSxcbiAgICBjb2xvcjogXCJibGFja1wiXG59O1xuXG5wb2ludFs2XSA9IHtcbiAgICB4OiAtMjUwLFxuICAgIHk6IC0yMjcsXG4gICAgaXNFbXB0eTogZmFsc2UsXG4gICAgY29sb3I6IFwiYmxhY2tcIlxufTtcblxucG9pbnRbN10gPSB7XG4gICAgeDogLTI1MCxcbiAgICB5OiAxNCxcbiAgICBpc0VtcHR5OiB0cnVlLFxuICAgIGNvbG9yOiBcIlwiXG59O1xuXG4vLyBjb25zb2xlLmxvZyhwb2ludClcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2V0UG9pbnQ6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIHJldHVybiBwb2ludFtpbmRleF07XG4gICAgfSxcbiAgICBnZXRQb3NpdGlvbjogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuKHBvaW50W2luZGV4XS54ICsgJywnICsgcG9pbnRbaW5kZXhdLnkpO1xuICAgIH0sXG4gICAgZ2V0U3RhdHVzOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICByZXR1cm4gcG9pbnRbaW5kZXhdLmlzRW1wdHk7XG4gICAgfSxcbiAgICBzZXRTdGF0dXM6IGZ1bmN0aW9uKGluZGV4LCBib29sKSB7XG4gICAgICAgIHBvaW50W2luZGV4XS5pc0VtcHR5ID0gYm9vbDtcbiAgICAgICAgY2MubG9nKCforr7nva4nLCBpbmRleCwgJ+S4uicsIGJvb2wpO1xuICAgICAgICBjYy5sb2cocG9pbnRbaW5kZXhdKTtcbiAgICB9LFxuICAgIHNldENvbG9yOiBmdW5jdGlvbihpbmRleCwgbmV3Q29sb3IpIHtcbiAgICAgICAgcG9pbnRbaW5kZXhdLmNvbG9yID0gbmV3Q29sb3I7XG4gICAgfSxcbiAgICBpc0lucG9pbnQ6IGZ1bmN0aW9uKHRhcmdldFBvaW50LCBjYWxsYmFjaykge1xuICAgICAgIC8vIGNvbnNvbGUubG9nKHRhcmdldFBvaW50KTtcbiAgICAgICAgbGV0IHRhcmdldFBvaW50WCA9IHRhcmdldFBvaW50LngsIHRhcmdldFBvaW50WSA9IHRhcmdldFBvaW50LnksIHJhbmdlID0gMTIwICA7XG4gICAgICAgIC8vZm9yKHZhciBpID0gMDsgaSA+IHBvaW50Lmxlbmd0aDsgaSArKyApIHtcbiAgICAgICAgICAgIC8vbGV0IHggPSBwb2ludFtpXS54LCB5ID0gcG9pbnRbaV0ueSwgXG4gICAgICAgICAgICAvLyDojIPlm7TlnZDmoIdcbiAgICAgICAgICAgIGlmKHRhcmdldFBvaW50WCA+IHJhbmdlICkge1xuICAgICAgICAgICAgICAgIGlmKHRhcmdldFBvaW50WTw9cmFuZ2UmJnRhcmdldFBvaW50WT49LXJhbmdlKXtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soMyk7XG4gICAgICAgICAgICAgICAgfWVsc2UgaWYgKHRhcmdldFBvaW50WT5yYW5nZSl7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKDIpO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmICh0YXJnZXRQb2ludFk8LXJhbmdlKXtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soNCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2UgaWYodGFyZ2V0UG9pbnRYPC1yYW5nZSl7XG4gICAgICAgICAgICAgICAgaWYodGFyZ2V0UG9pbnRZPnJhbmdlKXtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soMCk7XG4gICAgICAgICAgICAgICAgfWVsc2UgaWYodGFyZ2V0UG9pbnRZPD1yYW5nZSYmdGFyZ2V0UG9pbnRZPj0tcmFuZ2Upe1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayg3KTtcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZih0YXJnZXRQb2ludFk8LXJhbmdlKXtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soNik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgaWYodGFyZ2V0UG9pbnRZPnJhbmdlKXtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soMSk7XG4gICAgICAgICAgICAgICAgfWVsc2UgaWYodGFyZ2V0UG9pbnRZPC1yYW5nZSl7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKDUpO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIC8vfVxuICAgIH1cbn07XG5cbiJdfQ==