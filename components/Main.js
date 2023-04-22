"use client"
import {useRecoilState} from 'recoil'
import {currentUserState} from '../atoms/userAtom'
import {RiLockPasswordFill} from 'react-icons/ri';
import {IoMdMail} from 'react-icons/io';
import {signIn,useSession,getProviders,getSession} from 'next-auth/react'
import {useRouter} from 'next/navigation'
import {AiOutlineGoogle,AiFillFacebook,AiOutlineTwitter,AiOutlineGithub} from 'react-icons/ai';
import {useState} from 'react';
import {loginRoutes,registerRoutes} from '../utils/ApiRoutes'
import axios from 'axios';


export default function Main({id}) {
	// body...
	const [password,setPassword] = useState('');
	const [notFound,setNotFound] = useState(false);
	const [email,setEmail] = useState('');
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [loginState,setLoginState] = useState(false);
	const router = useRouter();
	const [alreadyExist, setAlreadyExist] = useState(false);
	
	const dataincorrect = () => {
		setNotFound(true);
	}

	const redirect = () => {
		router.push('/home');
	}

	const handleValidation = async() =>{
		if (loginState) {
			if (email.length > 5 && password.length > 3) {
				const { data } = await axios.post(loginRoutes, {
					email, password
				});
				if (data.status === false) {
					dataincorrect();
				} else {
					setCurrentUser(data?.user);
					if (!localStorage.getItem('authenticate-page')) {
						localStorage.setItem('authenticate-page', JSON.stringify(data?.user?.username));
					}
					redirect();
				}
			}			
		} else {
			if (email.length > 5 && password.length > 3) {
				try {
					const { data } = await axios.post(registerRoutes, {
						email,
						password
					});
					setCurrentUser(data.user);
					console.log(data.user);
					if (!localStorage.getItem('authenticate-page')) {
						localStorage.setItem('authenticate-page', JSON.stringify(data?.user?.username));
					}
					redirect();
				} catch(err) {
					console.log(err.message);
					setAlreadyExist(true)
				}	
			}			
		}		
	}


	return (
		<div className="w-full min-h-screen flex flex-col items-center justify-between md:justify-center">
			<div className="p-[20px] md:border-[1.5px] md:w-[30%] w-[100%] mx-auto border-gray-700/30 dark:border-gray-700/90 dark:md:border-gray-900/90  
			transition-all duration-200 ease-in	rounded-3xl shadow-xl flex flex-col">
				<div className="flex gap-2 items-center">
					<img src="https://ik.imagekit.io/d3kzbpbila/Thejas_Hari_server_images_dark_theme_for_background_website_bac_066a3751-b352-4573-8040-3a72662727c1_2_gprggFjOS.png?updatedAt=1674835809364"
					alt=""
					className="h-10 w-14 rounded-xl"
					/>
					<h1 className="text-xl text-gray-900 dark:text-gray-300 font-semibold">@THE-XAI</h1>
				</div>
				{
					loginState ?
					<h1 className="md:mt-5 mt-10 text-gray-900 dark:text-gray-300 text-2xl font-semibold w-full">
						Login
					</h1>
					:
					<>
					<h1 className="md:mt-5 mt-10 text-gray-900 dark:text-gray-300 text-2xl font-semibold w-full">
						Join thousands of learners from around the world
					</h1>
					<h1 className="md:mt-5 mt-7 md:text-md text-lg text-gray-600 dark:text-gray-500 font-semibold">
						Master web development by making real life projects. There are multiple parts for you to choose.
					</h1>						
					</>
				}
				
				<div className="flex flex-col md:mt-6 mt-10 md:gap-2 gap-3 w-full primary-glow">
					<div className="w-full gap-2 flex items-center md:p-2 p-3 rounded-xl border-[1px] dark:border-gray-800/90 border-gray-700/30">
						<IoMdMail className="h-7 w-7 text-gray-500"/>
						<input type="email" 
						pattern="[^@]+@[^@]+\.[a-zA-Z]{2,}"
						value={email}
						onChange={(e)=>setEmail(e.target.value)} required
						className="w-full dark:placeholder-gray-700 dark:text-gray-300 outline-none ring-none bg-transparent"
						placeholder="Email"
						/>
					</div>
					<div className="w-full gap-2 flex items-center md:p-2 p-3 rounded-xl border-[1px] dark:border-gray-800/90 border-gray-700/30">
						<RiLockPasswordFill className="h-7 w-7 text-gray-500"/>
						<input type='password' 
						value={password} size="10" maxLength="10" required="true"
						onChange={(e)=>setPassword(e.target.value)}
						className="w-full dark:placeholder-gray-700 dark:text-gray-300 outline-none ring-none bg-transparent"
						placeholder="Password"
						/>
					</div>
				</div>
				{
					notFound &&
					<h1 className="text-md text-red-500 text-center mt-3 font-semibold"> Credentials not matching <span 
						onClick={()=>{setLoginState(false);setNotFound(false)}}
						className="text-sky-500 cursor-pointer"><u>Please Retry</u></span></h1>					
				}
				{
					alreadyExist &&
					<h1 className="text-md text-red-500 text-center mt-3 font-semibold">Account Already Exist <span
						onClick={() => { setLoginState(true); setAlreadyExist(false) }}
						className="text-sky-500 cursor-pointer"><u>Login</u></span> here</h1>
				}
				<button 
				onClick={handleValidation}
				className="w-full md:mt-5 mt-8 rounded-xl px-5 py-2 text-white font-semibold bg-blue-500 w-full flex items-center text-center justify-center">
					Start Coding Now
				</button>
				<h1 className="text-sm  md:mt-7 mt-11 text-center text-gray-500">
					or continue with these social profile
				</h1>
				<div className="md:mt-6 mt-7 flex items-center gap-5 justify-center">
					<div className="p-2 rounded-full group transition-all duration-100 ease-in hover:border-sky-500 cursor-pointer border-[1px] border-gray-500/90">
						<AiOutlineGoogle 
						onClick={()=>{signIn(id)}}
						className="group-hover:text-sky-500 group-hover:scale-105 h-7 w-7 text-gray-500/90 transition-all duration-100 ease-in"/>
					</div>
					<div className="p-2 rounded-full group transition-all duration-100 ease-in hover:border-sky-500 cursor-pointer border-[1px] border-gray-500/90">
						<AiFillFacebook 
						onClick={()=>{signIn(id)}}
						className="group-hover:text-sky-500 group-hover:scale-105 h-7 w-7 text-gray-500/90 transition-all duration-100 ease-in"/>
					</div>
					<div className="p-2 rounded-full group transition-all duration-100 ease-in hover:border-sky-500 cursor-pointer border-[1px] border-gray-500/90">
						<AiOutlineTwitter 
						onClick={()=>{signIn(id)}}
						className="group-hover:text-sky-500 group-hover:scale-105 h-7 w-7 text-gray-500/90 transition-all duration-100 ease-in"/>
					</div>
					<div className="p-2 rounded-full group transition-all duration-100 ease-in hover:border-sky-500 cursor-pointer border-[1px] border-gray-500/90">
						<AiOutlineGithub 
						onClick={()=>{signIn(id)}}
						className="group-hover:text-sky-500 group-hover:scale-105 h-7 w-7 text-gray-500/90 transition-all duration-100 ease-in"/>
					</div>
				</div>	
				<h1 className="text-sm text-gray-500 font-semibold mt-5 text-center">
					{
						loginState ?
							<>Dont have an account yet?  
							<span onClick={()=>{setLoginState(false);setNotFound(false)}}
							className="text-sky-500 cursor-pointer"> Register</span></>
							:
							<>Already a member? <span
							onClick={()=>{setLoginState(true);setNotFound(false)}}
							className="text-sky-500 cursor-pointer">Login</span></>
					}
				</h1>
			</div>
			<h2 className="text-md text-gray-500 font-semibold mt-5 md:mt-2 mb-5 md:mb-0">
				Created by <span className="text-gray-800 dark:text-gray-200"><u>Thejas hari</u></span>
			</h2>
		</div>
	)
}


// if(data.status === false){
// 	const {data} = await axios.post(registerRoutes,{
// 		username,
// 		email,
// 		avatarImage,
// 		isAvatarImageSet,
// 	})
// 	if(!localStorage.getItem('chat-siris-2')){
// 		localStorage.setItem('chat-siris-2',JSON.stringify(data?.user?.username));
// 	}
// 	setCurrentUser(data.user);
// 	console.log(data.user);
// 	redirect();
// }else{
// 	if(!localStorage.getItem('chat-siris-2')){
// 		localStorage.setItem('chat-siris-2',JSON.stringify(data?.user?.username));
// 	}
// 	setCurrentUser(data?.user);
// 	redirect();
// }