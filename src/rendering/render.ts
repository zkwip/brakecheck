import { Camera, Point3d } from "../geometry/Point3d.ts";
import { project } from "../geometry/perspective.ts";

/**
 * Draws a polygon in 3d coordinate space to a drawing context and camera
 * 
 * @param {*} ctx context
 * @param {*} path the array of points describing the shape
 * @param close whether to connect the last point back to the first
 * @param {*} camera the object describing the position, angle and zoom characteristics of the camera
 */
export function drawShape(ctx: CanvasRenderingContext2D, path: Point3d[], close: boolean, camera : Camera) {
    const trace = project(path, close, camera);
    if (trace.length == 0)
        return;
    ctx.beginPath();
    ctx.moveTo(trace[0].x, trace[0].y);
    for(const point of trace)
        ctx.lineTo(point.x, point.y);
    
    ctx.stroke();
}