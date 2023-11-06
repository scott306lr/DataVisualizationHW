import { Button, Flowbite, Modal } from "flowbite-react";
import { customModalTheme } from "../utils/theme";

interface IProps {
  title: string | undefined;
  openModal: string | undefined;
  setOpenModal: React.Dispatch<React.SetStateAction<string | undefined>>;
  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | undefined;
  children: React.ReactNode;
}

export const MyModal: React.FC<IProps> = ({
  title,
  openModal,
  setOpenModal,
  size = "lg",
  children,
}) => {
  return (
    <>
      <Flowbite theme={{ theme: customModalTheme }}>
        <Modal
          dismissible
          show={openModal === "dismissible"}
          onClose={() => setOpenModal(undefined)}
          size={size}
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
