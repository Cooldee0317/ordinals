import React, { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
  ref,
  query,
  orderByChild,
  equalTo,
  update,
  remove,
  get,
} from "firebase/database";
import { db } from "@/services/firebase";
import { toast } from "react-hot-toast";
import { WalletContext } from "../../context/wallet";
import { AiOutlineLoading } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { TbArticleOff } from "react-icons/tb";
import { TbGiftOff } from "react-icons/tb";
import useActivities from "../../hooks/useActivities";
import LTCListModal from "../trade/LTCListModal";
import LTCTransferModal from "../trade/LTCTransferModal";

export default function Ltc20tokenCard({
  data,
  ticker,
  bulkSelect,
  setSelectedBlocks,
  selectedBlocks,
  listedIterms,
  listedItermsOnPage,
}) {
  const { handleCancelList } = useActivities();
  const [content, setContent] = useState(data.amount);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isOpenTransfer, setIsOpenTransfer] = useState(false);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);

  const [isListed, setIsListed] = useState(false);

  const openListModal = async () => {
    setIsOpen(true);
  };

  const openTransferModal = async () => {
    setIsOpenTransfer(true);
  };

  const AddList = async () => {
    if (!content) {
      toast.error("Please wait until feching content");
      return;
    }

    if (!data?.inscriptionId) {
      toast.error("Unknown inscription ID");
      return;
    }

    try {
      setAdding(true);

      const newBlock = {
        amount: data.amount,
        inscriptionId: data.inscriptionId,
        inscriptionNumber: data.inscriptionNumber,
      };

      const updatedBlocks = [...selectedBlocks, newBlock];

      setSelectedBlocks(updatedBlocks);
      setAdding(false);
    } catch (error) {
      toast.error("When validating:", error);
      //  console.log(error);
      setAdding(true);
    }
  };

  const removeFromList = () => {
    const filter = selectedBlocks.filter(
      (block) => block.inscriptionId !== data.inscriptionId
    );
    setSelectedBlocks(filter);
    setAdded(false);
  };

  useEffect(() => {
    const exist = selectedBlocks.filter(
      (block) => block.inscriptionId == data.inscriptionId
    );
    if (exist.length > 0) {
      setAdded(true);
    } else {
      setAdded(false);
    }
  }, [selectedBlocks]);

  useEffect(() => {
    if (listedIterms && data) {
      const filter = listedIterms.filter(
        (item) => item.id === data.inscriptionId
      );

      if (filter.length > 0) {
        setIsListed(true);
      } else {
        setIsListed(false);
      }
    } else {
      setIsListed(false);
    }
  }, [listedIterms]);

  useEffect(() => {
    if (listedItermsOnPage && data) {
      const filter = listedItermsOnPage.filter(
        (item) => item.inscriptionId === data.inscriptionId
      );

      if (filter.length > 0) {
        setIsListed(true);
      }
    }
  }, [listedItermsOnPage]);

  return (
    <>
      <div className={`${added && "cs-border"} in-card`}>
        <div className="in-content flex-col h-[130px] w-full">
          {data?.amount} <br />
          <p className="mt-1 text-sm text-gray-300 text-center">
            {data?.ticker}
          </p>
          <button
            className="in-transfer"
            onClick={(e) => {
              e.stopPropagation();
              openTransferModal();
            }}
          >
            Transfer
          </button>
        </div>
        <hr className="cs-border" />
        <div className="text-center text-sm text-gray-300">
          #{data?.inscriptionNumber}
        </div>

        {isListed ? (
          <>
            <button
              className="main_btn mt-1  py-1 rounded-md bg-transparent disabled:bg-primary-light/10 w-full flex gap-1 justify-center items-center"
              onClick={(e) => {
                e.stopPropagation();
                handleCancelList(data?.ticker, data.inscriptionId);
                setIsListed(false);
              }}
            >
              <TbGiftOff /> Listed
            </button>
          </>
        ) : (
          <>
            {bulkSelect ? (
              <>
                {added ? (
                  <button
                    className="main_btn mt-1  cs-border bg-transparent py-1 h-8  rounded-md w-full flex justify-center items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromList();
                    }}
                  >
                    <TbArticleOff />
                    Added
                  </button>
                ) : (
                  <button
                    disabled={adding || added}
                    className="main_btn mt-1  py-1 h-8  rounded-md w-full flex justify-center items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      AddList();
                    }}
                  >
                    <>
                      {adding ? (
                        <AiOutlineLoading className="text-lg text-white font-semibold animate-spin" />
                      ) : (
                        <>
                          <FaPlus />
                          Add
                        </>
                      )}
                    </>
                  </button>
                )}
              </>
            ) : (
              <button
                disabled={isListed}
                className="main_btn mt-1  py-1 h-8 rounded-md w-full flex justify-center items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  openListModal();
                }}
              >
                List
              </button>
            )}
          </>
        )}
      </div>

      <LTCListModal
        setIsListed={setIsListed}
        modalIsOpen={modalIsOpen}
        setIsOpen={setIsOpen}
        ticker={ticker}
        amount={data.amount}
        inscription={data}
      />

      <LTCTransferModal
        modalIsOpen={isOpenTransfer}
        setIsOpen={setIsOpenTransfer}
        content={data.amount}
        id={data?.inscriptionId}
        inscription={data}
        ticker={ticker}
      />
    </>
  );
}
