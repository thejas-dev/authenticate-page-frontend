import {BiPlusCircle} from 'react-icons/bi';
import {useState,useEffect} from 'react';	
import {useRecoilState} from 'recoil'
import {currentUserState,editState} from '../atoms/userAtom';
import {useRouter} from 'next/navigation';
import {updateImages} from '../utils/ApiRoutes';
import axios from 'axios';
import ImageKit from "imagekit";
import {AiOutlineDelete} from 'react-icons/ai';

export default function Information() {
	// body...
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [edit,setEdit] = useRecoilState(editState);
	const [path2,setPath2] = useState('');
	const [url2,setUrl2] = useState('');
	const [loader,setLoader] = useState(false);
	const [imagesArray,setImagesArray] = useState([]);
	const [passStar,setPassStar] = useState('')
	const router = useRouter();

	const imagekit = new ImageKit({
	    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_ID,
	    privateKey : process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
	    urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT
	})

	useEffect(()=>{
		if(!currentUser){
			router.push('/');
		}
		if(currentUser){
			setImagesArray(currentUser.images)
		}
	},[])

	useEffect(()=>{
		let newStar = ""
		if(currentUser.password){
			for(let i = 0 ; i< currentUser.password.length ; i++){
				newStar = newStar + '*';
				setPassStar(newStar);
			}
			setPassStar(newStar);			
		}
	},[currentUser.password])

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
				    const imgArray = [response.url, ...imagesArray];
				    updateImageToUser(imgArray);
				    setImagesArray([response.url, ...imagesArray]);
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

	const oddOrEven = (num) => {
		console.log(num)
		if(num%2===0){
			return true
		}else{
			return false
		}
	}

	const deleteImage = (i) => {
		const images = [...imagesArray];
		images.splice(i,1);
		setImagesArray([...images]);
		updateImageToUser(images);
	}

	const updateImageToUser = async(imgArray) => {
		const images = imgArray;
		console.log(images);
		const {data} = await axios.post(`${updateImages}/${currentUser._id}`,{
			images
		})
		setCurrentUser(data.obj);
		console.log(data.obj)
	}


	const openInput = () => {
		document.getElementById('file1').click();
	}

	return (
		<div className="md:pt-[80px] pt-[100px] flex flex-col">
			<h1 className="text-3xl font-semibold text-center dark:text-gray-100 text-black">Personal info</h1> 
			<p className="text-md text-gray-800 dark:text-gray-400 text-center mt-2">Basic info, like your name and photo</p>
			<div className="md:w-[60%] w-100 mt-7 md:border-[1px] border-gray-400/50 mx-auto rounded-2xl">
				<div className="w-full md:px-10 px-5 py-5 flex justify-between items-center border-b-[1px] border-gray-400/50">
					<div className="flex flex-col gap-1 w-[50%]">
						<h1 className="text-xl dark:text-gray-300 text-gray-900 font-semibold">Profile</h1>
						<p className="font-semibold text-sm text-gray-500">Some info may be visible to other people</p>
					</div>
					<div className="">
						<button 
						onClick={()=>setEdit(true)}
						className="px-8 py-2 rounded-2xl dark:border-gray-300/80 dark:text-gray-300/80 border-gray-500/80 text-gray-500/80 
						hover:border-sky-500 font-semibold border-[1px] hover:text-sky-500 transition-all duration-100 ease-in">
							Edit
						</button>
					</div>
				</div>
				<div className="w-full md:px-10 px-5 py-4 flex items-center border-b-[1px] border-gray-400/50">
					<div className="flex flex-col gap-1 w-[30%]">
						<h1 className="text-md dark:text-gray-300/60 text-gray-500/60">PHOTO</h1>
					</div>
					<div className="w-[70%] flex md:justify-start justify-end">
						<img src={currentUser.photo}
						alt=""
						className="h-[60px] w-[60px] rounded-2xl"
						/>
					</div>
				</div>
				<div className="w-full md:px-10 px-5 py-4 flex items-center border-b-[1px] border-gray-400/50">
					<div className="flex flex-col gap-1 w-[30%]">
						<h1 className="text-md dark:text-gray-300/60 text-gray-500/60">NAME</h1>
					</div>
					<div className="w-[70%] flex md:justify-start justify-end">
						<h1 className="text-black dark:text-gray-300 text-lg ">{currentUser.name}</h1>
					</div>
				</div>
				<div className="w-full md:px-10 px-5 py-4 flex items-center border-b-[1px] border-gray-400/50">
					<div className="flex flex-col gap-1 w-[30%]">
						<h1 className="text-md dark:text-gray-300/60 text-gray-500/60">BIO</h1>
					</div>
					<div className="w-[70%] flex md:justify-start justify-end">
						<h1 className="text-black md:text-start text-end text-lg dark:text-gray-300">{currentUser.bio}</h1>
					</div>
				</div>
				<div className="w-full md:px-10 px-5 py-4 flex items-center border-b-[1px] border-gray-400/50">
					<div className="flex flex-col gap-1 w-[30%]">
						<h1 className="text-md dark:text-gray-300/60 text-gray-500/60">MOBILE</h1>
					</div>
					<div className="w-[70%] flex md:justify-start justify-end">
						<h1 className="text-black text-lg dark:text-gray-300">{currentUser.mobile}</h1>
					</div>
				</div>
				<div className="w-full md:px-10 px-5 py-4 flex items-center border-b-[1px] border-gray-400/50">
					<div className="flex flex-col gap-1 w-[30%]">
						<h1 className="text-md dark:text-gray-300/60 text-gray-500/60">EMAIL</h1>
					</div>
					<div className="w-[70%] flex md:justify-start justify-end">
						<h1 className="text-black text-lg dark:text-gray-300">{currentUser.email}</h1>
					</div>
				</div>
				{
					!currentUser.gmailAccount &&
					<div className="w-full md:px-10 px-5 py-4 flex rounded-2xl items-center border-b-[1px] border-gray-400/50">
						<div className="flex flex-col gap-1 w-[30%]">
							<h1 className="text-md dark:text-gray-300/60 text-gray-500/60">PASSWORD</h1>
						</div>
						<div className="w-[70%] flex md:justify-start justify-end">
							<h1 className="text-black text-lg dark:text-gray-300">{passStar}</h1>
						</div>
					</div>					
				}
			</div>
			<div className="md:w-[60%] w-100 mx-auto mt-7">
				<h1 className="text-xl ml-5 md:text-2xl font-semibold text-gray-500 dark:text-gray-300">Your Gallery</h1>
				<div className="mt-5 p-5 gap-5 md:border-[1.5px] rounded-md border-gray-300 dark:border-gray-700 grid md:grid-cols-2 grid-cols-1">
					{
						imagesArray?.map((images,i)=>(
							<div className="relative">
								<div className="absolute group flex items-start justify-end p-2 bg-gray-900/0 hover:bg-gray-900/40 cursor-pointer transition-all duration-100 ease-out h-full w-full rounded-md">
									<AiOutlineDelete 
									onClick = {()=>deleteImage(i)}
									className="h-7 w-7 text-red-400 dark:text-red-500 group-hover:opacity-100 opacity-0 hover:scale-105 transition-all duration-100 ease-in-out "/>
								</div>
								<img src={images} alt="not found" className={`rounded-md h-full 
								cursor-pointer hover:scale-105 transition-all duration-100 ease-out shadow-xl`}/>
							</div>
						))
					}
					<div 
					onClick={()=>{
						if(!loader){
							openInput();
						}
					}}
					className={`md:h-full md:w-full h-[200px] cursor-pointer hover:scale-105 transition-all duration-100 ease-out
					${oddOrEven(imagesArray.length) ? "md:h-[250px]" : ""} ${loader && 'animate-pulse'}
					shadow-xl w-full flex flex-col items-center justify-center bg-gray-400 dark:bg-gray-900 rounded-md`}>
						<BiPlusCircle className="h-[70px] w-[70px] text-gray-200 dark:text-gray-300"/>
						<h1 className="text-2xl font-semibold text-gray-200 dark:text-gray-300 mt-2">Add New</h1>
						<input type="file" id="file1" hidden accept="image/*" value={path2} onChange={(e)=>{
							setPath2(e.target.value);url1Setter();
						}} />
					</div>
				</div>
			</div>
			<h2 className="text-md text-gray-500 font-semibold mt-14 mb-[100px] text-center">
				Created by <span className="text-gray-800 dark:text-gray-200"><u>Thejas hari</u></span>
			</h2>
		</div>

	)


}





