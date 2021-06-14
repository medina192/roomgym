/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';

import {
  StyleSheet,
} from 'react-native';


import { NavigationContainer, DrawerN } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import { Provider as PaperProvider } from 'react-native-paper';
import {Provider} from 'react-redux';
import { createStore } from 'redux';
import { mainReducer } from './store/reducers/mainReducer';

// log in components
import AskScreen from './components/login/AskScreen';
import Login from './components/login/Login';

// register
import Register from './components/register/Register';
import ChooseRole from './components/register/ChooseRole';
import SaveSessionQuestion from './components/login/SaveSessionQuestion';

//main user
import MainUserScreen from './components/mainUser/MainUserScreen';
import MessageUser from './components/mainUser/MessageUser';
import CustomPlan from './components/mainUser/CustomPlan';
import Routines from './components/mainUser/Routines';
import MainUserGeneralScreen from './components/mainUser/mainGeneralUser/MainUserGeneralScreen';
import ListMyTrainers from './components/mainUser/listTrainersComponents/ListMyTrainers';
import TrainerCard from './components/mainUser/listTrainersComponents/TrainerCard';
import TrainerProfile from './components/mainUser/listTrainersComponents/TrainerProfile';
import ListTrainers from './components/mainUser/ListTrainers';
import SubRoutinesGeneral from './components/mainUser/routines/SubRoutinesGeneral';
import SubRoutines from './components/mainUser/routines/SubRoutines';
import SubCategories from './components/mainUser/routines/SubCategories';
import DisplayRoutine from './components/mainUser/routines/DisplayRoutine';
import CurrentRoutine from './components/mainUser/routines/CurrentRoutine';
import Statistics from './components/mainUser/Statistics';

// main trainer
import UserProfile from './components/mainTrainer/UserProfile';
import MessageTrainer from './components/mainTrainer/MessageTrainer';
import MainTrainerScreen from './components/mainTrainer/MainTrainerScreen';
import ListUsers from './components/mainTrainer/ListUsers';
import CardUser from './components/mainTrainer/CardUser';
import CreateRoutines from './components/mainTrainer/routines/CreateRoutines';
import CreateNotes from './components/mainTrainer/notes/CreateNote';
import CreatePdf from './components/mainTrainer/notes/CreatePdf';
import WatchPdf from './components/mainUser/documents/WatchPdf';
import WatchVideo from './components/mainUser/documents/WatchVideo';
import UserDocuments from './components/mainUser/documents/UserDocuments';
import CreateGym from './components/gyms/CreateGym';
import MyGymTrainer from './components/gyms/MyGymTrainer';
import UploadPdf from './components/mainTrainer/notes/UploadPdf';

import SplashScreen from 'react-native-splash-screen'
import ListGyms from './components/gyms/ListGyms';
import GymProfile from './components/gyms/GymProfile';
import StatisticsUserGeneral from './components/mainUser/statistics/StatistcisGeneralUser';

const Stack = createStackNavigator();

const store = createStore(mainReducer);

const App = () => {

  let initialRoute = 'AskScreen';

  useEffect(() => {
    SplashScreen.hide();
  }, []);


  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={initialRoute}>
            {
              //  Log in
            }
            <Stack.Screen 
              name="AskScreen"
              component={AskScreen}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="Login"
              component={Login}
              options={{
                header: () => null
              }}
            />

            {
              // register
            }
            <Stack.Screen 
              name="Register"
              component={Register}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="ChooseRole"
              component={ChooseRole}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="SaveSessionQuestion"
              component={SaveSessionQuestion}
              options={{
                header: () => null
              }}
            />

            {
              // main user
            }
            <Stack.Screen 
              name="MainUserScreen"
              component={MainUserScreen}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="MainUserGeneralScreen"
              component={MainUserGeneralScreen}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="MessageUser"
              component={MessageUser}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="CustomPlan"
              component={CustomPlan}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="Routines"
              component={Routines}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="ListMyTrainers"
              component={ListMyTrainers}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="TrainerCard"
              component={TrainerCard}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="TrainerProfile"
              component={TrainerProfile}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="ListTrainers"
              component={ListTrainers}
              options={{
                header: () => null
              }}
            />
            
            {
              // user routines
            }
            <Stack.Screen 
              name="SubRoutinesGeneral"
              component={SubRoutinesGeneral}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="SubRoutines"
              component={SubRoutines}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="SubCategories"
              component={SubCategories}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="DisplayRoutine"
              component={DisplayRoutine}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="CurrentRoutine"
              component={CurrentRoutine}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="Statistics"
              component={Statistics}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="StatisticsUserGeneral"
              component={StatisticsUserGeneral}
              options={{
                header: () => null
              }}
            />


            {
              // main Trainer
            }
            <Stack.Screen 
              name="UserProfile"
              component={UserProfile}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="MessageTrainer"
              component={MessageTrainer}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="MainTrainerScreen"
              component={MainTrainerScreen}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="ListUsers"
              component={ListUsers}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="CardUser"
              component={CardUser}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="CreateRoutines"
              component={CreateRoutines}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="CreateNotes"
              component={CreateNotes}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="CreatePdf"
              component={CreatePdf}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="WatchPdf"
              component={WatchPdf}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="WatchVideo"
              component={WatchVideo}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="UserDocuments"
              component={UserDocuments}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="UploadPdf"
              component={UploadPdf}
              options={{
                header: () => null
              }}
            />

              {
                // gyms
              }
            <Stack.Screen 
              name="CreateGym"
              component={CreateGym}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="MyGymTrainer"
              component={MyGymTrainer}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="ListGyms"
              component={ListGyms}
              options={{
                header: () => null
              }}
            />
            <Stack.Screen 
              name="GymProfile"
              component={GymProfile}
              options={{
                header: () => null
              }}
            />

          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  )
};

const styles = StyleSheet.create({

});

export default App;
