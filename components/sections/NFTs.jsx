import React, { useState, useEffect } from "react";
import { CgWebsite } from "react-icons/cg";
import { FaTwitter } from "react-icons/fa";
import { BsDiscord } from "react-icons/bs";
import InscriptionCardSkelenton from "../UI/InscriptionCardSkelenton";
import Link from "next/link";
import InscriptionCard from "../UI/InscriptionCard";
import ReactPaginate from "react-paginate";
import useActivities from "../../hooks/useActivities";

export default function NFTs({
  inscriptionsFromDB,
  loading,
  bulkSelect,
  setNFTSlug,
  setSelectedBlocks,
  selectedBlocks,
  lastBlock,
  listedItermsOnPage
}) {
  const [index, setIndex] = useState(0);
  const [meta, setmeta] = useState();
  const [myInscriptions, setMyInscriptions] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [offset, setOffset] = useState(0);
  const [collectionsData, setcollectionsData] = useState();
  const [listedIterms, setListedIterms] = useState();
  const { getListedIterms } = useActivities(meta?.slug);

  const handlePageClick = (e) => {
    setOffset(e.selected);
  };

  async function getCollectionData() {
    const [collectionsFromGithub] = await Promise.all([
      fetch(
        `https://raw.githubusercontent.com/nextidearly/collections/main/collections/metas/metas.json`
      ).then((response) => response.json()),
    ]);
    setcollectionsData(collectionsFromGithub);
  }

  async function getCollection(collectionSlug) {
    const res = await getListedIterms();
    setListedIterms(res);

    const [inscriptions] = await Promise.all([
      fetch(
        `https://raw.githubusercontent.com/nextidearly/collections/main/collections/${collectionSlug}/inscriptions.json`
      ).then((response) => response.json()),
    ]);
    let NFTs = [];
    inscriptionsFromDB.map((inscription, key) => {
      const filter = inscriptions.filter(
        (item) => item.id === inscription.inscriptionId
      );
      if (filter.length > 0) {
        NFTs.push({
          ...inscription,
          content: filter[0]?.meta?.name,
          inscriptionIndex: key,
        });
      }
    });
    setMyInscriptions(NFTs);
    setFetchingData(false);
  }

  useEffect(() => {
    if (collectionsData) {
      setmeta(collectionsData[index]);
      setNFTSlug(collectionsData[index].slug);
    }
  }, [index, collectionsData]);

  useEffect(() => {
    if (meta?.slug && !loading && inscriptionsFromDB) {
      getCollection(meta?.slug);
    }

    if (!loading && !inscriptionsFromDB) {
      setFetchingData(false);
    }
  }, [meta, inscriptionsFromDB, loading]);

  useEffect(() => {
    getCollectionData();
  }, []);

  return (
    <div className="my-3 w-full">
      <div className="flex gap-3 justify-between w-full flex-wrap sm:flex-nowrap">
        <div className="flex gap-2 justify-between sm:justify-start">
          {meta?.inscription_icon ===
          "9278bd914fdc07f866fc4b4e402c87a0aa04666cfc9f0c9dde6ead58b17abcf7i0" ? (
            <img
              src={`/litecoin.png`}
              className="rounded-md h-[38px] w-[38px]"
              alt="logo"
            />
          ) : (
            <img
              src={`https://ordinalslite.com/content/${meta?.inscription_icon}`}
              className="rounded-md h-[38px] w-[38px]"
              alt="logo"
            />
          )}
          <select
            className="bg-primary-dark/50 px-3 py-2 rounded-md cursor-pointer"
            onChange={(e) => setIndex(e.target.value)}
          >
            {collectionsData?.map((collection, index) => {
              return (
                <option
                  className="bg-primary-dark/50"
                  value={index}
                  key={index}
                >
                  {collection.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex gap-2 items-center justify-between sm:justify-end">
          <p>Supply: {meta?.supply} </p>
          <div className="flex gap-2">
            <a
              className="p-1.5 rounded-full main_btn"
              target="_blank"
              href={meta?.website_link}
            >
              <CgWebsite />
            </a>
            <a
              className="p-1.5 rounded-full main_btn"
              target="_blank"
              href={meta?.twitter_link}
            >
              <FaTwitter />
            </a>
            <a
              className="p-1.5 rounded-full main_btn"
              target="_blank"
              href={meta?.discord_link}
            >
              <BsDiscord />
            </a>
          </div>
        </div>
      </div>

      <div className="my-2">
        {fetchingData ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 mt-8 w-full">
            {Array.from({ length: 10 }, (_, key) => {
              return <InscriptionCardSkelenton key={key} />;
            })}
          </div>
        ) : (
          <>
            {myInscriptions.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 mt-8 w-full">
                  {myInscriptions &&
                    myInscriptions
                      .slice(offset * 42, offset * 42 + 42)
                      .map((inscription, key) => {
                        return (
                          <InscriptionCard
                            inscription={inscription}
                            key={inscription?.inscriptionId + "nfts"}
                            inscriptionIndex={inscription.inscriptionIndex}
                            bulkSelect={bulkSelect}
                            tag={meta?.slug}
                            setSelectedBlocks={setSelectedBlocks}
                            selectedBlocks={selectedBlocks}
                            isNFT={true}
                            lastBlock={lastBlock}
                            listedIterms={listedIterms}
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
                  pageCount={Math.ceil(Object.keys(myInscriptions).length / 42)}
                  previousLabel="<"
                  renderOnZeroPageCount={null}
                  className="pagination"
                />
              </>
            ) : (
              <div className="flex flex-col justify-center items-center w-full sm:mt-[7rem] mt-[10rem]">
                <h1 className="text-xl font-bold mb-8 animate-pulse text-center">
                  You don not have any NFTs.
                </h1>

                <Link
                  href={`/collection/${meta?.slug}`}
                  className="mx-auto main_btn px-3 py-2 rounded-md"
                >
                  Buy Now
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
