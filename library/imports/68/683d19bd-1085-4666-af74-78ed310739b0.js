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