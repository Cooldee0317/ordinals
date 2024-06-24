import React from "react";
import Layout from "@/components/sections/Layout";
import { ref, query, get, limitToLast } from "firebase/database";
import { db } from "@/services/firebase";
import { useState } from "react";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import BuyCardSkelenton from "../components/UI/BuyCardSkelenton";
import BuyCard from "../components/UI/BuyCard";
import { useWallet } from "../store/hooks";
import useUTXOs from "../hooks/useUTXOs";
import Banner from "../components/trade/Banner";
import Head from "next/head";
import LastSales from "../components/sections/LastSales";

export default function Home() {
  const { utxos, sortedUtxos, dummyUTXOs, refreshUTXOs, selectUtxos } =
    useUTXOs();
  const { price } = useWallet();
  const [lists, setLists] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [offset, setOffset] = useState(0);
  const [listedNumber, setListedNumber] = useState(540);
  const [lastKey, setLastKey] = useState();
  const [lastSales, setLastSales] = useState();

  const handlePageClick = (e) => {
    setOffset(e.selected);
  };

  const fetchTotalItems = async () => {
    let dbQuery;
    if (lastKey) {
      dbQuery = query(ref(db, "market/others"), limitToLast(42 * (offset + 1)));
    } else {
      dbQuery = query(ref(db, "market/others"), limitToLast(42));
    }

    const othersSnapShot = await get(dbQuery);
    const exist = othersSnapShot.val();

    if (exist) {
      setLists(exist);
      setLastKey(Object.keys(exist)[41]);
    }
    setFetchingData(false);
  };

  useEffect(() => {
    fetchTotalItems();
  }, [offset]);

  return (
    <Layout>
      <Head>
        <title>Litemap - Market For All Ordinals</title>
        <meta name="description" content="Litemap -  Market For All Ordinals" />
      </Head>

      <Banner
        title="Any Inscriptions"
        tag="others"
        setListedNumber={setListedNumber}
        setLastSales={setLastSales}
      />

      {fetchingData ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 mt-8 w-full">
          {Array.from({ length: 24 }, (_, index) => {
            return <BuyCardSkelenton key={index} />;
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 mt-8 w-full">
          {Object.keys(lists)
            .reverse()
            .slice(offset * 42, offset * 42 + 42)
            .map((index, list) => {
              return (
                <BuyCard
                  key={list}
                  list={lists[index]}
                  price={price}
                  utxos={utxos}
                  sortedUtxos={sortedUtxos}
                  dummyUTXOs={dummyUTXOs}
                  refreshUTXOs={refreshUTXOs}
                  selectUtxos={selectUtxos}
                />
              );
            })}
        </div>
      )}

      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        pageCount={Math.ceil(listedNumber / 42)}
        previousLabel="<"
        renderOnZeroPageCount={null}
        className="pagination"
      />

      <LastSales slug={"others"} lastSales={lastSales} price={price} />
    </Layout>
  );
}
