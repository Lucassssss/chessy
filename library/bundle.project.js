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
    setStatus: function setStatus(index, bool) {
        point[index].isEmpty = bool;
    },
    setColor: function setColor(index, newColor) {
        point[index].color = newColor;
    }
};

cc._RFpop();
},{}]},{},["chess","chessMgr","main","pointMgr"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL1NjcmlwdC9jaGVzc01nci5qcyIsImFzc2V0cy9TY3JpcHQvY2hlc3MuanMiLCJhc3NldHMvU2NyaXB0L21haW4uanMiLCJhc3NldHMvU2NyaXB0L3BvaW50TWdyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FBO0FBQ0k7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ1I7QUFDSTtBQUNJO0FBQ0E7QUFDUjtBQUNBO0FBQ0k7QUFDSTtBQUNSO0FBQ0k7QUFDSTtBQUNSO0FBQ0k7QUFDSTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0k7QUFDSjtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDSTtBQUNKO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNSO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDUjtBQUNBO0FBQ0E7QUFFSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQVI7QUFDQTtBQUVJO0FBQ0k7QUFDSTtBQUFaO0FBQ0E7QUFDQTtBQUVJO0FBQ0k7QUFBUjtBQUNBO0FBQVE7QUFDSTtBQUNJO0FBQ0E7QUFFaEI7QUFDQTtBQUNBO0FBQ0E7QUFBSTtBQUNJO0FBRVI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFJO0FBQ0k7QUFFUjtBQUNBO0FBQVE7QUFDSTtBQUVaO0FBQ0E7QUFDQTtBQUFZO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRXBCO0FBRW9CO0FBQ0E7QUFDQTtBQUFwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUk7QUFDSTtBQUFSO0FBRVE7QUFDSTtBQUNBO0FBQVo7QUFDQTtBQUVJO0FBQ0k7QUFBUjtBQUNBO0FBQ0E7QUFFUTtBQUNBO0FBQ0E7QUFBUjtBQUNBO0FBRUk7QUFBSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSjtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSjtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ1I7QUFDSTtBQUNJO0FBQ1I7QUFDSTtBQUNJO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImxldCBjaGVzcyA9IHtcbiAgICBwb3N0aW9uWCA6IDAsXG4gICAgcG9zdGlvblk6IDAsXG4gICAgaXNEZWFkOiBmYWxzZVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgLy8gU2V0IGZ1bmN0aW9uc1xuICAgIHNldFN0YXR1czogZnVuY3Rpb24oaXMpIHtcbiAgICAgICAgY2hlc3MuaXNEZWFkID0gaXM7XG4gICAgfSxcbiAgICBtb3ZlOiBmdW5jdGlvbih4LCB5KSB7XG4gICAgICAgIGNoZXNzLnBvc3Rpb25YID0geDtcbiAgICAgICAgY2hlc3MucG9zdGlvblkgPSB5O1xuICAgIH0sXG4gICAgLy8gR2V0IGZ1bmN0aW9uc1xuICAgIGdldFN0YXR1czogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBjaGVzcy5pc0RlYWQ7XG4gICAgfSxcbiAgICBnZXRQb3NpdGlvblg6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY2hlc3MucG9zdGlvblg7XG4gICAgfSxcbiAgICBnZXRQb3NpdGlvblk6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY2hlc3MucG9zdGlvblk7XG4gICAgfVxufTsiLCJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBjaGVzczoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gbGV0IGNoZXNzTWdyID0gcmVxdWlyZSgnY2hlc3NNZ3InKTtcbiAgICAgICAgLy8gdGhpcy5jaGVzcy5zZXRQb3NpdGlvbihjaGVzc01nci5nZXRQb3NpdGlvbigpKTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgYmFja2dyb3VuZEF1ZGlvOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICAgICAgYmxhY2tDaGVzc1ByZWZhYjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9LFxuICAgICAgICB3aGl0ZUNoZXNzUHJlZmFiOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH0sXG4gICAgICAgIG1vdmluZ0NoZXNzTmFtZTogXCJcIlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pbml0Q2hlc3NUb1BvaW50KCk7XG4gICAgICAgIC8vIHRoaXMuYWRkTmV3Q2hlc3MoKTtcbiAgICAgICAgXG4gICAgfSxcblxuICAgIG9uVG91Y2hTdGFydDogZnVuY3Rpb24oZSkge1xuICAgICAgICBjYy5maW5kKCdDYW52YXMnKS5lbWl0KCdwaWNrJywgdGhpcy5uYW1lKTtcbiAgICAgICAgY2MuZmluZCgnQ2FudmFzJykuZW1pdCgncHV0JywgdGhpcy5uYW1lKTtcbiAgICAgICAgdGhpcy5ydW5BY3Rpb24oY2Muc2NhbGVUbygwLjEsIDEuMiwgMS4yKSk7XG4gICAgICAgIHRoaXMubW92aW5nQ2hlc3NOYW1lID0gdGhpcy5uYW1lO1xuICAgIH0sXG5cbiAgICBvblBpY2s6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYoZS5kZXRhaWwgIT09IHRoaXMubmFtZSkge1xuICAgICAgICAgICAgdGhpcy5ydW5BY3Rpb24oY2Muc2NhbGVUbygwLjEsMSwgMSkpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uUHV0OiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGxldCB4ID0gMCwgeSA9IDAsIHRoYXQgPSB0aGlzO1xuICAgICAgICBpZihlLmRldGFpbCA9PSB0aGlzLm5hbWUpIHtcbiAgICAgICAgICAgIGNjLmZpbmQoJ0NhbnZhcycpLm9uKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvblYyID0gdGhpcy5jb252ZXJ0VG9Ob2RlU3BhY2VBUihlLmdldExvY2F0aW9uKCkpO1xuICAgICAgICAgICAgICAgIHRoYXQucnVuQWN0aW9uKGNjLm1vdmVUbygwLjEsbG9jYXRpb25WMikpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgY2hlc3NNZ3IgPSByZXF1aXJlKCdjaGVzc01ncicpO1xuICAgICAgICAvLyB0aGlzLmNoZXNzTW92ZSgpO1xuICAgICAgICAvLyBTZXRcbiAgICAgICAgLy8gY2hlc3NNZ3IubW92ZSgyMDAsIDEwMCk7XG4gICAgfSxcbiAgICAvLyDliJ3lp4vljJbmlL7nva7mo4vlrZDliLDpu5jorqTkvY3nva5cbiAgICBpbml0Q2hlc3NUb1BvaW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgcG9pbnRNZ3IgPSByZXF1aXJlKCdwb2ludE1ncicpLFxuICAgICAgICAgICAgY2hlc3NNZ3IgPSByZXF1aXJlKCdjaGVzc01ncicpO1xuICAgICAgICBmb3IobGV0IGk9MDtpPDg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHBvaW50ID0gcG9pbnRNZ3IuZ2V0UG9pbnQoaSksIFxuICAgICAgICAgICAgICAgIHggPSBwb2ludC54LCBcbiAgICAgICAgICAgICAgICB5ID0gcG9pbnQueTtcbiAgICAgICAgICAgIC8vIGNoZXNzTWdyLm1vdmUoeCwgeSk7XG4gICAgICAgICAgICBpZighcG9pbnQuaXNFbXB0eSkge1xuICAgICAgICAgICAgICAgIGlmKHBvaW50LmNvbG9yID09ICd3aGl0ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0NoZXNzID0gY2MuaW5zdGFudGlhdGUodGhpcy53aGl0ZUNoZXNzUHJlZmFiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5ub2RlLmFkZENoaWxkKG5ld0NoZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3Q2hlc3Muc2V0UG9zaXRpb24oeCwgeSk7XG4gICAgICAgICAgICAgICAgICAgIG5ld0NoZXNzLm5hbWUgPSAnd2hpdGVDaGVzcycraTtcbiAgICAgICAgICAgICAgICAgICAgY2MuZmluZCgnQ2FudmFzJykub24oJ3BpY2snLCB0aGF0Lm9uUGljaywgbmV3Q2hlc3MpLFxuICAgICAgICAgICAgICAgICAgICBjYy5maW5kKCdDYW52YXMnKS5vbigncHV0JywgdGhhdC5vblB1dCwgbmV3Q2hlc3MpLFxuICAgICAgICAgICAgICAgICAgICBuZXdDaGVzcy5vbigndG91Y2hzdGFydCcsIHRoYXQub25Ub3VjaFN0YXJ0LCBuZXdDaGVzcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0NoZXNzID0gY2MuaW5zdGFudGlhdGUodGhpcy5ibGFja0NoZXNzUHJlZmFiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5ub2RlLmFkZENoaWxkKG5ld0NoZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3Q2hlc3Muc2V0UG9zaXRpb24oeCwgeSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy8g5qOL5a2Q56e75YqoXG4gICAgY2hlc3NNb3ZlOiBmdW5jdGlvbihlbCkge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICBpc01vdmluZyA9IGZhbHNlO1xuICAgICAgICBlbC5vbigndG91Y2hzdGFydCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNjYWxlQWN0aW9uID0gY2Muc2NhbGVCeSgwLjEsMS41LCAxLjUpO1xuICAgICAgICAgICAgdGhpcy5ydW5BY3Rpb24oc2NhbGVBY3Rpb24pO1xuICAgICAgICB9LmJpbmQoZWwpKTtcbiAgICB9LFxuICAgIGFkZE5ld0NoZXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGNoZXNzTWdyID0gcmVxdWlyZSgnY2hlc3NNZ3InKSxcbiAgICAgICAgICAgIHggPSBjaGVzc01nci5nZXRQb3NpdGlvblgoKSxcbiAgICAgICAgICAgIHkgPSBjaGVzc01nci5nZXRQb3NpdGlvblkoKSxcbiAgICAgICAgICAgIG5ld0NoZXNzID0gY2MuaW5zdGFudGlhdGUodGhpcy5jaGVzc1ByZWZhYik7XG4gICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChuZXdDaGVzcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHgsIHkpO1xuICAgICAgICBuZXdDaGVzcy5zZXRQb3NpdGlvbih4LCB5KTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcblxuICAgIH1cbn0pO1xuIiwibGV0IHBvaW50ID0gW107XG5wb2ludFswXSA9IHtcbiAgICB4OiAtMjQ2LFxuICAgIHk6IDI2NixcbiAgICBpc0VtcHR5OiBmYWxzZSxcbiAgICBjb2xvcjogXCJ3aGl0ZVwiXG59O1xucG9pbnRbMV0gPSB7XG4gICAgeDogNCxcbiAgICB5OiAyNjYsXG4gICAgaXNFbXB0eTogZmFsc2UsXG4gICAgY29sb3I6IFwid2hpdGVcIlxufTtcbnBvaW50WzJdID0ge1xuICAgIHg6IDI0NixcbiAgICB5OiAyNjYsXG4gICAgaXNFbXB0eTogZmFsc2UsXG4gICAgY29sb3I6IFwid2hpdGVcIlxufTtcblxucG9pbnRbM10gPSB7XG4gICAgeDogMjUwLFxuICAgIHk6IDIwLFxuICAgIGlzRW1wdHk6IHRydWUsXG4gICAgY29sb3I6IFwiXCJcbn07XG5cbnBvaW50WzRdID0ge1xuICAgIHg6IDI0NCxcbiAgICB5OiAtMjI3LFxuICAgIGlzRW1wdHk6IGZhbHNlLFxuICAgIGNvbG9yOiBcImJsYWNrXCJcbn07XG5cbnBvaW50WzVdID0ge1xuICAgIHg6IDEsXG4gICAgeTogLTIzMSxcbiAgICBpc0VtcHR5OiBmYWxzZSxcbiAgICBjb2xvcjogXCJibGFja1wiXG59O1xuXG5wb2ludFs2XSA9IHtcbiAgICB4OiAtMjUwLFxuICAgIHk6IC0yMjcsXG4gICAgaXNFbXB0eTogZmFsc2UsXG4gICAgY29sb3I6IFwiYmxhY2tcIlxufTtcblxucG9pbnRbN10gPSB7XG4gICAgeDogLTI1MCxcbiAgICB5OiAxNCxcbiAgICBpc0VtcHR5OiB0cnVlLFxuICAgIGNvbG9yOiBcIlwiXG59O1xuXG4vLyBjb25zb2xlLmxvZyhwb2ludClcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2V0UG9pbnQ6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIHJldHVybiBwb2ludFtpbmRleF07XG4gICAgfSxcbiAgICBzZXRTdGF0dXM6IGZ1bmN0aW9uKGluZGV4LCBib29sKSB7XG4gICAgICAgIHBvaW50W2luZGV4XS5pc0VtcHR5ID0gYm9vbDtcbiAgICB9LFxuICAgIHNldENvbG9yOiBmdW5jdGlvbihpbmRleCwgbmV3Q29sb3IpIHtcbiAgICAgICAgcG9pbnRbaW5kZXhdLmNvbG9yID0gbmV3Q29sb3I7XG4gICAgfVxufTtcblxuIl19