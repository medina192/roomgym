
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import axios from 'axios';

import { useDispatch, useSelector } from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';

import TopBar from '../../shared/TopBar';

import { createDrawerNavigator } from '@react-navigation/drawer';

import SideBarUser from '../../shared/SideBarUser';
import BottomBar from '../../shared/BottomBarUser';

import Colors  from '../../../colors/colors';

import { saveCurrentExercise } from '../../../store/actions/actionsReducer';


import { urlServer } from '../../../services/urlServer';


const Drawer = createDrawerNavigator();


export default function CurrentRoutine() {


  return (
    <>
      <Drawer.Navigator drawerContent={(props) => <SideBarUser {...props} />}>
        <Drawer.Screen name="CurrentRoutine" component={CurrentRoutineScreen }/>
      </Drawer.Navigator>
    </>
  );
}


/*
const CurrentRoutineScreen = ({navigation}) => {

  
  const serverUrl = urlServer.url;


  const userInformation = useSelector(state => state.user);
  const trainerInformation = useSelector(state => state.trainer);


  const dataExercise = useSelector(state => state.currentExercise);
  const currentExercise = dataExercise.exercise;
  const currentIndex = dataExercise.index;
  const currentRoutine = useSelector(state => state.currentRoutine);


 


  const [state, setState] = useState({
    timerStart: false,
    stopwatchStart: false,
    totalDuration: 90000,
    timerReset: false,
    stopwatchReset: false,
  })
 
  const toggleTimer = () => {
    setState({timerStart: state.timerStart, timerReset: false});
  }
 
  const resetTimer = ()=> {
    setState({timerStart: false, timerReset: true});
  }
 
  const toggleStopwatch = () => {
    setState({stopwatchStart: state.stopwatchStart, stopwatchReset: false});
  }
 
  const resetStopwatch = () => {
    setState({stopwatchStart: false, stopwatchReset: true});
  }
  
  const getFormattedTime = (time) => {
      currentTime = time;
  };
 

    return (
      <View>
        <Stopwatch laps msecs start={state.stopwatchStart}
          reset={state.stopwatchReset}
          options={options}
          getTime={getFormattedTime} />
        <TouchableHighlight onPress={toggleStopwatch}>
          <Text style={{fontSize: 30}}>{!state.stopwatchStart ? "Start" : "Stop"}</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={resetStopwatch}>
          <Text style={{fontSize: 30}}>Reset</Text>
        </TouchableHighlight>
        <Timer totalDuration={state.totalDuration} msecs start={state.timerStart}
          reset={state.timerReset}
          options={options}
          handleFinish={handleTimerComplete}
          getTime={getFormattedTime} />
        <TouchableHighlight onPress={toggleTimer}>
          <Text style={{fontSize: 30}}>{!state.timerStart ? "Start" : "Stop"}</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={resetTimer}>
          <Text style={{fontSize: 30}}>Reset</Text>
        </TouchableHighlight>
      </View>
    );
 

};

const handleTimerComplete = () => alert("custom completion function");



const options = {
  container: {
    backgroundColor: '#000',
    padding: 5,
    borderRadius: 5,
    width: 220,
  },
  text: {
    fontSize: 30,
    color: '#FFF',
    marginLeft: 7,
  }
};
*/

