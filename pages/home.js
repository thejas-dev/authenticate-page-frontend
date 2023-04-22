"use client"
import React from 'react'
import Header from '../components/Header';
import Information from '../components/Information';
import EditInformation from '../components/EditInformation';
import {useRecoilState} from 'recoil'
import {editState} from '../atoms/userAtom'

export default function Home() {
	// body...
	const [edit,setEdit] = useRecoilState(editState);


	return (
		<div className="min-h-screen w-full">
			<Header/>
			{
				edit ? 
				<EditInformation/>
				:
				<Information/>
			}
		</div>

	)
}