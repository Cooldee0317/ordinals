import {
  ref,
  push,
  query,
  orderByChild,
  equalTo,
  onValue,
  update,
  get,
  remove,
} from "firebase/database";
import { db } from "@/services/firebase";
import { useCallback, useContext, useEffect, useState } from "react";
import { WalletContext } from "../context/wallet";
import { toast } from "react-hot-toast";

export default function useActivities(tag) {
  const wallet = useContext(WalletContext);
  const [listedIterms, setListedIterms] = useState([]);
  const address = wallet.getAddress();

  const addListForSale = async (tag, inscriptionId, content, price) => {
    if (!address) {
      toast.error("Please connect your wallet.");
      return;
    }
    const dbRef = ref(db, `wallet/${address}/activities`);
    const newActivity = {
      date: Date.now(),
      tag: tag,
      content: content,
      id: inscriptionId,
      price: price,
      type: "Listed",
      tx: "",
    };
    await push(dbRef, newActivity);
  };

  const updateListForSold = async (
    tag,
    inscriptionId,
    content,
    price,
    address,
    tx
  ) => {
    if (!address) {
      toast.error("Please connect your wallet.");
      return;
    }
    const dbQueryForActivityUpdate = query(
      ref(db, `wallet/${address}/activities`),
      orderByChild("id"),
      equalTo(inscriptionId)
    );

    const activitySnapShot = await get(dbQueryForActivityUpdate);
    const existedActivity = activitySnapShot.val();

    if (existedActivity) {
      const key = Object.keys(existedActivity)[0];
      const dbRefForUpdate = ref(db, `wallet/${address}/activities/${key}`);

      await update(dbRefForUpdate, {
        ...existedActivity[key],
        date: Date.now(),
        tag: tag,
        price: price,
        type: "Sold",
        content: content,
        tx: tx,
      });
    }
  };

  const addActiviyForBuy = async (tag, inscriptionId, content, price, tx) => {
    if (!address) {
      toast.error("Please connect your wallet.");
      return;
    }
    const dbRef = ref(db, `wallet/${address}/activities`);
    const newActivity = {
      date: Date.now(),
      tag: tag,
      content: content,
      id: inscriptionId,
      price: price,
      type: "Buy",
      tx: tx,
    };
    await push(dbRef, newActivity);

    const dbRefForActivities = ref(db, `activities`);
    const activity = {
      date: Date.now(),
      tag: tag,
      content: content,
      id: inscriptionId,
      price: price,
      type: "Buy",
      tx: tx,
    };
    await push(dbRefForActivities, activity);

    await handleUpdateStatus(tag, price);
  };

  const handleUpdateStatus = async (tag, price) => {
    const dbQuery = query(ref(db, `status/${tag}`));

    const snapshot = await get(dbQuery);
    const exist = snapshot.val();

    if (!exist) {
      const dbRefStatus = ref(db, `/status/${tag}`);
      await push(dbRefStatus, {
        TVL: Number(price),
        floor: Number(price),
        listed: 1,
      });
    } else {
      const key = Object.keys(exist)[0];
      const url = `/status/${tag}/${key}`;
      const dbRefStatus = ref(db, url);

      const updates = {};
      if (Number(price)) {
        updates[`TVL`] = Number(exist[key]?.TVL) - Number(price);
        updates[`floor`] =
          (Number(exist[key]?.TVL) - Number(price)) /
          (Number(exist[key]?.listed) - 1);
        updates[`listed`] = Number(exist[key]?.listed) - 1;

        await update(dbRefStatus, updates);
      }
    }
  };

  const updateActivityForUnlist = async (inscriptionId, ticker) => {
    if (!address) {
      toast.error("Please connect your wallet.");
      return;
    }
    const dbQueryForActivityUpdate = query(
      ref(db, `wallet/${address}/activities`),
      orderByChild("id"),
      equalTo(inscriptionId)
    );

    const activitySnapShot = await get(dbQueryForActivityUpdate);
    const existedActivity = activitySnapShot.val();
    if (existedActivity) {
      Object.keys(existedActivity).map(async (key) => {
        if (existedActivity[key].type === "Listed") {
          const dbRefForUpdate = ref(db, `wallet/${address}/activities/${key}`);
          await remove(dbRefForUpdate);
        }
      });
    }
  };

  const handleCancelList = async (ticker, inscriptionId) => {
    if (!address) {
      toast.error("Please connect your wallet.");
      return;
    }
    let listedInscriptionData;
    const dbRef = ref(db, "market/" + ticker);
    const dbQuery = query(
      dbRef,
      orderByChild("data/inscriptionId"),
      equalTo(inscriptionId)
    );

    const snapshot = await get(dbQuery);
    const exist = snapshot.val();

    if (exist) {
      const key = Object.keys(exist)[0];
      listedInscriptionData = exist[key];

      await remove(ref(db, `market/${ticker}/${key}`));
    }

    const dbRefStatus = ref(db, "status/" + ticker);
    const dbQueryForStatus = query(dbRefStatus);

    const statusSnapshot = await get(dbQueryForStatus);
    const statusData = statusSnapshot.val();

    if (statusData) {
      const key = Object.keys(statusData)[0];
      const dbRefUpdate = ref(db, `status/${ticker}/${key}`);

      const updates = {};
      if (listedInscriptionData) {
        updates[`TVL`] =
          Number(statusData[key]?.TVL) - Number(listedInscriptionData?.price) ||
          0;
        updates[`floor`] =
          Number(statusData[key]?.listed) - 1 == 0
            ? 0
            : (Number(statusData[key]?.TVL) -
                Number(listedInscriptionData?.price)) /
                (Number(statusData[key]?.listed) - 1) || 0;
        updates[`listed`] = Number(statusData[key]?.listed) - 1 || 0;
        await update(dbRefUpdate, updates);
      }
    }

    await updateActivityForUnlist(inscriptionId, ticker);
  };

  const getListedItems = useCallback(async () => {
    try {
      const dbQuery = query(
        ref(db, `wallet/${address}/activities`),
        orderByChild("tag"),
        equalTo(tag)
      );

      return new Promise((resolve, reject) => {
        onValue(
          dbQuery,
          (snapshot) => {
            const exist = snapshot.val();
            if (exist) {
              let listedItems = [];
              Object.keys(exist).map((key) => {
                if (exist[key].type == "Listed") listedItems.push(exist[key]);
              });
              resolve(listedItems);
            } else {
              resolve([]);
            }
          },
          (error) => {
            console.log(error);
            reject(error);
          }
        );
      });
    } catch (e) {
      console.log(e);
      return false;
    }
  }, [tag, address]);

  useEffect(() => {
    if (address) {
      try {
        const dbQuery = query(
          ref(db, `wallet/${address}/activities`),
          orderByChild("type"),
          equalTo("Listed")
        );

        onValue(
          dbQuery,
          (snapshot) => {
            const exist = snapshot.val();
            if (exist) {
              let listedItems = [];
              Object.keys(exist).map((key) => {
                listedItems.push(exist[key]);
              });
              setListedIterms(listedItems);
            } else {
              setListedIterms([]);
            }
          },
          (error) => {
            console.log(error);
          }
        );
      } catch (e) {
        console.log(e);
      }
    }
  }, [address]);

  return {
    handleCancelList: handleCancelList,
    addlistForSale: addListForSale,
    updateListForSold: updateListForSold,
    addActiviyForBuy: addActiviyForBuy,
    updateActivityForUnlist: updateActivityForUnlist,
    getListedIterms: getListedItems,
    listedIterms: listedIterms,
  };
}
