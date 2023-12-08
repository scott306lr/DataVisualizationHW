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


export const parseDate = (str: string) => {
  const parts = str.split("/");

  if (parts.length === 0) {
    //year only
    return new Date(parseInt(parts[0], 10), 0, 1);
  }else {
    const dt = new Date(parseInt(parts[2], 10),
                    parseInt(parts[1], 10) - 1,
                    parseInt(parts[0], 10));
    return dt;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dataUniqueKeyValue = (data: any[], key: string | number) => {
  const values = data.map(d => d[key]).flat();
  return [...new Set(values)];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dataUniqueKeyValueCount = (data: any[], key: string | number) => {
  const frequencyMap = new Map();

  // Compute the frequency of each key
  data.forEach(item => {
    const itemValue = item[key];
    if (Array.isArray(itemValue)) {
      itemValue.forEach(value => {
        frequencyMap.set(value, (frequencyMap.get(value) || 0) + 1);
      });
    } else {
      frequencyMap.set(itemValue, (frequencyMap.get(itemValue) || 0) + 1);
    }
  });

  // Convert the frequency map to the desired format
  return Array.from(frequencyMap, ([key, value]) => ({ key, value }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dataKeyAverage = (data: any[], key: string) => {
  const values = data.map(d => d[key]) as number[];
  return values.reduce((a, b) => a + b) / values.length;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dataKeyMeanStd = (data: any[], key: string) => {
  const mean = dataKeyAverage(data, key);
  const std = Math.sqrt(data.map(d => (d[key] - mean) ** 2).reduce((a, b) => a + b) / data.length);
  return [mean, std];
}

const pad = (num: number, size: number) => {
  const s = "000000000" + num;
  return s.slice(-size);
}
export const formatTime = (sec: number) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec - h * 3600) / 60);
  const s = Math.floor(sec - h * 3600 - m * 60);

  return h > 0
    ? `${h}:${pad(m, 2)}:${pad(s, 2)}`
    : `${pad(m, 2)}:${pad(s, 2)}`;
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}