export class AnimationSubscriber {
  id: string;
  isRunning: boolean;
  isResetting: boolean;
  isStarted: boolean;
  draw: () => void;
  update: (delta: number) => void;
  reset: (delta: number) => void;

  constructor({
    id,
    draw,
    update,
    reset = () => {},
    isRunning = false,
  }: {
    id: string;
    draw: () => void;
    update: (delta: number) => void;
    reset?: (delta: number) => void;
    isRunning?: boolean;
  }) {
    this.id = id;
    this.isRunning = isRunning;
    this.isResetting = false;
    this.isStarted = false;
    this.draw = draw;
    this.update = update;
    this.reset = reset;
  }
}
