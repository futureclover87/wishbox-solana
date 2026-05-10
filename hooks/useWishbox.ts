import { useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";

/**
 * Shape of a wish submission - mirrors the future Anchor program account.
 */
export interface WishSubmission {
  content: string;
  authorPublicKey: string;
  timestamp: number;
}

/**
 * Return type of useWishbox.
 */
export interface UseWishboxReturn {
  /** Submit a wish to the Wishbox program (currently logs to console). */
  submitWish: (content: string) => Promise<void>;
  isConnected: boolean;
  publicKey: string | null;
}

/**
 * useWishbox — mock contract hook.
 *
 * Prepares the interaction surface for the Wishbox Anchor program.
 * Currently logs the wish to the console; swap the TODO block for a real
 * `program.methods.submitWish(content).accounts({...}).rpc()` call once
 * the IDL is generated.
 */
export function useWishbox(): UseWishboxReturn {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();

  const submitWish = useCallback(
    async (content: string): Promise<void> => {
      if (!connected || !publicKey) {
        console.warn("[useWishbox] Wallet not connected — please connect first.");
        return;
      }

      if (!content.trim()) {
        console.warn("[useWishbox] Cannot submit an empty wish.");
        return;
      }

      const submission: WishSubmission = {
        content: content.trim(),
        authorPublicKey: publicKey.toBase58(),
        timestamp: Date.now(),
      };

      console.log("[useWishbox] Submitting wish:", submission);
      console.log("[useWishbox] RPC endpoint:", connection.rpcEndpoint);

      // ─── Future Anchor program call ─────────────────────────────────────────
      // Replace this block once the on-chain program is deployed:
      //
      // import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
      // import { WishboxIDL, WISHBOX_PROGRAM_ID } from "@/idl/wishbox";
      //
      // const provider = new AnchorProvider(connection, wallet, {});
      // const program  = new Program(WishboxIDL, WISHBOX_PROGRAM_ID, provider);
      //
      // const [wishPDA] = PublicKey.findProgramAddressSync(
      //   [Buffer.from("wish"), publicKey.toBuffer(), Buffer.from(submission.timestamp.toString())],
      //   WISHBOX_PROGRAM_ID
      // );
      //
      // const txSig = await program.methods
      //   .submitWish(content)
      //   .accounts({
      //     wish:          wishPDA,
      //     author:        publicKey,
      //     systemProgram: SystemProgram.programId,
      //   })
      //   .rpc();
      //
      // console.log("[useWishbox] Transaction confirmed:", txSig);
      // ────────────────────────────────────────────────────────────────────────

      // Temporary: acknowledge the unused imports so TypeScript is happy
      void PublicKey;
      void SystemProgram;
    },
    [connected, publicKey, connection]
  );

  return {
    submitWish,
    isConnected: connected,
    publicKey: publicKey?.toBase58() ?? null,
  };
}
