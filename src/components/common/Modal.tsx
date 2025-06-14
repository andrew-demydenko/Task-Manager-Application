import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black opacity-50"
      ></div>
      <div className="w-[50%] max-w-3xl mx-auto my-6 z-10">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg">
          <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
            <h3 className="text-2xl font-semibold">{title}</h3>
            <button
              className="p-1 cursor-pointer ml-auto border-0 text-black text-3xl align-middle font-semibold"
              onClick={onClose}
            >
              <span className="flex items-center text-black h-6 w-6 text-2xl">
                ×
              </span>
            </button>
          </div>
          <div className="relative p-6 flex-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
