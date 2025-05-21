import React from "react";
type ModalProps = {
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = (props) => {
  return (
    <div className="fixed top-0 left-0 z-100 bg-white/10 backdrop-blur-lg h-screen w-screen flex items-center justify-center">
        {props.children}
    </div>
  );
};

export default Modal;