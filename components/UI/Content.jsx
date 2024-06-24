import React from "react";

export default function Content({ inscriptionId, contentType, content }) {
  const empyImage = (e) => {
    e.target.src = "/empty.png";
  };

  return (
    <>
      {contentType.indexOf("image") > -1 && (
        <>
          <img
            key={inscriptionId}
            src={`https://ordinalslite.com/content/${inscriptionId}`}
            className="w-full h-full object-cover"
            alt=""
            onError={(e) => empyImage(e)}
          />
        </>
      )}

      {contentType.indexOf("text") > -1 && (
        <>
          {content && (
            <>
              {content.indexOf("tick") > -1 ? (
                <div className="font-bold px-3" key={inscriptionId + "content"}>
                  <p>{JSON.parse(content).tick}</p>
                  <p>{JSON.parse(content).amt}</p>
                </div>
              ) : (
                <div className="font-bold px-3" key={inscriptionId + "content"}>
                  {content}
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
