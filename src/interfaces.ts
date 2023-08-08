export interface newState {
  userName: string;
  longRoomId: string;
  shortRoomId: string;
  messagesList: any;
  userId: string;
  email: string;
  option: string;
}

export interface FormData {
  email: string;
  userName: string;
  option: string;
  shortRoomId?: string;
}
