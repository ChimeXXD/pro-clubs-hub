// The turntable's drag (D-35): how far a sideways drag turns the head. One frame per PX_PER_FRAME pixels, so a full
// turn of 36 frames is a 288 px drag, about the picture's width on a phone. It wraps both ways.
export const PX_PER_FRAME = 8;

export function turnFrame(startFrame: number, dx: number, frames: number): number {
  const moved = Math.trunc(dx / PX_PER_FRAME);
  return (((startFrame + moved) % frames) + frames) % frames;
}
