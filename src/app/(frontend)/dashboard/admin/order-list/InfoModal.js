"use client";
import React, { useRef } from "react";

const InfoModal = ({ value }) => {
  let ref = useRef();

  let text = [];
  let infoFunc = (info) => {
    for (let k in info) {
      text.push(
        <p key={Math.random()}>
          {k} : {info[k]?.toString()}
        </p>,
      );
      if (typeof info[k] === "object") {
        infoFunc(info[k]);
      }
    }
    return text;
  };
  return (
    <div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn btn-link text-blue-600 "
        onClick={() => ref.current.showModal()}
        // onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        {value?.title}
      </button>
      <dialog ref={ref} id="my_modal_1" className="modal">
        <div className="modal-box max-w-full w-100">
          <div className="">
            <h3 className="text-lg font-bold">Payment Info {value?.title} </h3>

            {infoFunc(value?.info)}
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
              {/* if there is a button in form, it will close the modal */}
              <button type="submit" className="btn btn-error">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default InfoModal;
