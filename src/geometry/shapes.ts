import {Point3d} from "./Point3d.ts";
import {translate} from "./transform.ts";

export function regularPolygon(sides: number, radius: number, angle: number = 0) : Point3d[] {
    const pol: Point3d[] = [];
    for (let side = 0; side < sides; side++) {
        const theta = angle + (2 * Math.PI * side / sides);
        pol.push({
            x: radius * Math.cos(theta),
            y: radius * -Math.sin(theta),
            z: 0,
        });
    }
    
    return pol;
}

export function extrude(shape: Point3d[], offset: Point3d) : Point3d[][] {
    const shapes = [];
    for(let i = 0; i < shape.length; i++) {
        const segmentStart = shape[i];
        const segmentEnd = shape[(i + 1) % shape.length];
        
        shapes.push([
            segmentStart,
            segmentEnd,
            translate(segmentEnd, offset),
            translate(segmentStart, offset),
        ]);
    }
    
    return shapes;
}