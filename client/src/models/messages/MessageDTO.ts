export interface MessageDTO {
  id: number;
  posiljalacID: number;
  primalacID: number;
  stanje: string;
  vrijeme: string; // ISO string for easier transport
  tekstPoruke: string;
}
