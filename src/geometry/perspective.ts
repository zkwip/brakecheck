import {Angle3d, Camera, Point2d, Point3d} from "./Point3d.ts";
import {transformToCamera} from "./transform.ts";

/**
 * Projects a polygon in 3D coordinate space to a 2D view
 *
 * @param {*} points the array of points describing the shape
 * @param close whether to connect the last point back to the first
 * @param {*} camera the object describing the position, angle and zoom characteristics of the camera
 */
export function project(points: Point3d[], close: boolean, camera : Camera) : Point2d[] {
    const preScale = camera.viewPort.width * camera.focalDistance / 35 / 2;
    const xOffset = camera.viewPort.x + camera.viewPort.width / 2;
    const yOffset = camera.viewPort.y + camera.viewPort.height / 2;

    const transformed = points.map(p => transformToCamera(p, camera));
    const clipped = clipShapeOnPositiveZPlane(transformed, camera.zPlane, close);
    const projected = clipped.map(point => ({
        x: xOffset + preScale * point.x / point.z,
        y: yOffset + preScale * point.y / point.z
    }));
    
    return projected;
}

/**
 * Clips a polygon to only be on the positive side of a given z plane.
 *
 * @param points the array of points describing the shape
 * @param zPlane the z-plane to clip to
 * @param loop whether to connect the last point back to the first
 * @returns the clipped points
 */
function clipShapeOnPositiveZPlane(points: Point3d[], zPlane: number, loop: boolean): Point3d[] {
    if (points.length <= 1)
        return [];

    const last = points[points.length - 1];
    const first = points[0];
    let clipped = [];

    if (first.z >= zPlane)
        clipped.push(first);

    for(let i = 1; i < points.length; i++) {
        const prev = points[i-1];
        const current = points[i];
        
        if ((prev.z >= zPlane) != (current.z >= zPlane))
            clipped.push(intersectWithZPlane(prev, current, zPlane));
        
        if (current.z >= zPlane)
            clipped.push(current);
    }
    
    if (loop) {
        if ((last.z >= zPlane) != (first.z >= zPlane))
            clipped.push(intersectWithZPlane(last,first, zPlane));

        if (first.z >= zPlane)
            clipped.push(first);
    }
    
    return clipped;
}

/**
 * Finds the intersection point where a given line, denoted by two points, crosses a z-plane.
 *
 * @param p1 one point on the line
 * @param p2 another point on the line
 * @param zplane the z value of the plane
 * @returns a point on both the line and the plane
 */
export function intersectWithZPlane(p1: Point3d, p2: Point3d, zplane: number) : Point3d {
    if (p1.z == p2.z)
        return p1;

    const ratio = (zplane - p1.z) / (p2.z - p1.z);

    return {
        x: p1.x + (p2.x - p1.x) * ratio,
        y: p1.y + (p2.y - p1.y) * ratio,
        z: zplane
    }
}

export function aim(p1: Point3d, p2: Point3d) : Angle3d {
    const yaw = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const reach = Math.sqrt((p2.y - p1.y) * (p2.y - p1.y) + (p2.x - p1.x) * (p2.x - p1.x));
    const pitch = Math.atan((p2.z - p1.z) / reach);
    
    return { pitch, yaw, roll: 0 };
}