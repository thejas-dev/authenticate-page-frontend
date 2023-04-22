"use client"
import axios from 'axios';
import {AiOutlineLeft,AiFillCamera} from 'react-icons/ai'; 
import {useRecoilState} from 'recoil'
import {currentUserState,editState} from '../atoms/userAtom'
import {useEffect,useState} from 'react';
import ImageKit from "imagekit";
import {updateRoutes} from '../utils/ApiRoutes'

export default function EditInformation() {
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [edit,setEdit] = useRecoilState(editState);
	const [name,setName] = useState('');
	const [photo,setPhoto] = useState('');
	const [bio,setBio] = useState('');
	const [mobile,setMobile] = useState('');
	const [email,setEmail] = useState('');
	const [password,setPassword] = useState('');
	const [path2,setPath2] = useState('');
	const [url2,setUrl2] = useState('');
	const [loader,setLoader] = useState(false);
	// body...
	const imagekit = new ImageKit({
	    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_ID,
	    privateKey : process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
	    urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT
	})
	console.log(currentUser)

	const updateInformation = async () => {
		const { data } = await axios.post(`${updateRoutes}/${currentUser._id}`,{
			name,bio,photo,mobile,email,password
		})
		console.log(data);
		setCurrentUser(data.obj);
		setEdit(false);
	}

	const openInput = () => {
		document.getElementById('file1').click();
	}

	useEffect(()=>{
		if(currentUser){
			setName(currentUser.name);
			setBio(currentUser.bio);
			setMobile(currentUser.mobile);
			setPhoto(currentUser.photo);
			setEmail(currentUser.email);
			setPassword(currentUser.password);
		}
	},[]);

	const pathCheck = (path) =>{
		if(path){
			if(path.split('/').includes('data:image')){
				return true;				
			}
		}
	}

	useEffect(()=>{
	if(url2){
		setLoader(true);
		const uploadImage = (url2) =>{
			if(pathCheck(url2)){
				imagekit.upload({
			    file : url2, //required
			    fileName : "thejashari",   //required
			    extensions: [
			        {
			            name: "google-auto-tagging",
			            maxTags: 5,
			            minConfidence: 95
			        }
			    ]
				}).then(response => {
					setLoader(false)
				    // uploadBackground(response.url)
				    setUrl2('');
				    setPhoto(response.url);
				}).catch(error => {
				    console.log(error);
				});
			}else{
				alert("Not an Image Format")
				setUrl2('')
				setLoader(false);
			}
		}
		uploadImage(url2);
		}
	},[url2])

	const url1Setter = () =>{
		const image_input = document.querySelector('#file1');
		const reader = new FileReader();

		reader.addEventListener('load',()=>{
			let uploaded_image = reader.result;
			setUrl2(uploaded_image)
			// console.log(uploaded_image)
		});
		if(image_input){
			reader.readAsDataURL(image_input.files[0]);	
		}		
	}



	return (
		<div className="md:pt-[100px] pt-[100px] flex flex-col w-[100%] md:w-[60%] mx-auto h-full">
			<div className="flex items-center gap-1 md:px-0 px-3 cursor-pointer">
				<AiOutlineLeft className="h-5 w-5 text-sky-500"/>
				<h1 
				onClick={()=>setEdit(false)}
				className="text-md font-semibold text-sky-500">Back</h1>
			</div>
			<div className="w-100 mt-7 md:border-[1px] border-gray-400/50 rounded-2xl">
				<div className="w-full md:px-10 px-5 py-5 flex justify-between items-center">
					<div className="flex flex-col gap-1 md:w-[50%] w-[90%]">
						<h1 className="text-xl dark:text-gray-300 text-gray-900 font-semibold">Change Info</h1>
						<p className="font-semibold text-sm text-gray-500">Changes will be reflected to every services</p>
					</div>
				</div>
				<div className="w-full md:px-10 px-5 py-5 flex gap-7 items-center">
					<div className="relative overflow-hidden cursor-pointer">
						<div className={`absolute ${loader && 'animate-pulse'} bg-black/20 rounded-2xl h-full w-full`}/>
						<input type="file" id="file1" hidden accept="image/*" value={path2} onChange={(e)=>{
							setPath2(e.target.value);url1Setter();
						}} />
						<AiFillCamera onClick={()=>{
							if(!loader){
								openInput();
							}
						}} className={`absolute ${loader && 'animate-pulse'} mx-auto top-0 right-0 left-0 bottom-0 m-auto h-7 w-7 text-gray-200`}/>
						<img src={photo} alt=""
						className="h-[60px] w-[60px] rounded-2xl"
						/>
					</div>
					<h1 className="text-gray-500 font-semibold text-md cursor-pointer">CHANGE PHOTO</h1>					
				</div>
				<div className="w-full md:px-10 px-5 py-2  flex gap-1 flex-col justify-center">
					<div className="">
						<h1 className="text-gray-800 dark:text-gray-300 text-md">Name</h1>
					</div>
					<div className="px-4 py-3 md:w-[60%] w-[100%] border-[1px] dark:border-gray-300/60  border-gray-500/60 focus-within:border-gray-700/90 focus-within:dark:border-gray-200/90 rounded-2xl">
						<input type="text" 
						placeholder="Enter your name"
						value={name}
						onChange={(e)=>setName(e.target.value)}
						className="w-full outline-none ring-none bg-transparent"/>
					</div>
				</div>
				<div className="w-full md:px-10 px-5 py-2  flex gap-1 flex-col justify-center">
					<div className="">
						<h1 className="text-gray-800 dark:text-gray-300 text-md">Bio</h1>
					</div>
					<div className="px-4 py-3 md:w-[60%] w-[100%] border-[1px] dark:border-gray-300/60  border-gray-500/60 focus-within:border-gray-700/90 focus-within:dark:border-gray-200/90 rounded-2xl">
						<textarea type="text" 
						placeholder="Enter your bio"
						value={bio}
						onChange={(e)=>setBio(e.target.value)}
						className="w-full outline-none resize-none ring-none bg-transparent"/>
					</div>
				</div>
				<div className="w-full md:px-10 px-5 py-2  flex gap-1 flex-col justify-center">
					<div className="">
						<h1 className="text-gray-800 dark:text-gray-300 text-md">Phone</h1>
					</div>
					<div className="px-4 py-3 md:w-[60%] w-[100%] border-[1px] dark:border-gray-300/60  border-gray-500/60 focus-within:border-gray-700/90 focus-within:dark:border-gray-200/90 rounded-2xl">
						<input type="text" 
						value={mobile}
						onChange={(e)=>setMobile(e.target.value)}
						placeholder="Enter your mobile number"
						className="w-full outline-none ring-none bg-transparent"/>
					</div>
				</div>
				<div className="w-full md:px-10 px-5 py-2  flex gap-1 flex-col justify-center">
					<div className="">
						<h1 className="text-gray-800 dark:text-gray-300 text-md">Email</h1>
					</div>
					<div className="px-4 py-3 md:w-[60%] w-[100%] border-[1px] dark:border-gray-300/60  border-gray-500/60 focus-within:border-gray-700/90 focus-within:dark:border-gray-200/90 rounded-2xl">
						<input type="text" 
						placeholder="Enter your Mail id"
						value={email}
						onChange={(e)=>setEmail(e.target.value)}
						className="w-full outline-none ring-none bg-transparent"/>
					</div>
				</div>
				{
					!currentUser.gmailAccount &&
					<div className="w-full md:px-10 px-5 py-2  flex gap-3 flex-col justify-center">
						<div className="">
							<h1 className="text-gray-800 dark:text-gray-300 text-md">Password</h1>
						</div>
						<div className="px-4 py-3 md:w-[60%] w-[100%] border-[1px] dark:border-gray-300/60  border-gray-500/60 focus-within:border-gray-700/90 focus-within:dark:border-gray-200/90 rounded-2xl">
							<input type="password" 
							placeholder="Enter your new password"
							value={password}
							onChange={(e)=>setPassword(e.target.value)}
							className="w-full outline-none ring-none bg-transparent"/>
						</div>
					</div>			
				}
				<div className="px-5 md:px-10 py-4 pb-10 ">
					<button 
					onClick={()=>{
						if(!loader){
							updateInformation();
						}
					}}
					className={`px-7 py-2 ${loader ? "bg-blue-200 cursor-default":"bg-blue-500 cursor-pointer"} rounded-2xl text-white`}>Save</button>
				</div>
			</div>
			<h2 className="text-md mx-auto text-gray-500 font-semibold mt-5 mb-[100px] ">
				Created by <span className="text-gray-800 dark:text-gray-200"><u>Thejas hari</u></span>
			</h2>
		</div>

	)
}