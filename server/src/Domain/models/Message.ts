export class Message {
	public constructor(
		public id: number = 0,
		public posiljalacID: number = 0,
		public primalacID: number = 0,
		public stanje: string = 'neprocitano',
		public vrijeme: Date = new Date(),
		public tekstPoruke: string = ''
	) {}
}
