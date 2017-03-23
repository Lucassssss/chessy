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