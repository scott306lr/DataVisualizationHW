// import { mean, sum, cross } from "d3";
import { AbaloneData } from "./dataHandler";

const corr = (x: number[], y: number[]) => {
    const n = x.length;
    if (y.length !== n)
      throw new Error("The two columns must have the same length.");

    if (n === 0)
      throw new Error("The length of the column must be greater than 0.");
  
    const xBar = x.reduce((a, b) => a + b) / n;
    const yBar = y.reduce((a, b) => a + b) / n;
  
    const cov = x.map((xi, i) => (xi - xBar) * (y[i] - yBar)).reduce((a, b) => a + b);
    const varX = x.map((xi) => (xi - xBar) ** 2).reduce((a, b) => a + b);
    const varY = y.map((yi) => (yi - yBar) ** 2).reduce((a, b) => a + b);
    return cov / Math.sqrt(varX * varY);
  }

 // ex. key = "Sex"  =>  ["M", "F", "I"]
export const correlations = (data: AbaloneData[], key: string, value: string) => {
  // other key
  const filtered_data = data.filter(d => d[key] === value).map(d => {
    const new_d = {...d};
    delete new_d[key];
    return new_d;
  });

  const keys = Object.keys(filtered_data[0]);
  const n = keys.length;
  const matrix = Array(n).fill(null).map(() => Array(n).fill(null)) as number[][];
  for (let i = 0; i < n; i++)
    for (let j = 0; j <= i; j++)
      matrix[i][j] = corr(filtered_data.map(d => d[keys[i]]) as number[], filtered_data.map(d => d[keys[j]]) as number[]);

  return [keys, matrix];
}

// const corr = (x: number[], y: number[]) => {
//   const n = x.length;
//   if (y.length !== n)
//     throw new Error("The two columns must have the same length.");
  
//   const x_ = mean(x);
//   const y_ = mean(y);
//   if (x_ === undefined || y_ === undefined)
//     throw new Error("The length of the column must be greater than 0.");

//   const XY = sum(x, (_, i) => (x[i] - x_) * (y[i] - y_));
//   const XX = sum(x, (d) => (d - x_) ** 2);
//   const YY = sum(y, (d) => (d - y_) ** 2);
//   return XY / Math.sqrt(XX * YY);
// }