import Main from '../components/Main';
import {useEffect,useState} from "react"
import {useRouter} from 'next/navigation';
import {useSession,getProviders} from 'next-auth/react';
import axios from 'axios';
import {useRecoilState} from 'recoil'
import {currentUserState} from '../atoms/userAtom'
import {loginGmail,registerGmail} from '../utils/ApiRoutes';

export default function Home({providers}) {
  const router = useRouter();
  const [ready,setReady] = useState(false)
  const {data:session} = useSession();
  const id = "google"
  // Object.values(providers).map((provider)=>provider.id)
  const [currentUser,setCurrentUser] = useRecoilState(currentUserState)

  const redirect = () => {
    router.push('/home');
  }

  useEffect(()=>{
    if(session){
      if(!ready){
        setReady(true)
      }
      localStorage.setItem('authenticate-page-google',JSON.stringify(session.user.name))
      handleValidation()
    }
  },[session]);

  const handleValidation = async() =>{
    let email = session?.user.email
    const {data} = await axios.post(loginGmail,{
      email,
    });
    if(data.status === false){
      const {data} = await axios.post(registerGmail,{
        email
      })
      if(!localStorage.getItem('authenticate-page-google')){
        localStorage.setItem('authenticate-page-google',JSON.stringify(data?.user?.username));
      }
      setCurrentUser(data.user);
      console.log(data.user);
      redirect();
    }else{
      if(!localStorage.getItem('authenticate-page-google')){
        localStorage.setItem('authenticate-page-google',JSON.stringify(data?.user?.username));
      }
      setCurrentUser(data?.user);
      redirect();
    }
  }

  return (
    <main>  
        <Main id={id}/>
    </main>
  )
}

export async function getServerSideProps(context){
  const providers = await getProviders();
  // const session = await getSession(context);
  return{
    props: {
      providers,
    }
  }
}
