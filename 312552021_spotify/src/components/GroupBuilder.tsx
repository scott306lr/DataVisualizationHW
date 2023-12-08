import type { Dispatch, SetStateAction } from "react";
import React from "react";
import { Collection, SpotifyData } from "../utils/dataHandler";
import MyCombobox from "./MyCombobox";
import { useState } from "react";
import MyModal from "./MyModal";
import { Button, TextInput, Tooltip } from "flowbite-react";
import { PiMusicNotesPlusFill } from "react-icons/pi";

interface IProps {
  data: SpotifyData[];
  groups: Collection[];
  setGroups: Dispatch<SetStateAction<Collection[]>>;
}

const GroupBuilder: React.FC<IProps> = ({ data, groups, setGroups }) => {
  const [allSelected, setAllSelected] = useState<SpotifyData[]>([]);
  const [name, setName] = useState<string>("");
  const [openModal, setOpenModal] = useState<string | undefined>(undefined);

  return (
    <>
      <li
        className="flex h-[4rem] w-[10rem] items-center justify-center rounded-t-2xl border-4 border-b-0 border-[#6096ba] bg-[#6096ba] px-1 pt-1 text-[#e7ecef] shadow-md  shadow-gray-700 hover:cursor-pointer hover:border-transparent hover:bg-[#e7ecef] hover:text-[#274c77]"
        onClick={() => setOpenModal("dismissible")}
      >
        <Tooltip content={"Create a group"}>
          <PiMusicNotesPlusFill className="h-8 w-8" />
        </Tooltip>
      </li>
      <MyModal
        title={"Create a Group"}
        openModal={openModal}
        setOpenModal={setOpenModal}
        size={"2xl"}
      >
        <form
          className="flex h-full w-full flex-col items-center justify-center gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex h-[26rem] w-min flex-col items-center gap-2 rounded-xl border-2 border-[#274c77] bg-white p-2">
            <div className="h-32 w-[30rem]">
              <MyCombobox data={data} setAllSelected={setAllSelected} />
            </div>

            <div className="mt-auto flex h-min w-full flex-col justify-center px-12">
              <div className="flex h-min w-full flex-col justify-center">
                <label
                  htmlFor="text"
                  className="block text-lg font-medium text-[#274c77]"
                >
                  Group Name:
                </label>
                <div className="flex h-min w-full items-center justify-center">
                  <TextInput
                    id="text"
                    type="text"
                    required
                    shadow
                    className="w-full border-gray-500"
                    placeholder="New group name..."
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                  <Button
                    type="submit"
                    className="ml-2 h-min whitespace-nowrap bg-[#6096ba] text-xl"
                    onClick={() => {
                      if (allSelected.length === 0) return;
                      if (name === "") return;
                      if (groups.find((group) => group.name === name)) {
                        alert("Name already exists!");
                        return;
                      }

                      setGroups((prev) => [
                        ...prev,
                        {
                          id: name,
                          name: name,
                          data: allSelected,
                        },
                      ]);
                      setName("");
                      setAllSelected([]);
                      setOpenModal(undefined);
                    }}
                  >
                    Create
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex w-full items-center justify-center">
              <span className="text-center text-[#274c77]">
                Total tracks: {allSelected.length}
              </span>
            </div>
          </div>
        </form>
      </MyModal>
    </>
  );
};

export default GroupBuilder;
