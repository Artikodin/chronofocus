interface Point {
  x: number;
  y: number;
}

export class Blob {
  private points: Point[] = [];
  private readonly POINTS_NUMBER = 24;
  private progress: number = 0;
  private totalTime: number = 0;
  private readonly ANIMATION_DURATION = 20; // seconds, slower animation
  private readonly WAVE_INTENSITY = 45; // increased wave intensity
  private readonly WAVE_FREQUENCY = 0.4; // slightly slower frequency for more pronounced waves
  private readonly SECONDARY_WAVE_INTENSITY = 0.7; // increased secondary wave effect

  constructor(
    private centerX: number,
    private centerY: number,
    private radius: number,
    private noiseOffset: number = 1000
  ) {
    this.initializePoints();
  }

  private initializePoints() {
    this.points = Array.from({ length: this.POINTS_NUMBER }, (_, i) => {
      const angle = (i / this.POINTS_NUMBER) * Math.PI * 2;
      return {
        x: this.centerX + Math.cos(angle) * this.radius,
        y: this.centerY + Math.sin(angle) * this.radius,
      };
    });
  }

  update(delta: number) {
    this.totalTime += delta / this.ANIMATION_DURATION;
    // Use sine to create smooth oscillation between 0 and 1
    this.progress = (Math.sin(this.totalTime * Math.PI) + 1) / 2;

    this.points.forEach((point, i) => {
      const angle = (i / this.POINTS_NUMBER) * Math.PI * 2;

      // Slower, more fluid wave pattern with increased undulation
      const wavePhase = this.progress * Math.PI * 2 * this.WAVE_FREQUENCY;
      const secondaryPhase = wavePhase * 1.5; // Add variation to secondary wave

      const waveX =
        Math.sin(wavePhase + this.noiseOffset + i * 0.5) * this.WAVE_INTENSITY +
        Math.cos(secondaryPhase - i * 0.2) * (this.WAVE_INTENSITY * this.SECONDARY_WAVE_INTENSITY);
      const waveY =
        Math.cos(wavePhase + this.noiseOffset + i * 0.5) * this.WAVE_INTENSITY +
        Math.sin(secondaryPhase - i * 0.2) * (this.WAVE_INTENSITY * this.SECONDARY_WAVE_INTENSITY);

      point.x = this.centerX + Math.cos(angle) * (this.radius + waveX);
      point.y = this.centerY + Math.sin(angle) * (this.radius + waveY);
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw the main blob shape
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);

    // Create smooth curve through points
    for (let i = 0; i <= this.points.length; i++) {
      const point = this.points[i % this.points.length];
      const nextPoint = this.points[(i + 1) % this.points.length];

      const xc = (point.x + nextPoint.x) / 2;
      const yc = (point.y + nextPoint.y) / 2;

      ctx.quadraticCurveTo(point.x, point.y, xc, yc);
    }

    // Create a radial gradient for the transparent fill
    const fillGrad = ctx.createRadialGradient(
      this.centerX,
      this.centerY,
      0,
      this.centerX,
      this.centerY,
      this.radius * 1.2
    );
    fillGrad.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
    fillGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0.1)');
    fillGrad.addColorStop(1, 'rgba(255, 255, 255, 0.15)');

    // Fill with transparent gradient
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // Add white glow effect
    ctx.shadowColor = 'white';
    ctx.shadowBlur = 5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Reset shadow for next draw
    ctx.shadowBlur = 0;

    // Add reflection highlight
    ctx.beginPath();
    const highlightAngle = Math.PI * 0.7; // Position of the highlight
    const highlightX = this.centerX + Math.cos(highlightAngle) * (this.radius * 0.8);
    const highlightY = this.centerY + Math.sin(highlightAngle) * (this.radius * 0.8);
    
    const highlightGrad = ctx.createRadialGradient(
      highlightX,
      highlightY,
      0,
      highlightX,
      highlightY,
      this.radius * 0.5
    );
    highlightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    highlightGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    highlightGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = highlightGrad;
    ctx.arc(highlightX, highlightY, this.radius * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
} 
