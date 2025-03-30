import {Camera, Point3d} from "./geometry/Point3d.ts";
import {drawShape} from "./rendering/render.ts";
import {extrude, regularPolygon} from "./geometry/shapes.ts";
import {aim} from "./geometry/perspective.ts";

const canvas : HTMLCanvasElement = document.createElement("canvas");
canvas.id = "bg";
document.querySelector("body")!.prepend(canvas);
const fps = 15;

const camera : Camera = {
    viewPort: { 
        x: 0,
        y: 0,
        width: 0,
        height: 0
    },
    position: {
        x: 0, // driving direction positive
        y: 0, // right is positive
        z: 1.5, // up is positive
    },
    angle: {
        pitch: 0, // 0 is forward, Math.PI / 2 is down, -Math.PI is up
        yaw: 0, // 0 is facing towards positive z at half pi pitch
        roll: 0, // 0 is positive z is up at half pi pitch 
    },
    focalDistance: 100,
    zPlane: 1
}

drawScene();
let refreshHandle : number | undefined = undefined;

window.addEventListener('resize', drawScene);
toggle_background();

function toggle_background()
{
    if (refreshHandle)
        clearInterval(refreshHandle);
    else
        refreshHandle = setInterval(drawScene,1000/fps);
}

function prepareCamera()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    camera.viewPort.width = window.innerWidth;
    camera.viewPort.height = window.innerHeight;
    
    const time = (10 * new Date().getTime() / 1000 / fps); 
    
    camera.position.x = -50 * Math.cos(time);
    camera.position.y = -50 * Math.sin(time);   
    camera.position.z = 10;
    
    camera.angle = aim(camera.position, { x:0, y:0, z: 0 });
    
    console.log(camera.position);
    
    const context = canvas.getContext("2d");

    if (!context)
        return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    
    return context;
}
function drawScene()
{
    const context = prepareCamera();
    
    if (!context)
        return;

    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0.2, "#52E0B5"); //#00ffb3
    gradient.addColorStop(0.7, "#c0c0fc");
    context.strokeStyle = gradient;
    context.lineWidth = 1;
    context.lineCap = "round";
    

    // const bar1 : Point3d[] = [
    //     {x: 0, y: 5, z:0}, 
    //     {x: 100, y: 5, z:0},
    //     {x: 100, y: 5.1, z:0}, 
    //     {x: 0, y: 5.1, z:0},
    // ];
    // const bar2 : Point3d[] = bar1.map(p => ({ ...p, y: 0 - p.y }));
    //
    // side lines
    // drawShape(ctx, bar1, true, camera);
    // drawShape(ctx, bar2, true, camera);
    
    const dist = 1;
    const range = 10;
    
    for(let i = -range; i <= range; i += dist)
    {
        context.strokeStyle = "red";
        drawShape(context, [{x: dist * -range, y: dist * i, z: 0}, {x: dist * range, y: dist * i, z: 0}], false, camera);

        context.strokeStyle = "green";
        drawShape(context, [{x: dist * -i, y: dist * -range, z: 0}, {x: dist * -i, y: dist * range, z: 0}], false, camera);
    }
    
    context.lineWidth = 3;
    context.strokeStyle = "cyan";
    const shape = regularPolygon(20, 5);
    const offset: Point3d = { x:0, y:0, z: 2 };
    const cylinder = extrude(shape, offset);
    
    for(const path of cylinder)
        drawShape(context,path,false, camera);
}