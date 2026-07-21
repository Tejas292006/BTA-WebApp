import React from 'react'
import { useRecoilValue } from 'recoil'
import { userAtom } from '../../store/user/userAtom'

const Home = () => {
  const user = useRecoilValue(userAtom)

  return (
    <div className='flex justify-center items-center'>
      <h1 className='mt-20 font-font2 font-[600] text-[4rem] '>Welcome back {user?.username} &#128075;</h1>
    </div>
  )
}

export default Home