const CurrentRoutineScreen = ({navigation}) => {

  const serverUrl = urlServer.url;

  const dispatch = useDispatch();

  const userInformation = useSelector(state => state.user);
  const trainerInformation = useSelector(state => state.trainer);


  const dataExercise = useSelector(state => state.currentExercise);
  const currentExercise = dataExercise.exercise;
  const currentIndex = dataExercise.index;
  const currentRoutine = useSelector(state => state.currentRoutine);

  const [time, setTime] = useState(0);
  const [pause, setPause] = useState(true);
  const [repetitionsAcomplished, setRepetitionsAcomplished] = useState(0);
  const [finishExercise, setFinishExercise] = useState(false);
  const [changeExercise, setChangeExercise] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [progressMessage, setProgressMessage] = useState(false);
  const [dissabledButtonProgress, setDissabledButtonProgress] = useState(false);
 

  const playCronometer = () => {

    if(currentExercise.repetitions == repetitionsAcomplished)
    {
      setPause(false);
      setTime(0);
    }
    else{
      setPause(false);
      setTime(time + 1);
    }

  }

  const pauseCronometer = () => {
    setPause(true);
  }
 


useEffect(() => {


    const currentTime = parseInt(currentExercise.time_minutes)*60 + currentExercise.time_seconds;

    setTimeout(() => {
      if(pause)
      {
        
      }
      else{

        
        if(time == currentTime)
        {
          
          setPause(true);
          setRepetitionsAcomplished(repetitionsAcomplished + 1);
          setTime(0);
          setFinishExercise(true);
        }
        else{
          
          setTime(time + 1);
        }
      }

    }, 1000);



  }, [time]);


  useEffect(() => {
    
    return () => {
      setPause(true);
    }
  }, []);

  const changeNextRoutine = () => {
    
    
    if(currentRoutine.ejercicios.length > 1)
    {
      if(currentIndex== (currentRoutine.ejercicios.length - 1))
      { 
        setRepetitionsAcomplished(0);
        setDissabledButtonProgress(false);
        dispatch(saveCurrentExercise({exercise: currentRoutine.ejercicios[0], index: 0}));
      }
      else{
        setRepetitionsAcomplished(0);
        setDissabledButtonProgress(false);
        dispatch(saveCurrentExercise({exercise: currentRoutine.ejercicios[currentIndex + 1], index: currentIndex + 1}));
      }
    }

    

    
  }


  const changePreviousRoutine = () => {
    
    if(currentRoutine.ejercicios.length > 1)
    {
      if(currentIndex == 0)
      {
        setRepetitionsAcomplished(0);
        setDissabledButtonProgress(false);
        dispatch(saveCurrentExercise({exercise: currentRoutine.ejercicios[currentRoutine.ejercicios.length - 1], index: currentRoutine.ejercicios.length - 1}));
      }
      else{
        setRepetitionsAcomplished(0);
        setDissabledButtonProgress(false);
        dispatch(saveCurrentExercise({exercise: currentRoutine.ejercicios[currentIndex- 1], index: currentIndex - 1}));
      }
    }


  }
  


  const saveProgress = async() => {

    setLoadingProgress(true);
    try {
      const resp = await axios({
        method: 'get',
        url: `${serverUrl}/userscreens/getworkbymuscle/${userInformation.idusuario}`
      });

      setLoadingProgress(false);
      setProgressMessage(true);

      setTimeout(() => {
        setProgressMessage(false);
      }, 3000);

      const workMuscle = resp.data.resp;
      
      setDissabledButtonProgress(true);

      let auxDate = new Date();
      auxDate = JSON.stringify(auxDate);
      let currentDate = auxDate.slice(1,11);

      const minutesInt = parseInt(currentExercise.time_minutes);
      const secondsInt = parseInt(currentExercise.time_seconds);
      const repetitionsInt = parseInt(currentExercise.repetitions);

      const totalTime = ((minutesInt * 60) + secondsInt) * repetitionsInt;

      const template = {
        type: currentRoutine.tipo,
        currentDate: currentDate,
         timeInSeconds: totalTime
      }

      if(!workMuscle)
      {
        console.log('if', workMuscle);
        const body = {
          exercisesRecord: [template]
        }
        const bodyString = JSON.stringify(body);

        const templateBody = {
          bodyString
        }

        
        const response = await axios({
          method: 'post',
          url: `${serverUrl}/userscreens/updateworkbymuscle/${userInformation.idusuario}`,
          data: templateBody
        });
        
        console.log('response', response);
      }
      else{
        console.log('else', workMuscle);
        const workObject = JSON.parse(workMuscle);
        console.log('object', workObject.exercisesRecord);
        const workArray =  workObject.exercisesRecord;
        workArray.push(template);

        const body = {
          exercisesRecord: workArray
        }
        const bodyString = JSON.stringify(body);

        const templateBody = {
          bodyString
        }

        const response = await axios({
          method: 'post',
          url: `${serverUrl}/userscreens/updateworkbymuscle/${userInformation.idusuario}`,
          data: templateBody
        });
        
      }



      /*
      const resp = await axios({
        method: 'get',
        url: `${serverUrl}/userscreens/updateworkbymuscle/${userInformation.idusuario}`
      });
      */

    } catch (error) {
      console.log('error', error);
    }
  } 


    return (
      <>
        <TopBar navigation={navigation} title={currentExercise.name} returnButton={true} />
          <View style={styles.mainContainer}>
              <View style={styles.container}>
              {
                  (
                    
                    () => {
  
                      const auxInt = parseInt(currentExercise.repetitions) - repetitionsAcomplished;
                      const remainderRepetitions = auxInt.toString();
                      
                      return(
                        <>
  
                          <Text style={styles.textRemainderRepetitions}>Te faltan solo:</Text>
                          <Text style={styles.textRemainderRepetitions}>{remainderRepetitions}</Text>
                          <Text style={styles.textRemainderRepetitions}>repeticiones</Text>
                        </>
                      )
                    }
                  )()
                }
                
                {
                  (
                    
                    () => {
  
                      const auxInt = parseInt(currentExercise.repetitions) - repetitionsAcomplished;
                      const remainderRepetitions = auxInt.toString();
                      

                      let minutes = parseInt(currentExercise.time_minutes);
                      let seconds = parseInt(currentExercise.time_seconds);
                      //minutes = Math.trunc(time/60);
                      
                      if(minutes < 10)
                      {
                        minutes = '0'+minutes;
                      }
                     
                      if(seconds < 10)
                      {
                        seconds = '0'+seconds;
                      }
                      return(
                        <>
                          <View style={styles.containerRepetitions}>
                            <Text style={styles.textCronometer}>Tiempo de cada repetición</Text>
                            <Text style={styles.textCronometer}>
                              {minutes}:{seconds}
                            </Text>
                          </View>
                        </>
                      )
                    }
                  )()
                }
  
  
                {
                  (
                    
                    () => {
  
                      const integer = Math.trunc(time);
                      const t = time.toString();
  
                      if(t === '0')
                      {
        
                        return(
                          <>
                            <View style={styles.containerCronometer}>
                              <Icon name="clock-o" size={24} style={styles.iconImageClock} color="#fff" />
                              <Text style={styles.textCronometer}>00:00</Text>
                            </View>
                          </>
                        )
                      }
                      else{
  
                        //const decimal = t.split(".")[1];
                        //const decimalPart = decimal[0]+decimal[1];
                        
                        let minutes, seconds;
                        minutes = Math.trunc(time/60);
                        if(time >= 60)
                        {
                          seconds = Math.trunc(time % 60);
                        }
                        else{
                          seconds = time;
                        }
                        
                        if(minutes < 10)
                        {
                          minutes = '0'+minutes;
                        }
                        
                        if(seconds < 10)
                        {
                          seconds = '0'+seconds;
                        }
  
                        return(
                          <>
                            <View style={styles.containerCronometer}>
                              <Icon name="clock-o" size={24} style={styles.iconImageClock} color="#fff" />
                              <Text style={styles.textCronometer}>{minutes}:{seconds}</Text>
                            </View>
                          </>

                        )
                      }
                      
                    }
                  )()
                }
  
                <View style={styles.containerPlayButtons}>
                  <TouchableOpacity onPress={changePreviousRoutine}>
                        <Icon name="backward" size={24} style={styles.iconImage} color="#fff" />
                  </TouchableOpacity>
                {
                  pause ? 
                  (
                    <TouchableOpacity 
                      onPress={playCronometer} 
                      disabled={currentExercise.repetitions == repetitionsAcomplished}>
                      <Icon name="play" size={24} style={styles.iconImage} color="#fff" />
                    </TouchableOpacity>
  
                  )
                  :
                  (
                    <TouchableOpacity onPress={pauseCronometer}>
                      <Icon name="pause" size={24} style={styles.iconImage} color="#fff" />
                    </TouchableOpacity>
                  )
                }
                  <TouchableOpacity onPress={changeNextRoutine}>
                      <Icon name="forward" size={24} style={styles.iconImage} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
                {
                  currentExercise.repetitions == repetitionsAcomplished ? 
                  (
                    <View style={styles.containerFinishMessage}>
                      <Text style={styles.textFinishMessage}>Felicidades¡ Has terminado el ejercicio</Text>
                      <Icon name="trophy" size={24} style={styles.iconImageTrophy} color="#fff" />
                      <TouchableOpacity 
                        onPress={saveProgress} 
                        //disabled={dissabledButtonProgress}
                        style={styles.containerButtonContinue}>
                        <Text style={styles.textButtonConitnue}>Guardar Progreso</Text>          
                      </TouchableOpacity>
                    </View>
                  )
                  :
                  (
                    <Text></Text>
                  )
                }
                {
                  progressMessage ?
                  (
                    <View style={styles.containerProgressMessage}>
                      <View style={styles.progressMessage}>
                          <Text style={styles.textProgress}>Tu progreso ha sido guardado¡</Text>
                      </View>
                    </View>
                  )
                  :
                  (
                    <Text></Text>
                  )
                }
                {
                  loadingProgress ? 
                  (
                    <>
                    <ActivityIndicator
                      size={60}
                      color="#222"
                      style={styles.activityIndicator}
                      />
                    </>
                  )
                  :
                  (
                    <Text></Text>
                  )
                }
          </View>
        <BottomBar navigation={navigation}/>
      </>
    );

};

