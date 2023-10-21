import { useState } from "react";
import MyModal from "./MyModal";

interface IProps {
  title: string | undefined;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | undefined;
}

export const MyInformModal: React.FC<IProps> = ({
  title,
  size = "2xl",
  children,
}) => {
  const [openModal, setOpenModal] = useState<string | undefined>(undefined);

  return (
    <>
      <button
        // small circle to toggle modal
        className="mx-2 h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-200 text-center text-sm font-black text-gray-600 shadow-md hover:border-gray-400 hover:bg-gray-400 hover:text-gray-800 focus:outline-none"
        onClick={() => setOpenModal("dismissible")}
      >
        ?
      </button>
      <MyModal
        title={title}
        openModal={openModal}
        setOpenModal={setOpenModal}
        size={size}
      >
        {children}
      </MyModal>
    </>
  );
};

export default MyInformModal;
