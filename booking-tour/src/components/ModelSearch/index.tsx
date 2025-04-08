import React, { useState } from "react";
import { Modal } from "antd";
import { FaSearch } from "react-icons/fa";
const ModalSearch: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  return (
    <>
      {/* Nút mở modal */}
      <FaSearch
        className="cursor-pointer  text-xl"
        onClick={showModal}
      />

      {/* Modal với hiệu ứng mờ nền */}
      <Modal
        title="Tìm kiếm"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width="50vw"
        bodyStyle={{ padding: "20px" }}
      >
        <div className="flex relative w-full items-center border border-gray-300 rounded-lg px-3 py-2">
          <input
            type="text"
            placeholder="Tìm kiếm...."
            className="w-full border-none outline-none text-lg px-3"
          />
          <FaSearch className="text-gray-500 cursor-pointer text-xl" />
        </div>
      </Modal>
    </>
  );
};

export default ModalSearch;
