export type MessageDTO = {
  id: number;
  posiljalacID: number;
  primalacID: number;
  tekstPoruke: string;
  stanje: "sent" | "read";
  vrijemeSlanja: string;        
};
