export type Point3d = {
    x:number,
    y:number,
    z:number,
}

export type Point2d = {
    x:number,
    y:number,
}

export type Angle3d = {
    pitch: number,
    yaw: number,
    roll: number,
}

export type Rectangle = {
    x:number,
    y:number,
    width:number,
    height:number,
}

export type Camera = {
    position: Point3d,
    angle: Angle3d,
    focalDistance: number,
    viewPort: Rectangle,
    zPlane: number,
}