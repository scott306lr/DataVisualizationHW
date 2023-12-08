import Papa from "papaparse";
import { correlations } from "./utils";

export type Collection = {
  id: string;
  name: string;
  data: SpotifyData[];
};

// typescript type for Spotify Music Data
export type SpotifyData = {
  id: string;
  track_id: string;
  track_name: string;
  duration_s: number;
  artists: string[];
  album_name: string;
  track_genre: string;
  popularity: number;
  key: string;
  mode: string;
  key_mode: string;
  time_signature: number;
  tempo: number;
  explicit: boolean;
  danceability: number;
  energy: number;
  loudness: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  [key: string]: boolean | number | string | string[] | undefined;
};

export type AbaloneData = {
  "Sex": string;
  "Length": number;
  "Diameter": number;
  "Height": number;
  "Whole weight": number;
  "Shucked weight": number;
  "Viscera weight": number;
  "Shell weight": number;
  "Rings": number;
  [key: string]: number | string;
}

export type UniversityRankingData = {
  "FullName": string;
  "Name": string;
  "Teaching": number;
  "Research": number;
  "Citations": number;
  "Industry Income": number;
  "International": number;
  [key: string]: number | string;
}

export type HousePropertySalesData = {
  "Sale Date": string;
  "MA": number;
  "Type": string;
  "Bedroom": number;
  [key: string]: number | string | Date;
}

export type SeoulAirPollutionData = {
  "Date": Date;
  "Code": number;
  "SO2": number;
  "CO": number;
  "O3": number;
  "NO2": number;
  "PM10": number;
  "PM25": number;
  [key: string]: number | string | Date;
}


export type CarEvalaluationData = {
  "buying": string;
  "maint": string;
  "doors": string;
  "persons": string;
  "lug_boot": string;
  "safety": string;
  "class": string;
  [key: string]: string;
}

export const SeoulAirPollutionFetcher = async (url: string) => {
  const response = await fetch(url)
    .then((response) => response.text())
    .then((text) =>
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        delimiter: ",",
      }),
    )
    .then((results) => results.data)
    .then((data) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const temp = data.map((row: any) => {
        return {
          "Date": row["Measurement date"].split(" ")[0], // "Measurement date" -> "Date"
          "Code": +row["Station code"], // "Station code" -> "Code"
          "SO2": +row.SO2,
          "NO2": +row.NO2,
          "O3": +row.O3,
          "CO": +row.CO,
          "PM10": +row.PM10,
          "PM25": +row["PM2.5"],
        }
      }).filter((row: SeoulAirPollutionData) => {
        //filter out invalid data, which has negative value
        return row.SO2 >= 0 && row.NO2 >= 0 && row.O3 >= 0 && row.CO >= 0 && row.PM10 >= 0 && row.PM25 >= 0;
      });
      // console.log(temp);
      //aggregate by day and station  (original data is hourly)
      // append the data by day and station, and calculate the average
      type AggregatedData = {
        Date: Date;
        Code: number;
        arrSO2: number[];
        arrNO2: number[];
        arrO3: number[];
        arrCO: number[];
        arrPM10: number[];
        arrPM25: number[];
      };

      const aggregate = temp.reduce((acc: { [key: string]: AggregatedData }, cur: SeoulAirPollutionData) => {
        const key = cur.Date + "_" + cur.Code;
        if (key in acc) {
          acc[key].arrSO2.push(cur.SO2);
          acc[key].arrNO2.push(cur.NO2);
          acc[key].arrO3.push(cur.O3);
          acc[key].arrCO.push(cur.CO);
          acc[key].arrPM10.push(cur.PM10);
          acc[key].arrPM25.push(cur.PM25);
        } else {
          acc[key] = {
            Date: new Date(cur.Date),
            Code: cur.Code,
            arrSO2: [cur.SO2],
            arrNO2: [cur.NO2],
            arrO3: [cur.O3],
            arrCO: [cur.CO],
            arrPM10: [cur.PM10],
            arrPM25: [cur.PM25],
          };
        }
        return acc;
      }, {});

      const keys = Object.keys(aggregate);
      const aggregated = keys.map((key) => {
        const d = aggregate[key as keyof typeof aggregate];
        return {
          Date: d.Date,
          Code: d.Code,
          SO2: d.arrSO2.reduce((acc, cur) => acc + cur, 0) / d.arrSO2.length,
          NO2: d.arrNO2.reduce((acc, cur) => acc + cur, 0) / d.arrNO2.length,
          O3: d.arrO3.reduce((acc, cur) => acc + cur, 0) / d.arrO3.length,
          CO: d.arrCO.reduce((acc, cur) => acc + cur, 0) / d.arrCO.length,
          PM10: d.arrPM10.reduce((acc, cur) => acc + cur, 0) / d.arrPM10.length,
          PM25: d.arrPM25.reduce((acc, cur) => acc + cur, 0) / d.arrPM25.length,
        };
      });
      return aggregated as SeoulAirPollutionData[];
    })
    .catch((error) => {
      // console.log(error);
      return error
    });
  return response;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const FakeDataFetcher = async (url: string) => {
  //return fake json data, instead of fetching from url

  const fakeData = [
    {
      name: "Sam",
      age: 30,
      height: 180,
    },
    {
      name: "Tom",
      age: 20,
      height: 170,
    },
    {
      name: "John",
      age: 25,
      height: 175,
    },
  ];

  return fakeData;
}

