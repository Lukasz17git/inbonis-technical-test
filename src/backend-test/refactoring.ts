const addOne = (x: number) => x + 1;
const addTwo = (x: number) => x + 2;
const multiplyByTwo = (x: number) => x * 2;
const divideByTwo = (x: number) => x / 2;

const createPipe = (value: number) => ({
   addOne: () => createPipe(value + 1),
   addTwo: () => createPipe(value + 2),
   multiplyByTwo: () => createPipe(value * 2),
   divideByTwo: () => createPipe(value / 2),
   calculate: () => value < 10 ? null : value
})

const result = createPipe(2)
   .addOne()
   .addTwo()
   .multiplyByTwo()
   .divideByTwo()
   .addTwo()
   .multiplyByTwo()
   .calculate();

console.log(result); // 14

