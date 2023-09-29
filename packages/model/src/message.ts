export interface Message {
  id: string;
  userId: string;
  avatar: string;
  name: string;
  text: string;
	date: Date;
}

export interface Chat {
	id: string;
	name: string;
	messages: Message[]
}
