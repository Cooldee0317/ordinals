import Layout from "@/components/sections/Layout";
import React, { useState } from "react";
import { MdCancel } from "react-icons/md";
import { FaList } from "react-icons/fa";
import BulkListModal from "@/components/trade/BulkListModal";
import { toast } from "react-hot-toast";
import Tabs from "@/components/UI/Tabs";
import Head from "next/head";
import Others from "@/components/sections/Others";
import { useLastBlock } from "../../store/hooks";
import useInscriptions from "../../hooks/useInscriptions";

export default function WalletOthers() {
  const { lastBlock } = useLastBlock();
  const { inscriptionsFromDB, fetchingData } = useInscriptions();
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [bulkSelect, setBulkSelect] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [listedItermsOnPage, setLisedItermsOnPage] = useState();

  const cancelBlocks = () => {
    setSelectedBlocks([]);
    setBulkSelect(false);
  };

  const BulkList = () => {
    if (selectedBlocks.length <= 0) {
      toast.error("Please select inscriptions");
      return;
    }
    setLisedItermsOnPage();
    setBulkSelect(false);
    setIsOpen(true);
  };

  return (
    <Layout>
      <Head>
        <title>Litemap - Wallet</title>
        <meta
          name="description"
          content="Litemap - wallet history and inscriptions"
        />
      </Head>

      <h1 className="text-3xl font-semibold my-16 text-center">My Wallet</h1>

      {!bulkSelect ? (
        <button
          className="main_btn px-2 py-1 rounded-md sm:hidden inline-block mb-1"
          onClick={() => setBulkSelect(true)}
        >
          Bulk Select
        </button>
      ) : (
        <button
          className=" bg-red-500 main_btn px-2 py-1 rounded-md gap-2 items-center sm:hidden flex  mb-1"
          onClick={() => cancelBlocks()}
        >
          <MdCancel /> Cancel
        </button>
      )}

      <div className="flex justify-center sm:justify-between w-full">
        <Tabs type={"others"} loading={fetchingData} />

        {!bulkSelect ? (
          <button
            className="main_btn px-2 py-1 rounded-md hidden sm:inline-block"
            onClick={() => setBulkSelect(true)}
          >
            Bulk Select
          </button>
        ) : (
          <button
            className=" bg-red-500 main_btn px-2 py-1 rounded-md gap-2  items-center hidden sm:flex"
            onClick={() => cancelBlocks()}
          >
            <MdCancel /> Cancel
          </button>
        )}
      </div>

      <Others
        inscriptionsFromDB={inscriptionsFromDB}
        loading={fetchingData}
        bulkSelect={bulkSelect}
        setSelectedBlocks={setSelectedBlocks}
        selectedBlocks={selectedBlocks}
        lastBlock={lastBlock}
        listedItermsOnPage={listedItermsOnPage}
      />

      <div
        className={`fixed z-50  left-1/2 border border-transparent ${
          !bulkSelect ? "-bottom-64 border-[#ffffff1a]" : "bottom-6 sm:bottom-6"
        }   -translate-x-1/2 px-6 py-3 rounded-lg bg-white/10 backdrop-blur-2xl duration-200 flex items-center gap-3 flex-wrap shadow-black shadow-lg`}
      >
        <p>{selectedBlocks.length} inscriptions selected.</p>
        <div className="flex gap-3 sm:justify-end justify-center">
          <button
            className="main_btn py-2 px-4 rounded-lg flex items-center gap-2 bg-transparent"
            onClick={() => cancelBlocks()}
          >
            <MdCancel /> Cancel
          </button>
          <button
            className="main_btn py-2 px-4 rounded-lg flex items-center gap-2 bg-sky-600"
            onClick={BulkList}
          >
            List <FaList />
          </button>
        </div>
      </div>

      <BulkListModal
        modalIsOpen={isOpen}
        setIsOpen={setIsOpen}
        tag={"others"}
        blocks={selectedBlocks}
        setSelectedBlocks={setSelectedBlocks}
        cancelBlocks={cancelBlocks}
        setLisedItermsOnPage={setLisedItermsOnPage}
      />
    </Layout>
  );
}
