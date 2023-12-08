import type { Dispatch, SetStateAction } from "react";
import { Fragment, useState, useRef, useMemo, useEffect } from "react";
import { Combobox, Listbox, Transition } from "@headlessui/react";
import { HiCheck, HiChevronUpDown } from "react-icons/hi2";
import { HiOutlineSearch } from "react-icons/hi";

import fuzzysort from "fuzzysort";
import { useVirtualizer } from "@tanstack/react-virtual";
import { SpotifyData } from "../utils/dataHandler";
import { dataUniqueKeyValueCount } from "../utils/utils";

export type ComboBoxData = {
  id: string;
  name: string;
  text: string;
};

type ComboBoxArrDict = {
  artists: ComboBoxData[];
  album_name: ComboBoxData[];
  track_genre: ComboBoxData[];

  [key: string]: ComboBoxData[];
};

interface IProps {
  data: SpotifyData[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setAllSelected: Dispatch<SetStateAction<SpotifyData[]>>;
}

const MyCombobox: React.FC<IProps> = ({ data, setAllSelected }) => {
  const [arrDict, setArrDict] = useState<ComboBoxArrDict>({
    artists: [],
    album_name: [],
    track_genre: [],
  });
  const [filterkey, setFilterkey] = useState("artists");
  const [query, _setQuery] = useState("");
  const [fuzzyData, setFuzzyData] = useState<ComboBoxData[]>([]);
  const parentRef = useRef(null);
  const rowVirtualizer = useVirtualizer({
    count: fuzzyData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 32,
  });

  useEffect(() => {
    rowVirtualizer.measure();
  }, [fuzzyData, rowVirtualizer]);

  const setQuery = (query: string) => {
    // if (query === "") {
    //   setFuzzyData([]);
    //   return;
    // }
    _setQuery(query);
    const fuzzyData = fuzzysort
      .go(query, getData(filterkey), {
        threshold: -10,
        // limit: 10,
        all: true,
        key: "name",
      })
      .map((d) => d.obj);
    setFuzzyData(fuzzyData);
  };

  const selected = arrDict[filterkey];
  const setSelected = (arr: ComboBoxData[]) => {
    const newArrDict = { ...arrDict, [filterkey]: arr };
    const artists = newArrDict["artists"].map((d) => d.name);
    const albums = newArrDict["album_name"].map((d) => d.name);
    const genres = newArrDict["track_genre"].map((d) => d.name);

    const filteredData = data.filter((track) => {
      const isArtistMatch = track.artists.some((artist) =>
        artists.includes(artist),
      );
      const isAlbumMatch = albums.includes(track.album_name);
      const isGenreMatch = genres.includes(track.track_genre);
      // Return true if any of the conditions match
      return isArtistMatch || isAlbumMatch || isGenreMatch;
    });

    // get unique data
    const uniqueDataMap = new Map<string, SpotifyData>();
    const uniqueData = new Array<SpotifyData>();
    filteredData.forEach((d) => {
      if (!uniqueDataMap.has(d.track_id)) {
        uniqueDataMap.set(d.track_id, d);
        uniqueData.push(d);
      }
    });

    setArrDict((prev) => ({ ...prev, [filterkey]: arr }));
    setAllSelected(uniqueData);
  };

  const artists = useMemo(() => {
    const artists_cnt = dataUniqueKeyValueCount(data, "artists");
    return artists_cnt.map((d) => ({
      id: d.key,
      name: d.key,
      text: `${d.value} tracks`,
    }));
  }, [data]);

  const albums = useMemo(() => {
    const albums_cnt = dataUniqueKeyValueCount(data, "album_name");
    return albums_cnt.map((d) => ({
      id: d.key,
      name: d.key,
      text: `${d.value} tracks`,
    }));
  }, [data]);
  const genres = useMemo(() => {
    const genres_cnt = dataUniqueKeyValueCount(data, "track_genre");
    return genres_cnt.map((d) => ({
      id: d.key,
      name: d.key,
      text: `${d.value} tracks`,
    }));
  }, [data]);

  const getData = (key: string) => {
    switch (key) {
      case "artists":
        return artists;
      case "album_name":
        return albums;
      case "track_genre":
        return genres;
      default:
        return [];
    }
  };

  // console.log("rendering MyCombobox");
  console.log("AAA:");
  console.log(query);
  console.log(fuzzyData);
  console.log(rowVirtualizer.getVirtualItems());

  return (
    <div className="flex h-min w-full flex-col items-center justify-center gap-4 rounded-3xl p-4 align-middle">
      <div className="flex h-full items-center justify-center gap-2 align-middle">
        <p className="text-2xl font-bold text-[#274c77]">
          Add tracks to group by{" "}
        </p>{" "}
        <MyListbox selected={filterkey} setSelected={setFilterkey} />
      </div>
      <Combobox value={selected} by="id" onChange={setSelected} multiple>
        <div className="relative z-10 flex w-full flex-col gap-2">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left text-xl shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300">
            <Combobox.Input
              className="h-[3rem] w-full border-none px-10 py-2 text-xl leading-5 text-[#274c77] focus:ring-0"
              placeholder="Search by artist, album, or genre"
              onChange={(event) => setQuery(event.target.value)}
              value={query}
              displayValue={() => query}
            />
            <Combobox.Button
              className="absolute inset-y-0 right-2 flex items-center pr-2"
              onClick={() => setQuery(query)}
            >
              <HiOutlineSearch
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => {}}
          >
            <Combobox.Options
              className="max-h-60 w-full overflow-auto rounded-md bg-white px-2 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              ref={parentRef}
            >
              {fuzzyData.length === 0 && query !== "" ? (
                <div
                  style={{
                    width: "100%",
                    height: `${48}px`,
                  }}
                  className="relative flex cursor-default select-none items-center px-8 py-2 text-[#274c77]"
                >
                  Nothing found.
                </div>
              ) : (
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                    backgroundColor: "white",
                    zIndex: 1,
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const data = fuzzyData[virtualRow.index];
                    return (
                      <Combobox.Option
                        key={virtualRow.index}
                        // data-index={virtualRow.index}
                        // ref={rowVirtualizer.measureElement}
                        className={({ active }) =>
                          `relative flex h-full w-full select-none rounded-lg pl-8 pr-4 shadow-md hover:cursor-pointer ${
                            active ? "bg-[#6096ba] text-white" : "text-gray-900"
                          }`
                        }
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                        value={data}
                      >
                        {({ selected, active }) => (
                          <div className="flex w-full items-center justify-between space-x-3">
                            <span
                              className={`block truncate text-xl ${
                                selected ? "font-bold" : "font-semibold"
                              }`}
                            >
                              {data.name.length > 25
                                ? data.name.slice(0, 25) + "..."
                                : data.name}
                            </span>
                            <span className="ml-auto block truncate text-base font-light ">
                              {data.text}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 -left-2 flex items-center pl-3 ${
                                  active ? "text-white" : "text-teal-600"
                                }`}
                              >
                                <HiCheck
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </div>
                        )}
                      </Combobox.Option>
                    );
                  })}
                </div>
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

interface IProps2 {
  selected: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSelected: Dispatch<SetStateAction<string>>;
}

type KeyMap = {
  [key: string]: string;
};

const MyListbox: React.FC<IProps2> = ({ selected, setSelected }) => {
  const keys = ["artists", "album_name", "track_genre"];
  //[key: string]: string
  const key_map = {
    artists: "Artist",
    album_name: "Album",
    track_genre: "Genre",
  } as KeyMap;

  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative z-20 h-[2rem] w-[6rem] align-middle shadow-md">
        <Listbox.Button className="relative h-full w-full cursor-default rounded-lg bg-white pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate align-middle">
            {key_map[selected]}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <HiChevronUpDown
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {keys.map((key, i) => (
              <Listbox.Option
                key={i}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-4 pr-4 ${
                    active ? "bg-[#6096ba] text-[#e7ecef]" : "text-[#274c77]"
                  }`
                }
                value={key}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {key_map[key]}
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default MyCombobox;
