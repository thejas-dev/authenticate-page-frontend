import { atom } from 'recoil';


export const currentUserState = atom({
	key:"currentUserState",
	default:"",
})

export const editState = atom({
	key:"editState",
	default:false
})