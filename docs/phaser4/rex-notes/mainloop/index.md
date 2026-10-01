Main loop
game.events prestep event. Global Managers like Input and Sound update.
trigger game.sound.update()
game.events step event. User-land code and plugins
Register event
scene.game.events.on('step', function(time, delta){
//
}, scope);
Update the Scene Manager and all active Scenes
scene.events preupdate event
Register event
scene.events.on('preupdate', function(time, delta){
//
}, scope);
InputPlugin.preUpdate()
TweenManager.preUpdate() to arrange active targets
UpdateList.preUpdate(), to arrange game objects in UpdateList
scene.events update event
Register event
scene.events.on('update', function(time, delta){
//
}, scope);
TweenManager.update(), to run active tweens
UpdateList.update
gameObject.preUpdate
Update arcade world
scene.update()
scene.events postupdate event
Register event
scene.events.on('postupdate', function(time, delta){
//
}, scope);
game.events poststep event. Final event before rendering starts.
Register event
scene.game.events.on('poststep', function(time, delta){
//
}, scope);
game.renderer.preRender()
game.events prerenderclear event
Register event
scene.game.events.on('prerenderclear', function(){
//
}, scope);
game.events prerender event
Register event
scene.game.events.on('prerender', function(){
//
}, scope);
SceneManager.render()
Sort display list
scene.events prerender event
Register event
scene.events.on('prerender', function(renderer){
//
}, scope);
Render cameras
scene.events render event
Register event
scene.events.on('render', function(renderer){
//
}, scope);
game.renderer.postRender()
game.events postrender event. Final event before the step repeats.
Register event
scene.game.events.on('postrender', function(renderer, time, delta){
//
}, scope);
Note
Each scene is a standalone system.
Flow chart¶
Game loop¶
graph TB
subgraph Render
GameRenderPreRender["game.renderer.preRender()"]
GameEventPreRenderClear>"game.events: prerenderclear"]
GameEventPreRender>"game.events: prerender"]
SceneManagerRender["SceneManager.render()<br>...See 'Scene steps'..."]
GameRenderPostRender["game.renderer.postRender()"]
GameEventPostRender>"game.events: postrender"]
end
subgraph Step
GameEventPreStep>"game.events: prestep<br><br>sound.update()"]
GameEventStep>"game.events: step"]
SceneManagerUpdate["SceneManager.update()<br>...See 'Scene steps'..."]
GameEventPostStep>"game.events: poststep"]
end
GameEventPreStep --> GameEventStep
GameEventStep --> SceneManagerUpdate
SceneManagerUpdate --> GameEventPostStep
GameEventPostStep --> GameRenderPreRender
GameRenderPreRender --> GameEventPreRenderClear
GameEventPreRenderClear --> GameEventPreRender
GameEventPreRender --> SceneManagerRender
SceneManagerRender --> GameRenderPostRender
GameRenderPostRender --> GameEventPostRender
GameEventPostRender --> GameEventPreStep
Scene steps¶
graph TB
subgraph Render
SceneEventPreRender>"scene.events: prerender"]
SceneCameraRender["scene.cameras.render()"]
SceneEventRender>"scene.events: render"]
end
subgraph Update
SceneEventPreUpdate>"scene.events: preupdate<br><br>InputPlugin.preUpdate()<br>TweenManager.preUpdate()<br>UpdateList.preUpdate()"]
SceneEventUpdate>"scene.events: update<br><br>TweenManager.update()<br>UpdateList.update()<br>gameObject.preUpdate()"]
SceneUpdate["scene.update()"]
SceneEventPostUpdate>"scene.events: postupdate"]
end
SceneEventPreUpdate --> SceneEventUpdate
SceneEventUpdate --> SceneUpdate
SceneUpdate --> SceneEventPostUpdate
SceneEventPostUpdate -.-> SceneEventPreRender
SceneEventPreRender --> SceneCameraRender
SceneCameraRender --> SceneEventRender
Rendering order¶
For each scene from bottom to top, in game
For each camera from bottom to top, in scene
For each game object from bottom to top in scene's displayList
Render this game object
Render children game objects, if game object is a container or a layer
Note
A game object can be seen by all cameras of this scene,
therefore game object could be rendering more than one times.
See also Ignore game object