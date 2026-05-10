import { PublicKey } from "@solana/web3.js";

/**
 * Placeholder escrow treasury.
 * Replace with the Wishbox program's PDA once the Anchor program is deployed.
 * Any valid Solana pubkey works for Devnet testing — it triggers the wallet signing popup.
 * Using the SPL Token Program ID as a well-known, valid Devnet address.
 */
export const WISHBOX_TREASURY = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

/** Fraction of the reward that the claimer must stake upfront. */
export const CLAIM_STAKE_RATIO = 0.1;
