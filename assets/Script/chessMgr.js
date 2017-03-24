// 棋子管理
let chess = [];

chess[0] = {
    currentPositon : 0,
    isDead : false,
    color: 'white'
};

chess[1] = {
    currentPositon : 1,
    isDead : false,
    color: 'white'
};

chess[2] = {
    currentPositon : 2,
    isDead : false,
    color: 'white'
};

chess[3] = {};

chess[4] = {
    currentPositon : 4,
    isDead : false,
    color: 'black'
};

chess[5] = {
    currentPositon : 5,
    isDead : false,
    color: 'black'
};

chess[6] = {
    currentPositon : 6,
    isDead : false,
    color: 'black'
};

chess[7] = {};

module.exports = {
    getStatus: function(index) {
        return chess[index].isDead;
    },
    getCurrentPosition: function(index) {
        return chess[index].currentPositon;
    },
    getColor: function(index) {
        if(index != -1) {
            return chess[index].color;
        } else {
            return false;
        }
    },
    setStatus: function(index, newStatus) {
        chess[index].isDead = newStatus;
    },
    setCurrentPosition: function(index, newPosition) {
        chess[index].currentPositon = newPosition;
    },
    setColor: function() {
        // 理论上不能重新设置棋子颜色
    },

};