import React from 'react';
import styles from './dashboard.module.css'
import Calendar from './calendar/Calendar';
import ClientChart from './clientChart/ClientChart';
import ClientList from './clientList/ClientList';
import MealPlans from './mealPlans/MealPlans';
import NextEvents from './nextEvents/NextEvents';
import PredesignWorkout from './predesignWorkout/PredesignWorkout';
import Products from './products/Products';
import PtInfo from './PtInfo/PtInfo';
import UpcomingMeetings from './upcomingMeetings/UpcomingMeetings';


const Dashboard = () => {
  return (
    <div className={styles.container} >
     
         <PtInfo />
         <ClientChart />
         <UpcomingMeetings />
         <Calendar />
         <ClientList />
         <PredesignWorkout />
         <MealPlans />
         <NextEvents />
         <Products />
      
    </div>
  )
}

export default Dashboard;