// Tiny signal so sections can wait for the preloader before animating in.

let done = false;
const listeners = new Set<() => void>();

export const onIntroDone = (fn: () => void) => {
  if (done) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

export const markIntroDone = () => {
  if (done) return;
  done = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
};
