import { easeInCubic } from '../utils/transitions';

/**
 * Linear interpolation between start and end values based on a progress ratio
 * @param start Starting value
 * @param end Ending value
 * @param progress Progress ratio (0 to 1)
 * @returns Interpolated value between start and end
 */
export const lerp = (start: number, end: number, progress: number): number => {
  return start + (end - start) * progress;
};
export class Dot {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  opacity: number;
  progress: number;
  visible: boolean;
  size: number;
  index: number;

  constructor(x: number, y: number, index: number) {
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.index = index;

    this.opacity = 1;
    this.size = 2;
    this.progress = 0;
    this.visible = true;
  }

  update(delta: number, options: { angle: number; distance: number; duration: number }) {
    const { angle, distance, duration } = options;
    if (this.progress >= 1) {
      this.visible = false;
      return;
    }

    this.progress = this.progress + delta / duration;
    this.progress = Math.min(1, this.progress);
    const eased = easeInCubic(this.progress);

    this.x = this.originalX + Math.cos(angle) * distance * eased;
    this.y = this.originalY + Math.sin(angle) * distance * eased;
    this.opacity = 1 - eased;
  }

  updateReset(delta: number, options: { angle: number; duration: number }) {
    const { angle, duration } = options;
    if (this.progress <= 0) {
      this.visible = true;
      return;
    }

    this.progress = this.progress - delta / duration;
    this.progress = Math.max(0, this.progress);
    const eased = easeInCubic(this.progress);

    const distance = Math.hypot(this.x - this.originalX, this.y - this.originalY);
    this.x = this.originalX + Math.cos(angle) * distance * eased;
    this.y = this.originalY + Math.sin(angle) * distance * eased;
    this.opacity = lerp(0.5, 1, 1 - eased);
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw glow (always at original position)
    ctx.beginPath();
    ctx.arc(this.originalX, this.originalY, this.size * 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, 0.2)`;
    ctx.fill();

    // Draw main dot (at animated position)
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.fill();
  }
}
