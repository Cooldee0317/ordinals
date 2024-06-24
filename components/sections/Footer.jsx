import React from "react";
import {
  FaDiscord,
  FaMedium,
  FaTelegram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <div className="mt-8 container absolute bottom-3 left-0 w-full">
      <div className="flex justify-center items-center gap-3 ">
        <button className="rounded-full h-[40px] w-[40px] text-xl bg-[#216da5] shadow shadow-black flex justify-center items-center">
          <FaDiscord />
        </button>
        <button className="rounded-full h-[40px] w-[40px] text-xl bg-[#216da5] shadow shadow-black flex justify-center items-center">
          <FaTwitter />
        </button>
        <button className="rounded-full h-[40px] w-[40px] text-xl bg-[#216da5] shadow shadow-black flex justify-center items-center">
          <FaTelegram />
        </button>
        <button className="rounded-full h-[40px] w-[40px] text-xl bg-[#216da5] shadow shadow-black flex justify-center items-center">
          <FaYoutube />
        </button>
        <button className="rounded-full h-[40px] w-[40px] text-xl bg-[#216da5] shadow shadow-black flex justify-center items-center">
          <FaMedium />
        </button>
      </div>
      {/* <div className="w-full flex justify-end mt-1">
        <a href="https://t.me/genius021120" target="_blank">
          🍊Contact Dev
        </a>
      </div> */}
    </div>
  );
}
