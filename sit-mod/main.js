

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
                ig.game.playerEntity.coll.shadow.size = 0
                // Old method using player movement, seemed buggy and offsets player every time we set this
                //ig.game.playerEntity.coll.setSize(0.1, 0.1, 0.1)
                oldColUpdate = ig.game.playerEntity.coll.update;
                ig.game.playerEntity.coll.update = function () { }
                ig.game.playerEntity.coll.vel = {x: 0, y: 0, z: 0}

            } else {
                ig.game.playerEntity.cancelAction()
                isSitting = false;
                //ig.game.playerEntity.coll.setSize(16, 16, 24)
                ig.game.playerEntity.coll.update = oldColUpdate;

            }


        }

        return this.parent(...args);
    },
});



