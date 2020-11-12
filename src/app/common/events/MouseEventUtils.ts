export class MouseEventUtils {
  static isLeftMouse(event: MouseEvent) {
    return event.button === 0;
  }
}
