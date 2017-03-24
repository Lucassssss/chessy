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