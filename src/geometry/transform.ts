import {Angle3d, Point3d} from "./Point3d.ts";

export function transformToCamera(point: Point3d, { position, angle } : { position: Point3d, angle: Angle3d }) : Point3d {
    let relPos = translate(point, invert(position));
    relPos = rotateZ(relPos, -angle.yaw + Math.PI / 2);
    relPos = rotateX(relPos, -angle.pitch + Math.PI / 2);
    relPos = rotateZ(relPos, -angle.roll);
    return relPos;
}

export function translate(point: Point3d, ref: Point3d): Point3d {
    return {
        x: point.x + ref.x,
        y: point.y + ref.y,
        z: point.z + ref.z,
    }
}
export function invert(point: Point3d): Point3d {
    return {
        x: -point.x,
        y: -point.y,
        z: -point.z,
    }
}

export function scale(point: Point3d, scale: number): Point3d {
    return {
        x: point.x * scale,
        y: point.y * scale,
        z: point.z * scale,
    }
}

export function rotateY(point: Point3d, angle: number): Point3d {
    return {
        x: Math.cos(angle) * point.x - Math.sin(angle) * point.z,
        y: point.y,
        z: Math.cos(angle) * point.z + Math.sin(angle) * point.x,
    };
}

export function rotateZ(point: Point3d, angle : number): Point3d {
    return {
        x: Math.cos(angle) * point.x - Math.sin(angle) * point.y,
        y: Math.cos(angle) * point.y + Math.sin(angle) * point.x,
        z: point.z,
    };
}

export function rotateX(point: Point3d, angle : number): Point3d {
    return {
        x: point.x,
        y: Math.cos(angle) * point.y - Math.sin(angle) * point.z,
        z: Math.cos(angle) * point.z + Math.sin(angle) * point.y,
    };
}