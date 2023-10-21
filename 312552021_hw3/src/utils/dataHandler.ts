import Papa from "papaparse";
import { correlations } from "./utils";

export type Collection = {
  id: number;
  name: string;
  data: SpotifyData[];
  color: [number, number, number];
};

// typescript type for Spotify Music Data
export type SpotifyData = {
  id: string;
  track_id: string;
  artists: string; //string[];
  album_name: string;
  track_name: string;
  popularity: number;
  duration_s: number;
  explicit: boolean;
  danceability: number;
  energy: number;
  key: string;
  loudness: number;
  mode: string;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  time_signature: number;
  track_genre: string;
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


export const getSpotifyDataFn = async (url: string) => {
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
            artists: row.artists as string,
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
      .then((data) => { // additional processing
        //key_mode
        const key_mode = data.map((d) => d.key + " " + d.mode);
        return data.map((d, i) => {
          return {
            ...d,
            key_mode: key_mode[i],
          };
        });
      })
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

