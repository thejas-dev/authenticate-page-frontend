"use client"
import {useRecoilState} from 'recoil'
import {currentUserState} from '../atoms/userAtom'
import {AiOutlineCaretDown} from 'react-icons/ai';
import {useState} from 'react';
import {MdLogout} from 'react-icons/md';
import {useRouter} from 'next/navigation'
import {CgProfile} from 'react-icons/cg'
import {MdGroup} from 'react-icons/md'
import {signOut} from 'next-auth/react';

export default function Header() {
	// body...
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [reveal,setReveal] = useState(false);
	const router = useRouter();

	const redirect = () => {
		signOut();
		router.push('/');
	}


	return (
		<div className="fixed z-50 top-0 w-full backdrop-blur-md px-5 pt-6 pb-4 ">
			<div className="max-w-6xl mx-auto flex justify-between items-center">
				<div className="flex gap-2 items-center">
					<img src="https://ik.imagekit.io/d3kzbpbila/Thejas_Hari_server_images_dark_theme_for_background_website_bac_066a3751-b352-4573-8040-3a72662727c1_2_gprggFjOS.png?updatedAt=1674835809364"
					alt=""
					className="h-10 w-14 rounded-xl"
					/>
					<h1 className="text-md text-gray-900 dark:text-gray-300 font-semibold">@THE-XAI</h1>
				</div>
				<div 
				className="flex z-1 relative items-center gap-5 cursor-pointer">
					<img 
					onClick={()=>setReveal(!reveal)}
					src={currentUser?.photo} 
					alt="" className="h-10 w-10 rounded-xl"/>
					<h1 
					onClick={()=>setReveal(!reveal)}
					className="text-md dark:text-gray-300 text-gray-800 font-semibold hidden md:block">{currentUser?.name}</h1>
					<AiOutlineCaretDown 
					onClick={()=>setReveal(!reveal)}
						className={`h-5 w-5 dark:text-gray-300 text-gray-900 ${reveal && "rotate-180"} transition-all
					duration-200 ease-in-out hidden md:block`}/>
					<div className={`absolute z-10 flex w-[170px] dark:bg-gray-800 bg-gray-200 flex-col ${reveal ? "top-14" : "-top-[200px]"} right-0 transition-all duration-200 ease-in-out border-[1px] border-gray-500/70 rounded-2xl p-3`}>
						<div className="flex items-center w-full gap-3 p-2 hover:dark:bg-gray-700/70 hover:bg-gray-300/70 rounded-xl transition-all duration-200 ease-in cursor-pointer">
							<CgProfile className="h-5 w-5 dark:text-gray-300 text-gray-800"/>
							<h1 className="text-md text-gray-800 dark:text-gray-300">My Profile</h1>
						</div>
						<div className="flex mt-1 items-center w-full gap-3 p-2 hover:dark:bg-gray-700/70 hover:bg-gray-300/70 rounded-xl transition-all duration-200 ease-in cursor-pointer">
							<MdGroup className="h-5 w-5 text-gray-800 dark:text-gray-300"/>
							<h1 className="text-md text-gray-800 dark:text-gray-300">Group</h1>
						</div>
						<div className="h-[1.5px] mt-1 w-[95%] mx-auto dark:bg-gray-700/40 bg-gray-300/80"/>
						<div className="flex mt-1 items-center w-full gap-3 p-2 hover:dark:bg-gray-700/70 hover:bg-gray-300/70 rounded-xl transition-all duration-200 ease-in cursor-pointer">
							<MdLogout className="h-5 w-5 text-red-500"/>
							<h1 
							onClick={()=>{
								redirect();
							}}
							className="text-md text-red-500">Logout</h1>
						</div>
					</div>
				</div>
			</div>
		</div>


	)
}