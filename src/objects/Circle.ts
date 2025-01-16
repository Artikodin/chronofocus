import { Dot } from './Dots';

export class Circle {
  dots: Dot[];
  radius: number;
  progress: number;
  centerX: number;
  centerY: number;
  dotCount: number;
  resetRAF?: number;

  constructor(dotCount: number, radius: number, centerX: number, centerY: number) {
    this.dots = Array.from({ length: dotCount }, (_, i) => {
      const angle = (i / dotCount) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      return new Dot(x, y, i);
    });
    this.dotCount = dotCount;
    this.centerX = centerX;
    this.centerY = centerY;
    this.radius = radius;
    this.progress = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.dots.forEach((dot) => {
      dot.draw(ctx);
    });
  }

  update(delta: number, options: { duration: number }) {
    const { duration } = options;

    this.progress = this.progress + delta / duration;
    this.progress = Math.min(1, this.progress);

    const dotToHide = Math.floor(this.progress * this.dotCount);

    this.dots.forEach((dot) => {
      const angle = Math.atan2(dot.originalY - this.centerY, dot.originalX - this.centerX);

      if (dotToHide >= dot.index) {
        dot.update(delta, { angle, distance: 40, duration: 1 });
      }
    });
  }

  updateReset(delta: number, options: { duration: number }) {
    const { duration } = options;

    this.progress = this.progress - delta / duration;
    this.progress = Math.max(0, this.progress);

    const dotToShow = Math.floor(this.progress * this.dotCount);

    this.dots.forEach((dot) => {
      const angle = Math.atan2(dot.originalY - this.centerY, dot.originalX - this.centerX);

      if (dotToShow <= dot.index) {
        dot.updateReset(delta, { angle, duration: 1 });
      }
    });
  }
}
