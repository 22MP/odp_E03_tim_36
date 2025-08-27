export type MessageDTO = {
  id: number;
  posiljalacID: number;
  primalacID: number;
  tekstPoruke: string;
  stanje: "sent" | "read";
  // ključno: ovo je ono što API šalje
  vrijemeSlanja: string;       // ISO string npr. "2025-08-25T19:41:02.123Z"
  // (ako šalješ i read time)
  // vrijemeCitanja: string | null;
};
