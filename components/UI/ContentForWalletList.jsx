import React from "react";

export default function ContentForWalletList({ content }) {
  const empyImage = (e) => {
    e.target.src = "/empty.png";
  };

  if (content.length == 66) {
    return (
      <>
        <img
          key={content}
          src={`https://ordinalslite.com/content/${content}`}
          className="w-[25px] h-[25px] object-cover"
          alt=""
          onError={(e) => empyImage(e)}
        />
      </>
    );
  }

  if (content.indexOf("tick") > -1) {
    return (
      <div className="font-bold text-sm" key={content + "content"}>
        <p>{JSON.parse(content).amt}</p>
      </div>
    );
  }

  return (
    <>
      <div className="font-bold text-sm" key={content + "content"}>
        {content}
      </div>
    </>
  );
}
