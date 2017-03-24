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