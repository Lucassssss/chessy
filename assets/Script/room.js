cc.Class({
    extends: cc.Component,

    properties: {
        roomPrefab: {
            default: null,
            type: cc.Prefab
        },
        userId : ''

    },

    // use this for initialization
    onLoad: function () {
        // 设置 userid
        this.userId = Math.random().toString(36).substr(2);

        var that = this,
            socket = window.io('http://localhost:3000');
        
        socket.on('connected', function(msg) {
            // socket 链接成功，修改 label 文字
            var label = that.node.getChildren('networkLabel');
            label[0].getComponent("cc.Label").string = msg;
            
            // 初始化，传 userId 到后台
            socket.emit('game_init', that.userId);
            console.log('11');
            // 获取房间列表

        });
    },

    storeUser: function() {

    }
    
});
