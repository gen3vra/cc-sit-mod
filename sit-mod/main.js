var oldColUpdate = null;
var isSitting = false;
var lastPressedAdjustedHeadKeyCache = null;
var sitMoveSpeed = 1;
var sitMoveMult = 1;
var sitOnGroundTimer = 0;
var sitState = -1;

if (versions.hasOwnProperty('input-api')) {
    ig.lang.labels.sc.gui.options.controls.keys.sitanywhere = 'Sit Down';
    ig.lang.labels.sc.gui.options.controls.keys.sitanywhereL = 'Turn Head Left';
    ig.lang.labels.sc.gui.options.controls.keys.sitanywhereR = 'Turn Head Right';
    ig.lang.labels.sc.gui.options.headers.sitanywhere = 'sit anywhere';
    ig.lang.labels.sc.gui.options.headers.sitanywhereL = 'sit left';
    ig.lang.labels.sc.gui.options.headers.sitanywhereR = 'sit right';

} else {
    ig.input.bind(220, 'sitanywhere');
    ig.input.bind(219, 'sitanywhereL');
    ig.input.bind(221, 'sitanywhereR');
}

ig.ENTITY.Player.inject({
    update(...args) {
        if (isSitting) {
            // adjusted pos is off by 8,8
            let pos = ig.game.playerEntity.getAlignedPos()
            pos.x -= 8
            pos.y -= 8

            if (ig.input.state('quick'))
                sitMoveMult = 0.2;
            else
                sitMoveMult = 1;

            sitMoveSpeed = 1 * sitMoveMult;


            if (ig.input.state('dash2')) {
                pos.z += sitMoveSpeed;
            } else if (ig.input.state('guard')) {
                pos.z -= sitMoveSpeed;
            }

            if (ig.input.state('left')) {
                pos.x -= sitMoveSpeed;
            } else if (ig.input.state('right')) {
                pos.x += sitMoveSpeed;
            } else if (ig.input.state('up')) {
                pos.y -= sitMoveSpeed;
            } else if (ig.input.state('down')) {
                pos.y += sitMoveSpeed;
            }
            ig.game.playerEntity.setPos(pos.x, pos.y, pos.z)

            if (ig.input.pressed('sitanywhereL')) {
                if (lastPressedAdjustedHeadKeyCache === "sitFaceDownLeft") {
                    doSitAction("sit" + (sitState === 0 ? "" : "Ground"));
                    lastPressedAdjustedHeadKeyCache = "sit";
                } else {
                    if (sitState === 0)
                        doSitAction("sitFaceDownLeft");
                    else
                        doSitAction("sitGroundFaceDownLeft");
                    lastPressedAdjustedHeadKeyCache = "sitFaceDownLeft";

                }
            } else if (ig.input.pressed('sitanywhereR')) {
                if (lastPressedAdjustedHeadKeyCache === "sitFaceUpRight") {
                    doSitAction("sit" + (sitState === 0 ? "" : "Ground"));
                    lastPressedAdjustedHeadKeyCache = "sit";
                } else {
                    if (sitState === 0)
                        doSitAction("sitFaceUpRight");
                    else
                        doSitAction("sitGroundFaceUpRight");
                    lastPressedAdjustedHeadKeyCache = "sitFaceUpRight";
                }
            }


            if (ig.input.state('sitanywhere')) {
                sitOnGroundTimer += ig.system.tick;
                if (sitOnGroundTimer > 0.3) {
                    doSitAction("sitGround");
                    sitState = 1;
                }
            }
        }

        if (ig.input.pressed('sitanywhere')) {
            if (!isSitting) {
                sitState = 0;
                doSitAction();
                isSitting = true;
                oldColUpdate = ig.game.playerEntity.coll.update;
                ig.game.playerEntity.coll.update = function () { };
                ig.game.playerEntity.coll.vel = {x: 0, y: 0, z: 0};
                // Set by game forcefully in coll update
                ig.game.playerEntity.coll.ignoreCollision = true;
                ig.game.playerEntity.coll.zGravityFactor = 0;

            } else {
                ig.game.playerEntity.cancelAction()
                isSitting = false;
                ig.game.playerEntity.coll.update = oldColUpdate;
                ig.game.playerEntity.coll.zGravityFactor = 1;
                sitOnGroundTimer = 0;
                sitState = -1;
            }
        }

        return this.parent(...args);
    },
});

function doSitAction(sitDir = "sit") {
    new cc.ig.events.DO_ACTION({
        entity: {
            player: true
        },
        action: [
            {
                type: "SHOW_EXTERN_ANIM",
                anim: {
                    sheet: "player-poses",
                    name: sitDir
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
}
