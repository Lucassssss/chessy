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
        chessBlack: {
            "default": null,
            type: cc.Node
        },
        chessWhite: {
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
},{"chessMgr":"chessMgr","pointMgr":"pointMgr"}],"pointMgr":[function(require,module,exports){
"use strict";
cc._RFpush(module, '01d78VFhoxOb42lekaigJsN', 'pointMgr');
// Script/pointMgr.js

var point = [];
point[0] = {
    x: 68,
    y: 742,
    isEmpty: false,
    color: white
};
point[1] = {
    x: 317,
    y: 742,
    isEmpty: false,
    color: "white"
};
point[2] = {
    x: 563,
    y: 742,
    isEmpty: false,
    color: "white"
};

point[3] = {
    x: 563,
    y: 504,
    isEmpty: true,
    color: ""
};

point[4] = {
    x: 563,
    y: 251,
    isEmpty: false,
    color: "black"
};

point[5] = {
    x: 325,
    y: 251,
    isEmpty: false,
    color: "black"
};

point[6] = {
    x: 68,
    y: 251,
    isEmpty: false,
    color: "black"
};

point[7] = {
    x: 68,
    y: 504,
    isEmpty: true,
    color: ""
};

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL1NjcmlwdC9jaGVzc01nci5qcyIsImFzc2V0cy9TY3JpcHQvY2hlc3MuanMiLCJhc3NldHMvU2NyaXB0L21haW4uanMiLCJhc3NldHMvU2NyaXB0L3BvaW50TWdyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FBO0FBQ0k7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ1I7QUFDSTtBQUNJO0FBQ0E7QUFDUjtBQUNBO0FBQ0k7QUFDSTtBQUNSO0FBQ0k7QUFDSTtBQUNSO0FBQ0k7QUFDSTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0k7QUFDSjtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNJO0FBQ0o7QUFDSTtBQUNJO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDUjtBQUNBO0FBQ0k7QUFDSTtBQUNSO0FBQ1E7QUFDUjtBQUNBO0FBQ0k7QUFDSTtBQUNSO0FBQ1E7QUFDUjtBQUNBO0FBQ0k7QUFDSTtBQUNSO0FBQ0E7QUFDQTtBQUNRO0FBQ0E7QUFDQTtBQUNSO0FBQ0E7QUFDSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSjtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSjtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNSO0FBQ0k7QUFDSTtBQUNSO0FBQ0k7QUFDSTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJsZXQgY2hlc3MgPSB7XG4gICAgcG9zdGlvblggOiAwLFxuICAgIHBvc3Rpb25ZOiAwLFxuICAgIGlzRGVhZDogZmFsc2Vcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIC8vIFNldCBmdW5jdGlvbnNcbiAgICBzZXRTdGF0dXM6IGZ1bmN0aW9uKGlzKSB7XG4gICAgICAgIGNoZXNzLmlzRGVhZCA9IGlzO1xuICAgIH0sXG4gICAgbW92ZTogZnVuY3Rpb24oeCwgeSkge1xuICAgICAgICBjaGVzcy5wb3N0aW9uWCA9IHg7XG4gICAgICAgIGNoZXNzLnBvc3Rpb25ZID0geTtcbiAgICB9LFxuICAgIC8vIEdldCBmdW5jdGlvbnNcbiAgICBnZXRTdGF0dXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY2hlc3MuaXNEZWFkO1xuICAgIH0sXG4gICAgZ2V0UG9zaXRpb25YOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNoZXNzLnBvc3Rpb25YO1xuICAgIH0sXG4gICAgZ2V0UG9zaXRpb25ZOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNoZXNzLnBvc3Rpb25ZO1xuICAgIH1cbn07IiwiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgY2hlc3NCbGFjazoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcbiAgICAgICAgY2hlc3NXaGl0ZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gbGV0IGNoZXNzTWdyID0gcmVxdWlyZSgnY2hlc3NNZ3InKTtcbiAgICAgICAgLy8gdGhpcy5jaGVzcy5zZXRQb3NpdGlvbihjaGVzc01nci5nZXRQb3NpdGlvbigpKTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgYmFja2dyb3VuZEF1ZGlvOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICAgICAgY2hlc3NQcmVmYWI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pbml0Q2hlc3NUb1BvaW50KCk7XG4gICAgICAgIHRoaXMuYWRkTmV3Q2hlc3MoKTtcbiAgICB9LFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgY2hlc3NNZ3IgPSByZXF1aXJlKCdjaGVzc01ncicpO1xuICAgICAgICAvLyBTZXRcbiAgICAgICAgY2hlc3NNZ3IubW92ZSgyMDAsIDEwMCk7XG4gICAgfSxcbiAgICAvLyDliJ3lp4vljJbmlL7nva7mo4vlrZDliLDpu5jorqTkvY3nva5cbiAgICBpbml0Q2hlc3NUb1BvaW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHBvaW50TWdyID0gcmVxdWlyZSgncG9pbnRNZ3InKSxcbiAgICAgICAgICAgIHBvaW50QXJyYXkgPSBwb2ludE1nci5nZXRQb2ludCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhwb2ludEFycmF5KTtcbiAgICB9LFxuXG4gICAgYWRkTmV3Q2hlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgY2hlc3NNZ3IgPSByZXF1aXJlKCdjaGVzc01ncicpLFxuICAgICAgICAgICAgeCA9IGNoZXNzTWdyLmdldFBvc2l0aW9uWCgpLFxuICAgICAgICAgICAgeSA9IGNoZXNzTWdyLmdldFBvc2l0aW9uWSgpLFxuICAgICAgICAgICAgbmV3Q2hlc3MgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNoZXNzUHJlZmFiKTtcbiAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKG5ld0NoZXNzKTtcbiAgICAgICAgY29uc29sZS5sb2coeCwgeSk7XG4gICAgICAgIG5ld0NoZXNzLnNldFBvc2l0aW9uKHgsIHkpO1xuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgfVxufSk7XG4iLCJsZXQgcG9pbnQgPSBbXTtcbnBvaW50WzBdID0ge1xuICAgIHg6IDY4LFxuICAgIHk6IDc0MixcbiAgICBpc0VtcHR5OiBmYWxzZSxcbiAgICBjb2xvcjogd2hpdGVcbn07XG5wb2ludFsxXSA9IHtcbiAgICB4OiAzMTcsXG4gICAgeTogNzQyLFxuICAgIGlzRW1wdHk6IGZhbHNlLFxuICAgIGNvbG9yOiBcIndoaXRlXCJcbn07XG5wb2ludFsyXSA9IHtcbiAgICB4OiA1NjMsXG4gICAgeTogNzQyLFxuICAgIGlzRW1wdHk6IGZhbHNlLFxuICAgIGNvbG9yOiBcIndoaXRlXCJcbn07XG5cbnBvaW50WzNdID0ge1xuICAgIHg6IDU2MyxcbiAgICB5OiA1MDQsXG4gICAgaXNFbXB0eTogdHJ1ZSxcbiAgICBjb2xvcjogXCJcIlxufTtcblxucG9pbnRbNF0gPSB7XG4gICAgeDogNTYzLFxuICAgIHk6IDI1MSxcbiAgICBpc0VtcHR5OiBmYWxzZSxcbiAgICBjb2xvcjogXCJibGFja1wiXG59O1xuXG5wb2ludFs1XSA9IHtcbiAgICB4OiAzMjUsXG4gICAgeTogMjUxLFxuICAgIGlzRW1wdHk6IGZhbHNlLFxuICAgIGNvbG9yOiBcImJsYWNrXCJcbn07XG5cbnBvaW50WzZdID0ge1xuICAgIHg6IDY4LFxuICAgIHk6IDI1MSxcbiAgICBpc0VtcHR5OiBmYWxzZSxcbiAgICBjb2xvcjogXCJibGFja1wiXG59O1xuXG5wb2ludFs3XSA9IHtcbiAgICB4OiA2OCxcbiAgICB5OiA1MDQsXG4gICAgaXNFbXB0eTogdHJ1ZSxcbiAgICBjb2xvcjogXCJcIlxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2V0UG9pbnQ6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIHJldHVybiBwb2ludFtpbmRleF07XG4gICAgfSxcbiAgICBzZXRTdGF0dXM6IGZ1bmN0aW9uKGluZGV4LCBib29sKSB7XG4gICAgICAgIHBvaW50W2luZGV4XS5pc0VtcHR5ID0gYm9vbDtcbiAgICB9LFxuICAgIHNldENvbG9yOiBmdW5jdGlvbihpbmRleCwgbmV3Q29sb3IpIHtcbiAgICAgICAgcG9pbnRbaW5kZXhdLmNvbG9yID0gbmV3Q29sb3I7XG4gICAgfVxufTtcblxuIl19