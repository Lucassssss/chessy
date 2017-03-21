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
        chessPrefab: {
            'default': null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.initChessToPoint();
        // this.addNewChess();
    },

    start: function start() {
        var chessMgr = require('chessMgr');
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
                newChess = cc.instantiate(this.chessPrefab);
            var x = point.x,
                y = point.y;
            // chessMgr.move(x, y);
            that.node.addChild(newChess);
            newChess.setPosition(x, y);
            console.log(x, y);
        }
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
    color: "white"
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL1NjcmlwdC9jaGVzc01nci5qcyIsImFzc2V0cy9TY3JpcHQvY2hlc3MuanMiLCJhc3NldHMvU2NyaXB0L21haW4uanMiLCJhc3NldHMvU2NyaXB0L3BvaW50TWdyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FBO0FBQ0k7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ1I7QUFDSTtBQUNJO0FBQ0E7QUFDUjtBQUNBO0FBQ0k7QUFDSTtBQUNSO0FBQ0k7QUFDSTtBQUNSO0FBQ0k7QUFDSTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0k7QUFDSjtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDSTtBQUNKO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNSO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDUjtBQUNBO0FBQ1E7QUFDSTtBQUNaO0FBQ1k7QUFDWjtBQUNBO0FBQ1k7QUFDQTtBQUNBO0FBQ1o7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNSO0FBQ0E7QUFDQTtBQUNRO0FBQ0E7QUFDQTtBQUNSO0FBQ0E7QUFDSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSjtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSjtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNKO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDUjtBQUNJO0FBQ0k7QUFDUjtBQUNJO0FBQ0k7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IGNoZXNzID0ge1xuICAgIHBvc3Rpb25YIDogMCxcbiAgICBwb3N0aW9uWTogMCxcbiAgICBpc0RlYWQ6IGZhbHNlXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAvLyBTZXQgZnVuY3Rpb25zXG4gICAgc2V0U3RhdHVzOiBmdW5jdGlvbihpcykge1xuICAgICAgICBjaGVzcy5pc0RlYWQgPSBpcztcbiAgICB9LFxuICAgIG1vdmU6IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgICAgY2hlc3MucG9zdGlvblggPSB4O1xuICAgICAgICBjaGVzcy5wb3N0aW9uWSA9IHk7XG4gICAgfSxcbiAgICAvLyBHZXQgZnVuY3Rpb25zXG4gICAgZ2V0U3RhdHVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNoZXNzLmlzRGVhZDtcbiAgICB9LFxuICAgIGdldFBvc2l0aW9uWDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBjaGVzcy5wb3N0aW9uWDtcbiAgICB9LFxuICAgIGdldFBvc2l0aW9uWTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBjaGVzcy5wb3N0aW9uWTtcbiAgICB9XG59OyIsImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGNoZXNzOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBsZXQgY2hlc3NNZ3IgPSByZXF1aXJlKCdjaGVzc01ncicpO1xuICAgICAgICAvLyB0aGlzLmNoZXNzLnNldFBvc2l0aW9uKGNoZXNzTWdyLmdldFBvc2l0aW9uKCkpO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBiYWNrZ3JvdW5kQXVkaW86IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgICAgICBjaGVzc1ByZWZhYjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmluaXRDaGVzc1RvUG9pbnQoKTtcbiAgICAgICAgLy8gdGhpcy5hZGROZXdDaGVzcygpO1xuICAgIH0sXG5cbiAgICBzdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBjaGVzc01nciA9IHJlcXVpcmUoJ2NoZXNzTWdyJyk7XG4gICAgICAgIC8vIFNldFxuICAgICAgICAvLyBjaGVzc01nci5tb3ZlKDIwMCwgMTAwKTtcbiAgICB9LFxuICAgIC8vIOWIneWni+WMluaUvue9ruaji+WtkOWIsOm7mOiupOS9jee9rlxuICAgIGluaXRDaGVzc1RvUG9pbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICBwb2ludE1nciA9IHJlcXVpcmUoJ3BvaW50TWdyJyksXG4gICAgICAgICAgICBjaGVzc01nciA9IHJlcXVpcmUoJ2NoZXNzTWdyJyk7XG4gICAgICAgIGZvcihsZXQgaT0wO2k8ODsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcG9pbnQgPSBwb2ludE1nci5nZXRQb2ludChpKSwgXG4gICAgICAgICAgICAgICAgbmV3Q2hlc3MgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNoZXNzUHJlZmFiKTtcbiAgICAgICAgICAgIHZhciB4ID0gcG9pbnQueCwgXG4gICAgICAgICAgICAgICAgeSA9IHBvaW50Lnk7XG4gICAgICAgICAgICAvLyBjaGVzc01nci5tb3ZlKHgsIHkpO1xuICAgICAgICAgICAgdGhhdC5ub2RlLmFkZENoaWxkKG5ld0NoZXNzKTtcbiAgICAgICAgICAgIG5ld0NoZXNzLnNldFBvc2l0aW9uKHgsIHkpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coeCwgeSlcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBhZGROZXdDaGVzczogZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBjaGVzc01nciA9IHJlcXVpcmUoJ2NoZXNzTWdyJyksXG4gICAgICAgICAgICB4ID0gY2hlc3NNZ3IuZ2V0UG9zaXRpb25YKCksXG4gICAgICAgICAgICB5ID0gY2hlc3NNZ3IuZ2V0UG9zaXRpb25ZKCksXG4gICAgICAgICAgICBuZXdDaGVzcyA9IGNjLmluc3RhbnRpYXRlKHRoaXMuY2hlc3NQcmVmYWIpO1xuICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQobmV3Q2hlc3MpO1xuICAgICAgICBjb25zb2xlLmxvZyh4LCB5KTtcbiAgICAgICAgbmV3Q2hlc3Muc2V0UG9zaXRpb24oeCwgeSk7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG5cbiAgICB9XG59KTtcbiIsImxldCBwb2ludCA9IFtdO1xucG9pbnRbMF0gPSB7XG4gICAgeDogNjgsXG4gICAgeTogNzQyLFxuICAgIGlzRW1wdHk6IGZhbHNlLFxuICAgIGNvbG9yOiBcIndoaXRlXCJcbn07XG5wb2ludFsxXSA9IHtcbiAgICB4OiAzMTcsXG4gICAgeTogNzQyLFxuICAgIGlzRW1wdHk6IGZhbHNlLFxuICAgIGNvbG9yOiBcIndoaXRlXCJcbn07XG5wb2ludFsyXSA9IHtcbiAgICB4OiA1NjMsXG4gICAgeTogNzQyLFxuICAgIGlzRW1wdHk6IGZhbHNlLFxuICAgIGNvbG9yOiBcIndoaXRlXCJcbn07XG5cbnBvaW50WzNdID0ge1xuICAgIHg6IDU2MyxcbiAgICB5OiA1MDQsXG4gICAgaXNFbXB0eTogdHJ1ZSxcbiAgICBjb2xvcjogXCJcIlxufTtcblxucG9pbnRbNF0gPSB7XG4gICAgeDogNTYzLFxuICAgIHk6IDI1MSxcbiAgICBpc0VtcHR5OiBmYWxzZSxcbiAgICBjb2xvcjogXCJibGFja1wiXG59O1xuXG5wb2ludFs1XSA9IHtcbiAgICB4OiAzMjUsXG4gICAgeTogMjUxLFxuICAgIGlzRW1wdHk6IGZhbHNlLFxuICAgIGNvbG9yOiBcImJsYWNrXCJcbn07XG5cbnBvaW50WzZdID0ge1xuICAgIHg6IDY4LFxuICAgIHk6IDI1MSxcbiAgICBpc0VtcHR5OiBmYWxzZSxcbiAgICBjb2xvcjogXCJibGFja1wiXG59O1xuXG5wb2ludFs3XSA9IHtcbiAgICB4OiA2OCxcbiAgICB5OiA1MDQsXG4gICAgaXNFbXB0eTogdHJ1ZSxcbiAgICBjb2xvcjogXCJcIlxufTtcblxuLy8gY29uc29sZS5sb2cocG9pbnQpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdldFBvaW50OiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICByZXR1cm4gcG9pbnRbaW5kZXhdO1xuICAgIH0sXG4gICAgc2V0U3RhdHVzOiBmdW5jdGlvbihpbmRleCwgYm9vbCkge1xuICAgICAgICBwb2ludFtpbmRleF0uaXNFbXB0eSA9IGJvb2w7XG4gICAgfSxcbiAgICBzZXRDb2xvcjogZnVuY3Rpb24oaW5kZXgsIG5ld0NvbG9yKSB7XG4gICAgICAgIHBvaW50W2luZGV4XS5jb2xvciA9IG5ld0NvbG9yO1xuICAgIH1cbn07XG5cbiJdfQ==