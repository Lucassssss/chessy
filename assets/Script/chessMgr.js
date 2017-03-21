let chess = {
    postionX : 0,
    postionY: 0,
    isDead: false
};

module.exports = {
    // Set functions
    setStatus: function(is) {
        chess.isDead = is;
    },
    move: function(x, y) {
        chess.postionX = x;
        chess.postionY = y;
    },
    // Get functions
    getStatus: function() {
        return chess.isDead;
    },
    getPositionX: function() {
        return chess.postionX;
    },
    getPositionY: function() {
        return chess.postionY;
    }
};