const styles = StyleSheet.create({
  mainContainer:{
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 10
    },
  container:{
    backgroundColor: '#000',
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  textCronometer:{
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center'
  },
  containerPlayButtons:{
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },  

  //remainderRepetitions
  textRemainderRepetitions:{
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 0
  },

  // finish message
  containerFinishMessage:{
    marginTop: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.MainBlue,
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  textFinishMessage:{
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center'
  },

  // button continue
  containerButtonContinue:{
    width: 'auto',
    backgroundColor: Colors.Orange,
    paddingVertical: 8,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    paddingHorizontal: 10
  },
  textButtonConitnue:{
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700'
  },

  // icons
  iconImageTrophy:{
    fontSize: 30,
    marginVertical: 10
  },
  iconImageClock:{
    fontSize: 30,
    marginVertical: 0
  },

  // repetitions
  containerRepetitions:{
    marginTop: 18,
    marginBottom: 10

  },

  //cronometer
  containerCronometer:{
    marginVertical: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center'
  },

  // progresss message
  containerProgressMessage:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  progressMessage:{
    backgroundColor: Colors.MainBlue,
    padding: 5,
    width: 200,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  textProgress:{
    fontSize: 18,
    color:'#fff',
    textAlign: 'center'
  },
  activityIndicator:{
    marginTop: 20
  }
});

/*
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity
} from 'react-native';

import axios from 'axios';

import { useDispatch, useSelector } from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Button, Paragraph, Dialog, Portal } from 'react-native-paper';

import TopBar from '../../compartido/TopBar';

import { createDrawerNavigator } from '@react-navigation/drawer';

import SideBarUser from '../../compartido/SideBarUser';
import BottomBar from '../../compartido/BottomBar';

import Colors  from '../../../colors/colors';

import { saveCurrentRoutine, saveCurrentExercise } from '../../../store/actions/actionsReducer';


import { urlServer } from '../../../services/urlServer';

import * as Keychain from 'react-native-keychain';
//import { Colors } from 'react-native/Libraries/NewAppScreen';

import { Stopwatch, Timer } from 'react-native-stopwatch-timer';

import { useTimer } from 'react-timer-hook';

const Drawer = createDrawerNavigator();


export default function CurrentRoutine() {


  return (
    <>
      <Drawer.Navigator drawerContent={(props) => <SideBarUser {...props} />}>
        <Drawer.Screen name="CurrentRoutine" component={CurrentRoutineScreen }/>
      </Drawer.Navigator>
    </>
  );
}



const CurrentRoutineScreen = ({navigation}) => {

  const serverUrl = urlServer.url;

  const dispatch = useDispatch();

  const userInformation = useSelector(state => state.user);
  const trainerInformation = useSelector(state => state.trainer);


  const dataExercise = useSelector(state => state.currentExercise);
  const currentExercise = dataExercise.exercise;
  const currentIndex = dataExercise.index;
  const currentRoutine = useSelector(state => state.currentRoutine);

  const [time, setTime] = useState(0);
  const [pause, setPause] = useState(true);
  const [repetitionsAcomplished, setRepetitionsAcomplished] = useState(0);
  const [finishExercise, setFinishExercise] = useState(false);
  const [changeExercise, setChangeExercise] = useState(false);
 
  const playCronometer = () => {

    if(finishExercise)
    {
      setPause(false);
      setTime(0);
    }
    else{
      setPause(false);
      setTime(time + 1);
    }

  }

  const pauseCronometer = () => {
    setPause(true);
  }
 


useEffect(() => {


    const currentTime = parseInt(currentExercise.time_minutes)*60 + currentExercise.time_seconds;

    setTimeout(() => {
      if(pause)
      {
        
      }
      else{

        
        if(time == currentTime)
        {
          
          setPause(true);
          setRepetitionsAcomplished(repetitionsAcomplished + 1);
          setFinishExercise(true);
        }
        else{
          
          setTime(time + 1);
        }
      }

    }, 1000);




  }, [time]);

  const changeNextRoutine = () => {
    
    

    if(currentIndex== (currentRoutine.ejercicios.length - 1))
    {
      dispatch(saveCurrentExercise({exercise: currentRoutine.ejercicios[0], index: 0}));
    }
    else{
      dispatch(saveCurrentExercise({exercise: currentRoutine.ejercicios[currentIndex + 1], index: currentIndex + 1}));
    }
    
  }

  const changePreviousRoutine = () => {
    

    if(currentIndex == 0)
    {
      dispatch(saveCurrentExercise({exercise: currentRoutine.ejercicios[currentRoutine.ejercicios.length - 1], index: currentRoutine.ejercicios.length - 1}));
    }
    else{
      dispatch(saveCurrentExercise({exercise: currentRoutine.ejercicios[currentIndex- 1], index: currentIndex - 1}));
    }
  }
  

  const saveProgress = async() => {

    try {
      const resp = await axios({
        method: 'get',
        url: `${serverUrl}/userscreens/getworkbymuscle/${userInformation.idusuario}`
      });

      const workMuscle = resp.data.resp;

      if(workMuscle)
      {

      }
      else{
        
      }

      
    } catch (error) {
      console.log('error', error);
    }
  } 

    return (
      <>
        <TopBar navigation={navigation} title={currentExercise.name} returnButton={true} />
          <View style={styles.mainContainer}>
              <View style={styles.container}>
              {
                  (
                    
                    () => {
  
                      const auxInt = parseInt(currentExercise.repetitions) - repetitionsAcomplished;
                      const remainderRepetitions = auxInt.toString();
                      
                      return(
                        <>
  
                          <Text style={styles.textRemainderRepetitions}>Te faltan solo:</Text>
                          <Text style={styles.textRemainderRepetitions}>{remainderRepetitions}</Text>
                          <Text style={styles.textRemainderRepetitions}>repeticiones</Text>
                        </>
                      )
                    }
                  )()
                }
                
                {
                  (
                    
                    () => {
  
                      const auxInt = parseInt(currentExercise.repetitions) - repetitionsAcomplished;
                      const remainderRepetitions = auxInt.toString();
                      console.log('cc', currentExercise.time_minutes);

                      let minutes = parseInt(currentExercise.time_minutes);
                      let seconds = parseInt(currentExercise.time_seconds);
                      //minutes = Math.trunc(time/60);
                      
                      if(minutes < 10)
                      {
                        minutes = '0'+minutes;
                      }
                      console.log('sec',seconds);
                      if(seconds < 10)
                      {
                        seconds = '0'+seconds;
                      }
                      return(
                        <>
                          <View style={styles.containerRepetitions}>
                            <Text style={styles.textCronometer}>Tiempo de cada repetición</Text>
                            <Text style={styles.textCronometer}>
                              {minutes}:{seconds}
                            </Text>
                          </View>
                        </>
                      )
                    }
                  )()
                }
  
  
                {
                  (
                    
                    () => {
  
                      const integer = Math.trunc(time);
                      const t = time.toString();
  
                      if(t === '0')
                      {
        
                        return(
                          <>
                            <View style={styles.containerCronometer}>
                              <Icon name="clock-o" size={24} style={styles.iconImageClock} color="#fff" />
                              <Text style={styles.textCronometer}>00:00</Text>
                            </View>
                          </>
                        )
                      }
                      else{
  
                        //const decimal = t.split(".")[1];
                        //const decimalPart = decimal[0]+decimal[1];
                        
                        let minutes, seconds;
                        minutes = Math.trunc(time/60);
                        if(time >= 60)
                        {
                          seconds = Math.trunc(time % 60);
                        }
                        else{
                          seconds = time;
                        }
                        
                        if(minutes < 10)
                        {
                          minutes = '0'+minutes;
                        }
                        console.log('sec',seconds);
                        if(seconds < 10)
                        {
                          seconds = '0'+seconds;
                        }
  
                        return(
                          <>
                            <View style={styles.containerCronometer}>
                              <Icon name="clock-o" size={24} style={styles.iconImageClock} color="#fff" />
                              <Text style={styles.textCronometer}>{minutes}:{seconds}</Text>
                            </View>
                          </>

                        )
                      }
                      
                    }
                  )()
                }
  
                <View style={styles.containerPlayButtons}>
                  <TouchableOpacity onPress={changePreviousRoutine}>
                        <Icon name="backward" size={24} style={styles.iconImage} color="#fff" />
                  </TouchableOpacity>
                {
                  pause ? 
                  (
                    <TouchableOpacity 
                      onPress={playCronometer} 
                      disabled={currentExercise.repetitions == repetitionsAcomplished}>
                      <Icon name="play" size={24} style={styles.iconImage} color="#fff" />
                    </TouchableOpacity>
  
                  )
                  :
                  (
                    <TouchableOpacity onPress={pauseCronometer}>
                      <Icon name="pause" size={24} style={styles.iconImage} color="#fff" />
                    </TouchableOpacity>
                  )
                }
                  <TouchableOpacity onPress={changeNextRoutine}>
                      <Icon name="forward" size={24} style={styles.iconImage} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
                {
                  currentExercise.repetitions == repetitionsAcomplished ? 
                  (
                    <View style={styles.containerFinishMessage}>
                      <Text style={styles.textFinishMessage}>Felicidades¡ Has terminado el ejercicio</Text>
                      <Icon name="trophy" size={24} style={styles.iconImageTrophy} color="#fff" />
                      <TouchableOpacity 
                        onPress={saveProgress} 
                        //disabled={currentExercise.repetitions == repetitionsAcomplished}
                        style={styles.containerButtonContinue}>
                        <Text style={styles.textButtonConitnue}>Guardar Progreso</Text>          
                      </TouchableOpacity>
                    </View>
                  )
                  :
                  (
                    <Text></Text>
                  )
                }
          </View>
        <BottomBar navigation={navigation}/>
      </>
    );

};
*/
/*
const styles = StyleSheet.create({
  mainContainer:{
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 10
    },
  container:{
    backgroundColor: '#000',
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  textCronometer:{
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center'
  },
  containerPlayButtons:{
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },  

  //remainderRepetitions
  textRemainderRepetitions:{
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 0
  },

  // finish message
  containerFinishMessage:{
    marginTop: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.MainBlue,
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  textFinishMessage:{
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center'
  },

  // button continue
  containerButtonContinue:{
    width: 'auto',
    backgroundColor: Colors.Orange,
    paddingVertical: 8,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    paddingHorizontal: 10
  },
  textButtonConitnue:{
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700'
  },

  // icons
  iconImageTrophy:{
    fontSize: 30,
    marginVertical: 10
  },
  iconImageClock:{
    fontSize: 30,
    marginVertical: 0
  },

  // repetitions
  containerRepetitions:{
    marginTop: 18,
    marginBottom: 10

  },

  //cronometer
  containerCronometer:{
    marginVertical: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center'
  },
});
*/