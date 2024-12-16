'use client';

import dynamic from "next/dynamic";
import { FormEvent, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

require("@solana/wallet-adapter-react-ui/styles.css");

const WalletMultiButtonDynamic = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  { ssr: false }
);
export default function Home() {
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [addressToSend, setAddressToSend] = useState("");
  const [amountToSend, setAmountToSend] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendSol = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const transaction = new web3.Transaction();
      const recipientPubKey = new web3.PublicKey(addressToSend);

      const sendSolInstruction = web3.SystemProgram.transfer({
        fromPubkey: publicKey!,
        toPubkey: recipientPubKey,
        lamports: LAMPORTS_PER_SOL * Number(amountToSend),
      });

      transaction.add(sendSolInstruction);
      const signature = await sendTransaction(transaction, connection);
      console.log(`Transaction successful: ${signature}`);
    } catch (e) {
      console.error(`Transaction failed: ${e}`);
      setError("Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!connection || !publicKey) {
      console.log("no connection");
      return;
    }
    console.log("there is connection", connection.rpcEndpoint, publicKey.toString());

    const subscriptionId = connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
      },
      "confirmed"
    );

    connection.getAccountInfo(publicKey).then((info) => {
      console.log(info, "yeah info");
      if (info) setBalance(info.lamports);
    });

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [connection, publicKey]);

  return (
    <main
      style={{
        position: "absolute",
        top: "50%",
        left: "10px",
        transform: "translateY(-50%)",
        backgroundColor: "rgba(0, 0, 0, 0.6)", // Átlátszó fekete háttér
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "20px", fontSize: "2rem" }}>Solana Wallet</h1>

      <WalletMultiButtonDynamic />

      {error && <p style={{ color: "#e53e3e", marginTop: "10px" }}>{error}</p>}
      {loading && <p style={{ marginTop: "10px" }}>Sending transaction...</p>}
      <p style={{ marginTop: "10px" }}>
  {publicKey ? `Balance: ${(balance / LAMPORTS_PER_SOL)} SOL` : ""}
</p>

      <form
        onSubmit={sendSol}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "20px",
          gap: "10px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Transfer Address</label>
          <input
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #4a5568",
              borderRadius: "8px",
              backgroundColor: "#2d3748",
              color: "white",
            }}
            value={addressToSend}
            onChange={(e) => setAddressToSend(e.target.value)}
            required
          />
        </div>

        <div style={{ width: "100%", maxWidth: "400px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Transfer Amount</label>
          <input
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #4a5568",
              borderRadius: "8px",
              backgroundColor: "#2d3748",
              color: "white",
            }}
            type="number"
            onChange={(e) => setAmountToSend(Number(e.target.value))}
            value={amountToSend}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? "#718096" : "#4CAF50",
            color: "white",
            padding: "15px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
            transition: "background-color 0.3s",
          }}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </main>
  );
}
