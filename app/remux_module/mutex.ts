export class Mutex {
  private locked = false;
  private waitingResolvers: (() => void)[] = [];

  async acquire(): Promise<void> {
    if (!this.locked) {
      this.locked = true;
      return;
    }

    return new Promise<void>((resolve) => {
      this.waitingResolvers.push(resolve);
    });
  }

  release(): void {
    if (this.waitingResolvers.length > 0) {
      const resolve = this.waitingResolvers.shift()!;
      resolve();
    } else {
      this.locked = false;
    }
  }
}

// Create a map of locks for each epic
const epicLocks = new Map<string, Mutex>();

export const getEpicLock = (epicKey: string): Mutex => {
  if (!epicLocks.has(epicKey)) {
    epicLocks.set(epicKey, new Mutex());
  }
  return epicLocks.get(epicKey)!;
};