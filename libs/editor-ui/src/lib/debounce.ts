export function debounce<F extends (...args: unknown[]) => unknown>(
  duration: number,
  fn: F
) {
  let timeout: number | null;
  return function (this: unknown, ...args: Parameters<F>) {
    if (timeout) {
      window.clearTimeout(timeout);
    }
    timeout = window.setTimeout(() => {
      timeout = null;
      fn(args);
    }, duration);
  };
}
