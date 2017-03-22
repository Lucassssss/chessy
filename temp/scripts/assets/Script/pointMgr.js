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