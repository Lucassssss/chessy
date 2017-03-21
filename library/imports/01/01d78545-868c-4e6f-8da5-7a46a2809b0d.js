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