export const CarEvaluationFetcher = async (url: string) => {
  const response = await fetch(url)
    .then((response) => response.text())
    .then((text) =>
      Papa.parse(text, {
        header: false,
        skipEmptyLines: true,
        delimiter: ",",
      }),
    )
    .then((results) => Papa.unparse({
        fields: ["buying", "maint", "doors", "persons", "lug_boot", "safety", "class"],
        data: results.data
    }))
    .then((data) => 
      Papa.parse(data, {
        header: true,
      }) 
    )
    .then((results) => results.data)
    .then((data) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.map((row: any) => {
        return {
          "buying": `buying-${row.buying}`,
          "maint": `maint-${row.maint}`,
          "doors": `doors-${row.doors}`,
          "persons": `persons-${row.persons}`,
          "lug_boot": `lug_boot-${row.lug_boot}`,
          "safety": `safety-${row.safety}`,
          "class": row.class,
        }
      }
    ))
    .catch((error) => {
      // console.log(error);
      return error
    });
  return response;
}

export const SpotifyDataFetcher = async (url: string) => {
  const response = await fetch(url)
      .then((response) => response.text())
      .then((text) =>
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          delimiter: ",",
        }),
      )
      .then((results) => results.data)
      .then((data) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.map((row: any) => {
          return {
            id: row[""] as string,
            track_id: row.track_id as string,
            artists: row.artists.split(";") as string[],
            album_name: row.album_name as string,
            track_name: row.track_name as string,
            track_genre: row.track_genre as string,
            popularity: +row.popularity,
            duration_s: +row.duration_ms / 1000,
            explicit: row.explicit as boolean,
            key: [
              "C",
              "C♯/D♭",
              "D",
              "D♯/E♭",
              "E",
              "F",
              "F♯/G♭",
              "G",
              "G♯/A♭",
              "A",
              "A♯/B♭",
              "B",
            ][+row.key] as string,
            mode: ["minor", "major"][+row.mode] as string,
            tempo: +row.tempo,
            time_signature: +row.time_signature,
            danceability: +row.danceability,
            energy: +row.energy,
            loudness: +row.loudness,
            speechiness: +row.speechiness,
            acousticness: +row.acousticness,
            instrumentalness: +row.instrumentalness,
            liveness: +row.liveness,
            valence: +row.valence,
          };
        }) as SpotifyData[],
      )
      .then((data) => { // merge key and mode to one column
        const key_mode = data.map((d) => d.key + "_" + d.mode);
        return data.map((d, i) => {
          return {
            ...d,
            key_mode: key_mode[i],
          };
        });
      })
      .then((data) => data.filter((row) => row.track_id && row.track_name ))
      // .then((data) => { // remove identical data, with same
      //   const unique = new Set(data.map((d) => d.track_id));
      //   return data.filter((d) => unique.has(d.track_id));
      // })
      .catch((error) => {
        // console.log(error);
        return error
      }
    );

    return response;
};

