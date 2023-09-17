import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext';

function Home() {
  const { currentData } = useData();
  return (
    <div>{currentData?.email}</div>
  )
}

export default Home