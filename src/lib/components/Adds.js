"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const Adds = () => {
  const [adds, setadds] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10);

  let addscl = () => {
    let timer = setTimeout(() => {
      setadds(false);
    }, 10000);
    return () => clearTimeout(timer);
  };

  let autocount = () => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  };

  useEffect(() => {
    autocount();
    addscl();
  }, []);

  return (
    <div
      className={
        adds
          ? "absolute top-12 left-0 right-0 z-30 w-5/6 mx-auto border"
          : "hidden"
      }
    >
      <h2 className=" text-center">
        Adds will disappear in {timeLeft} seconds
      </h2>
      <Image
        src="/adds.jpeg"
        loading="eager"
        // fill
        // priority={true}
        height={1500}
        width={1400}
        className=" w-full h-full object-cover"
        alt="Picture of the author"
      />
      <button
        onClick={() => setadds(false)}
        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-2xl"
      >
        ✕
      </button>
    </div>
  );
};

export default Adds;
