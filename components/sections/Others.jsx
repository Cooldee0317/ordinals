import React, { useState } from "react";
import InscriptionCardSkelenton from "../UI/InscriptionCardSkelenton";
import InscriptionCard from "../UI/InscriptionCard";
import ReactPaginate from "react-paginate";
import useActivities from "../../hooks/useActivities";
import { useEffect } from "react";

export default function Others({
  inscriptionsFromDB,
  loading,
  bulkSelect,
  setSelectedBlocks,
  selectedBlocks,
  lastBlock,
  listedItermsOnPage,
}) {
  const [offset, setOffset] = useState(0);
  const [listedIterms, setListedIterms] = useState();
  const { getListedIterms } = useActivities("others");
  
  const fetchListedIterms = async () => {
    const res = await getListedIterms();
    setListedIterms(res);
  };

  const handlePageClick = (e) => {
    setOffset(e.selected);
  };

  useEffect(() => {
    fetchListedIterms();
  }, []);
 
  return (
    <div className={`w-full ${!inscriptionsFromDB && "my-auto"}`}>
      <div className="my-2">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 mt-8 w-full">
            {Array.from({ length: 12 }, (_, key) => {
              return <InscriptionCardSkelenton key={key} />;
            })}
          </div>
        ) : (
          <>
            {inscriptionsFromDB ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 mt-8 w-full">
                  {inscriptionsFromDB &&
                    inscriptionsFromDB
                      .slice(offset * 42, offset * 42 + 42)
                      .map((inscription, key) => {
                        return (
                          <InscriptionCard
                            inscription={inscription}
                            key={inscription?.inscriptionId + "others"}
                            inscriptionIndex={key + offset * 42}
                            bulkSelect={bulkSelect}
                            tag="others"
                            setSelectedBlocks={setSelectedBlocks}
                            selectedBlocks={selectedBlocks}
                            isNFT={false}
                            lastBlock={lastBlock}
                            listedIterms={listedIterms}
                            fetchListedIterms={fetchListedIterms}
                            listedItermsOnPage={listedItermsOnPage}
                          />
                        );
                      })}
                </div>
                <ReactPaginate
                  breakLabel="..."
                  nextLabel=">"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={2}
                  marginPagesDisplayed={1}
                  pageCount={Math.ceil(
                    Object.keys(inscriptionsFromDB).length / 42
                  )}
                  previousLabel="<"
                  renderOnZeroPageCount={null}
                  className="pagination"
                />
              </>
            ) : (
              <div className="flex flex-col justify-center items-center h-full mt-16">
                <h1 className="text-xl font-bold mb-8 animate-pulse text-center">
                  You don not have any NFTs.
                </h1>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
