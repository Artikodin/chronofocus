export class AnimationSubscriber {
  id: string;
  isRunning: boolean;
  isResetting: boolean;
  isStarted: boolean;
  draw: () => void;
  update: (delta: number) => void;
  reset: (delta: number) => void;

  constructor(
    id: string,
    draw: () => void,
    update: (delta: number) => void,
    reset: (delta: number) => void
  ) {
    this.id = id;
    this.isRunning = false;
    this.isResetting = false;
    this.isStarted = false;
    this.draw = draw;
    this.update = update;
    this.reset = reset;
  }
}
