export interface Message {
  id: number;
  posiljalacID: number;
  primalacID: number;
  stanje: string; 
  vrijeme: Date;
  tekstPoruke: string;
}