import React from 'react';
import { redirect } from 'react-router-dom';


export function loader(request, currentUser){
  if (!currentUser){
    return redirect(`/login?redirectTo=/today-list`);
  }
  return null;
}

function TodayList() {
  return (
    <div>TodayList</div>
  )
}

export default TodayList