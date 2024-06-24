import { ref, push, query, onValue, update, get } from "firebase/database";
import { db } from "@/services/firebase";
import { useContext } from "react";
import { WalletContext } from "../context/wallet";
import { useWallet } from "../store/hooks";
import { useState } from "react";
import { useEffect } from "react";

export default function useInscriptions() {
  const wallet = useContext(WalletContext);
  const address = wallet.getAddress();
  const { inscriptions } = useWallet();
  const [inscriptionsFromDB, setInscriptionFromDB] = useState("");
  const [fetchingData, setFetchingData] = useState(true);
  let pushing = false;

  async function fetchInscriptions() {
    const dbQuery = query(ref(db, `wallet/${address}`));
    onValue(dbQuery, async (snapshot) => {
      const exist = snapshot.val();
      if (exist) {
        setInscriptionFromDB(exist[Object.keys(exist)[0]]["inscriptions"]);
      }
      setFetchingData(false);
    });
  }

  const saveInscriptionToDB = async (data) => {
    if (pushing) {
      return;
    }
    pushing = true;
    const dbRef = ref(db, `wallet/${address}`);

    //  console.log("running");
    try {
      const snapshot = await get(dbRef);
      const exist = snapshot.exists();

      if (exist) {
        const key = Object.keys(snapshot.val())[0];
        const dbRefToUpdate = ref(db, `/wallet/${address}/${key}`);
        if (data && key !== "activities") {
          const existedInscriptions = snapshot.val()[key].inscriptions;
          if (existedInscriptions.length !== data?.length) {
            await update(dbRefToUpdate, { inscriptions: data });
          }
        } else {
          if (data) {
            const dbRef = ref(db, `wallet/${address}`);
            await push(dbRef, { inscriptions: data });
          }
        }
        await fetchInscriptions();
        pushing = false;
      } else {
        if (data) {
          const dbRef = ref(db, `wallet/${address}`);
          await push(dbRef, { inscriptions: data });
        }
        setFetchingData(false);
      }
    } catch (error) {
      setFetchingData(false);
      pushing = false;
      console.error("Error saving transaction:", error);
    }
  };

  useEffect(() => {
    if (address) {
      saveInscriptionToDB(inscriptions.list);
    } else {
      setFetchingData(false);
    }
  }, [inscriptions, address]);

  return {
    inscriptionsFromDB: inscriptionsFromDB,
    fetchingData: fetchingData,
  };
}
