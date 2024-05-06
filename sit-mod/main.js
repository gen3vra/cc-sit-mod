

/*
name: "sitFaceDownLeft" < Face left while sitting
name: "sitFaceUpRight" < Face right while sitting
I have no idea why the names are like this, the other poses don't work?
*/
// DEBUG STUFF
var debugMode = true;
var oldColUpdate = null; // store old collision update function to restore

var isSitting = false;
ig.input.bind(219, 'doSitLea');
//ig.game.playerEntity.getAlignedPos()
//{x: 1007.69, y: 475.54, z: 0}
ig.ENTITY.Player.inject({
    update(...args) {
        if (isSitting) {
            // if sitting, change head direction with left and right arrow keys, 32 is spacebar, left arrow is 37, right arrow is 39
            /*
                            ig.game.playerEntity.getAlignedPos()
            
            {x: 867.89, y: 659.28, z: 0}*/
            /*
            let pos = ig.game.playerEntity.getAlignedPos()
                pos.x -= 8
                pos.y -= 8
                ig.game.playerEntity.setPos(pos.x, pos.y, pos.z)
                stays the same
                */

            if (ig.input.state('left')) {
                console.log("left")
                // get pos and minus 1 from x
                let pos = ig.game.playerEntity.getAlignedPos()
                pos.x -= 9; // move x axis
                pos.y -= 8; // keeps y axis the same
                ig.game.playerEntity.setPos(pos.x, pos.y, pos.z)
            } else if (ig.input.state('right')) {
                console.log("right")
                // get pos and add 1 to x
                let pos = ig.game.playerEntity.getAlignedPos()
                pos.x -= 7; // move x axis
                pos.y -= 8; // keeps y axis the same
                ig.game.playerEntity.setPos(pos.x, pos.y, pos.z)
            } else if (ig.input.state('up')) {
                console.log("up")
                let pos = ig.game.playerEntity.getAlignedPos()
                pos.x -= 8
                pos.y -= 9
                ig.game.playerEntity.setPos(pos.x, pos.y, pos.z)
            } else if (ig.input.state('down')) {
                console.log("down")
                let pos = ig.game.playerEntity.getAlignedPos()
                pos.x -= 8
                pos.y -= 7
                ig.game.playerEntity.setPos(pos.x, pos.y, pos.z)
            }

        }

        if (ig.input.pressed('doSitLea')) {

            if (!isSitting) {
                new cc.ig.events.DO_ACTION({
                    entity: {
                        player: true
                    },
                    action: [
                        {
                            type: "SHOW_EXTERN_ANIM",
                            anim: {
                                sheet: "player-poses",
                                //name: "sitFaceDownLeft"
                                name: Math.random() > 0.5 ? "sitFaceDownLeft" : "sitFaceUpRight"
                            }
                        },
                        {
                            value: 0.03,
                            type: "SET_RELATIVE_SPEED"
                        },
                        {
                            value: false,
                            type: "SET_JUMPING"
                        },
                        {
                            name: "loop",
                            type: "LABEL"
                        },
                        {
                            time: 1,
                            rotateSpeed: 10,
                            stopBeforeEdge: false,
                            allowStop: true,
                            type: "PLAYER_MOVE_TO_DIR"
                        },
                        {
                            name: "loop",
                            type: "GOTO_LABEL"
                        }
                    ],
                    repeating: false,
                    wait: false,
                    keepState: false,
                    immediately: false
                }).start(cc.ig.playerInstance())
                isSitting = true;
                ig.game.playerEntity.coll.shadow.size = 0;
                // Old method using player movement, seemed buggy and offsets player every time we set this
                //ig.game.playerEntity.coll.setSize(0.1, 0.1, 0.1)
                oldColUpdate = ig.game.playerEntity.coll.update;
                ig.game.playerEntity.coll.update = function () { };
                ig.game.playerEntity.coll.vel = {x: 0, y: 0, z: 0};
                // Set by game forcefully in coll update
                ig.game.playerEntity.coll.ignoreCollision = true;
                ig.game.playerEntity.coll.zGravityFactor = 0;

            } else {
                ig.game.playerEntity.cancelAction()
                isSitting = false;
                //ig.game.playerEntity.coll.setSize(16, 16, 24)
                ig.game.playerEntity.coll.update = oldColUpdate;
                ig.game.playerEntity.coll.zGravityFactor = 1;
            }
        }

        return this.parent(...args);
    },
});



