import { Button, Flowbite, Modal } from "flowbite-react";
import { useState } from "react";
import { customModalTheme } from "../utils/theme";

interface IProps {
  title: string | undefined;
  children: React.ReactNode;
}

export const MyModal: React.FC<IProps> = ({ title, children }) => {
  const [openModal, setOpenModal] = useState<string | undefined>(undefined);

  return (
    <>
      <button
        // small circle to toggle modal
        className="h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-200 text-center text-sm font-black text-gray-600 shadow-md hover:border-gray-400 hover:bg-gray-400 hover:text-gray-800 focus:outline-none"
        onClick={() => setOpenModal("dismissible")}
      >
        ?
      </button>
      <Flowbite theme={{ theme: customModalTheme }}>
        <Modal
          dismissible
          show={openModal === "dismissible"}
          onClose={() => setOpenModal(undefined)}
        >
          <Modal.Header> {title}</Modal.Header>
          <Modal.Body>{children}</Modal.Body>
          <Modal.Footer>
            <Button color="gray" onClick={() => setOpenModal(undefined)}>
              關閉
            </Button>
          </Modal.Footer>
        </Modal>
      </Flowbite>
    </>
  );
};

export default MyModal;