export const AbaloneDataFetcher = async (url: string) => {
  const response = await fetch(url)
      .then((response) => response.text())
      .then((text) =>
        Papa.parse(text, {
          header: false,
          skipEmptyLines: true,
          delimiter: ",",
        }),
      )
      .then((results) => Papa.unparse({
          fields: ["sex", "length", "diameter", "height", "whole_weight", "shucked_weight", "viscera_weight", "shell_weight", "rings"],
          data: results.data
      }))
      .then((data) => 
        Papa.parse(data, {
          header: true,
        }) 
      )
      .then((results) => results.data)
      .then((data) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.map((row: any) => {
          return {
            //give type
            "Sex": row.sex as string,
            "Length": +row.length as number,
            "Diameter": +row.diameter as number,
            "Height": +row.height as number,
            "Whole Weight": +row.whole_weight as number,
            "Shucked Weight": +row.shucked_weight as number,
            "Viscera Weight": +row.viscera_weight as number,
            "Shell Weight": +row.shell_weight as number,
            "Rings": +row.rings as number,
          }
        }
      ))
      .catch((error) => {
        // console.log(error);
        return error
      });
    // console.log("fetched!");
    // console.log(response.slice(0, 10));
    //if error
    
  return response;
}

export const getAbaloneCorrelationData = (raw_data: AbaloneData[], key: string, value: string) => {
  const [keys, matrix] = correlations(raw_data, key, value);

  const data = keys.map((_k, i) => {
    return {
      id: keys[i],
      data: keys.map((k, j) => {
        return {
          x: k,
          y: matrix[i][j],
        }
      })
    }
  });

  return data;
}

export const UniversityRankingFetcher = async (url: string) => {
  const response = await fetch(url)
    .then((response) => response.text())
    .then((text) =>
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        delimiter: ",",
      }),
    )
    .then((results) => results.data)
    .then((data) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.filter((row: any) => row.scores_citations !== "n/a")
    )
    .then((data) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.map((row: any) => {
        return {
          "FullName": row.name as string,
          "Name": wrapLongText(row.name as string, 36),
          "Teaching": +row.scores_teaching,
          "Research": +row.scores_research,
          "Citations": +row.scores_citations,
          "Industry Income": +row.scores_industry_income,
          "International": +row.scores_international_outlook
        }
      }
    ))
    .catch((error) => {
      // console.log(error);
      return error
    });
  return response;
}

const wrapLongText = (text: string, max: number) => {
  if (text.length > max) {
    return text.slice(0, max) + "...";
  }
  return text;
}

export const HousePropertySalesFetcher = async (url: string) => {
  const response = await fetch(url)
    .then((response) => response.text())
    .then((text) =>
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        delimiter: ",",
      }),
    )
    .then((results) => results.data)
    .then((data) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.filter((row: any) => row.scores_citations !== "n/a")
    )
    // .then((data) => {
    //   console.log("raw data");
    //   console.log(data);
    //   return data;
    // })
    .then((data) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.map((row: any) => {
        return {
          "Sale Date": row.saledate as string,
          "MA": +row.MA,
          "Type": row.type as string,
          "Bedrooms": +row.bedrooms,
        }
      })
    )
    .catch((error) => {
      // console.log(error);
      return error
    });
  return response;
}
