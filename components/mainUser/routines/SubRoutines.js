import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import axios from 'axios';

import { useDispatch, useSelector } from 'react-redux';

import { Button, Paragraph, Dialog, Portal } from 'react-native-paper';

import TopBar from '../../shared/TopBar';

import { createDrawerNavigator } from '@react-navigation/drawer';

import SideBarUser from '../../shared/SideBarUser';
import BottomBar from '../../shared/BottomBarUser';

import CheckBox from '@react-native-community/checkbox';

import Colors  from '../../../colors/colors';

import { saveCurrentRoutine } from '../../../store/actions/actionsReducer';

import { urlServer } from '../../../services/urlServer';


const Drawer = createDrawerNavigator();


export default function SubRoutines() {


  return (
    <>
      <Drawer.Navigator drawerContent={(props) => <SideBarUser {...props} />}>
        <Drawer.Screen name="SubRoutines" component={SubRoutinesScreen}/>
      </Drawer.Navigator>
    </>
  );
}



const SubRoutinesScreen = ({navigation}) => {


  const serverUrl = urlServer.url;

  const dispatch = useDispatch();


  const [routineName, setRoutineName] = useState('');
  const subRoutine = useSelector(state => state.subRoutine);
  const userInformation = useSelector(state => state.user);
  console.log('sub', subRoutine);
  
  const [state, setState] = useState(false);
  const [routines, setRoutines] = useState(subRoutine.routines);
  const [visible, setVisible] = useState(false);
  const [visibleRoutines, setVisibleRoutines] = useState(false);
  const [visibleTime, setVisibleTime] = useState(false);
  const [nameExists, setNameExists] = useState(false);


  const clearCheckBoxes = () => {

    for(let i = 0; i < routines.length; i++)
    {
      routines[i].selected = false;
    }
  }

  useEffect(() => {
    clearCheckBoxes();
    return () => {
      clearCheckBoxes();
    }
  }, []);

  





 

  const changeCheckbox = (item,index) => {
    
    routines[index].selected = !item;
    setRoutines(routines);
    setState(!state);
  }

  const changeToRoutine = (routine) => {
    dispatch(saveCurrentRoutine(routine));
    navigation.navigate('CurrentRoutine');
  }



  
  const saveRoutine = () => {

    let verifyRoutinesExists = false;
    for(let i = 0; i< routines.length; i++)
    {
      if(routines[i].selected)
      {
        verifyRoutinesExists = true;
        break;
      }
    }

    if(verifyRoutinesExists)
    {
  
      if(routineName)
      {
        let routinesSelected = [];
        for(let i = 0; i< routines.length; i++)
        {
          if(routines[i].selected)
          {
            routinesSelected.push(routines[i]);
          }
        }
        
        let auxRoutinesRepetitions = true;
        let auxTimeRoutines = true;
        for(let i = 0; i < routinesSelected.length; i++)
        {
          if(routinesSelected[i].repetitions == '0' || routinesSelected[i].repetitions == '' )
          {
            auxRoutinesRepetitions = false;
            break;
          }

          if((routinesSelected[i].time_minutes == '0' && routinesSelected[i].time_seconds == '0')
           || routinesSelected[i].time_minutes == '' || routinesSelected[i].time_seconds == '')
          {
            auxTimeRoutines = false;
            break;
          }
        }


        if(auxRoutinesRepetitions)
        {

          if(auxTimeRoutines)
          {
           
            const routinesString = JSON.stringify(routinesSelected);
            console.log('o', userInformation);
            const auxObject = {
              ejercicios: routinesString,
              idUsuario: userInformation.idusuario,
              tipo: subRoutine.name,
              nombre: routineName
            };                  
            axios({
              method: 'post',
              url: `${serverUrl}/relations/saveroutinebytrainer`,
              data: auxObject
            })
            .then(function (response) {
                console.log('routine',response.data.resp);
                clearCheckBoxes();
                navigation.navigate('MainUserScreen');
            })
            .catch(function (error) {
                console.log('error axios',error);
            });
            
          }
          else{

          }
        }
        else{

        }
      }
      else{

      }
     
    }
    else{
      console.log('there is no routines');

    }    
  }
  



  const setValuesInputs = (text, index, type) => {

    switch (type) {
      case 'routines':
        routines[index].repetitions = text; 
        setRoutines(routines);
        setState(!state);
        break;
      case 'minutes':
        routines[index].time_minutes = text; 
        setRoutines(routines);
        setState(!state);
        break;
      case 'seconds':
        routines[index].time_seconds = text; 
        setRoutines(routines);
        setState(!state);
        break;
    
      default:
        break;
    }
  }

console.log('sub', subRoutine.routines);
  return (
    <View style={{flex: 1, position: 'relative'}}>
      <TopBar navigation={navigation} title={subRoutine.name} returnButton={true} />

        <View style={styles.containerScrollView}>
          <ScrollView>

          </ScrollView>
        </View>


        <View style={styles.containerSaveButton}>
            <TouchableOpacity style={styles.saveButton} onPress={saveRoutine}>
              <Text style={styles.textSaveButton}>Guardar Rutina</Text>
            </TouchableOpacity>
        </View>
      <BottomBar navigation={navigation}/>
    </View>
  );
};



const styles = StyleSheet.create({
    containerScrollView:{
        flex: 1,
      },
      containerInput:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },

      //inputs
      containerInputs:{
        //paddingHorizontal: 25,
        //marginBottom: 20,
        display: 'flex',
        flexDirection: 'row',
        //justifyContent: 'space-around',
        //alignItems: 'flex-end',
      },
      containerNumberRoutineInput:{
        width: '30%'
      },
      containerInputTime:{
        width: '25%'
      },
      textNumberRoutine:{
        fontSize: 16
      },
      inputNumberRoutine:{
        backgroundColor: '#fff',
        fontSize: 15,
        width: '60%'
      },
      textTime:{
        fontSize: 16
      },  


      containerTouchableImage:{
        height: 150,
        width: '100%',
        backgroundColor: '#fff',
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 25,
        marginBottom: 10
      },
      containerIconInput:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%',
        backgroundColor: '#fff',
        paddingVertical: 0,
        marginVertical: 10,
        //borderColor: '#FB5012',
        borderColor: Colors.MainBlue,
        borderBottomWidth: 2,
        paddingHorizontal: 0
      },
      inputRegister:{
        backgroundColor: '#fff',
        width: '90%',
        fontSize: 18,
        marginLeft: 5,
        //borderRightWidth: 1,
        //borderLeftWidth: 1,
        //borderTopWidth: 1,
        //borderBottomRightRadius: 3,
        //borderBottomLeftRadius: 3,
        //borderTopLeftRadius: 3,
        //borderTopRightRadius: 3
      },
      touchableContainerImage:{
        height: '100%',
        width: '100%',
        backgroundColor: '#123456',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        overflow: 'hidden', 
      },
      imageButton: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
      },
      textImageButton:{
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#244EABa0"
      },  
      containerTextDescriptionButton:{
        paddingHorizontal: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems:'center'
      },
      textDescriptionButton:{
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '700'
      },
      textDescriptionButtonSubtitle:{
        fontSize: 14,
        marginTop: 5
      },

            // save button
            containerSaveButton:{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 5,
              backgroundColor: '#00000000'
            },
            saveButton:{
              width: '70%',
              backgroundColor: Colors.Orange,
              paddingVertical: 10
            },
            textSaveButton:{
              fontSize: 18,
              color: '#fff',
              fontWeight: '700',
              textAlign: 'center'
            }
});
