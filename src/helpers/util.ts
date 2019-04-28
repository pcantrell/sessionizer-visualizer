export default class Util {
  public static randomIntLessThan(max: number): number {
    return Math.floor(Math.random() * max);
  }

  public static randomInt(min: number, max: number): number {
    return this.randomIntLessThan(max - min) + min;
  }

  public static shuffle(array: any[]) {
    array.forEach((_, index0) => {
      const index1 = this.randomInt(index0, array.length);
      [array[index0], array[index1]] = [array[index1], array[index0]];
    });
    array.push(array.pop()); // force update
  }

  public static sample(array: any[]) {
    return array[this.randomIntLessThan(array.length)];
  }
}
