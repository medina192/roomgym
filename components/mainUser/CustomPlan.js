import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import axios from 'axios';

import { useDispatch, useSelector } from 'react-redux';

import TopBar from '../shared/TopBar';

import {urlServer} from '../../services/urlServer';

import { createDrawerNavigator } from '@react-navigation/drawer';

import SideBarUser from '../shared/SideBarUser';
import  Colors  from '../../colors/colors';

import { saveCurrentRoutine } from '../../store/actions/actionsReducer';

import BottomBar from '../shared/BottomBarUser';


const Drawer = createDrawerNavigator();


export default function CustomPlan() {
  return (
    <>
      <Drawer.Navigator drawerContent={(props) => <SideBarUser {...props} />}>
        <Drawer.Screen name="CustomPlan" component={CustomPlanScreen} />
      </Drawer.Navigator>
    </>
  );
}



const CustomPlanScreen = ({navigation}) => {

  const serverUrl = urlServer.url;

  const dispatch = useDispatch();

  const [routines, setRoutines] = useState([]);
  const [state, setstate] = useState(false);
 

  useEffect(() => {
    
    getRoutines();
  }, []);

  const user = useSelector(state => state.user);



  const getRoutines = async() => {

try {
  const response = await axios({
    method: 'get',
    url: `${serverUrl}/relations/getroutinesbyuser/${user.idusuario}`,
  });

  getTrainersOfRoutines(response.data.resp);
} catch (error) {
  console.log(error);
}

    /*
    axios({
      method: 'get',
      url: `${serverUrl}/relations/getroutinesbyuser/${user.idusuario}`,
    })
    .then(function (response) {
        
      getTrainersOfRoutines(response.data.resp);
        
        //
        if(response.data.resp.length > 0)
        {
          const routinesString = response.data.resp;
          
          let r = JSON.parse(response.data.resp[0].rutinas);
          console.log('ey',r[0]);
          setRoutines(routinesString);
        }
        //
    })
    .catch(function (error) {
        console.log('error get routines  axios',error);
    });
    */
  }


  const getTrainersOfRoutines = async(routinesResp) => {

    for(let i = 0; i < routinesResp.length; i++)
    {
      if(routinesResp[i].id_relacion_entrenador_usuario)
      {
        const resp = await  axios({
          method: 'get',
          url: `${serverUrl}/relations/gettrainersofroutines/${routinesResp[i].id_relacion_entrenador_usuario}`,
        });
        routinesResp[i].trainer = resp.data.resp[0];
        
      }

    }
    setRoutines(routinesResp);
    setstate(true);
  }



  const changeScreen = (routine) => {

    if(routine.ejercicios === Object(routine.ejercicios))
    {

    }
    else{

      routine.ejercicios = JSON.parse(routine.ejercicios);
    }
    
    
    dispatch(saveCurrentRoutine(routine));
    navigation.navigate('DisplayRoutine');
  }



  return (
    <>
      <TopBar navigation={navigation} title={`Mi plan personalizado`} returnButton={true} />
      <ScrollView style={{flex: 1}}>

       {
         state ?
         (
           <>
            <View style={styles.containerAllRoutines}>
                <Text style={styles.textTitle}>Rutinas de mi entrenador</Text>
              {
                routines.length > 0 ?
                (
                  routines.map((routine, index) => {
                    
                    if(routine.id_relacion_entrenador_usuario)
                    {
                      return(
                        <TouchableOpacity key={index} style={styles.containerRoutine} 
                          onPress={() => changeScreen(routine)}>
                          <Text style={styles.textTrainerName}>{routine.trainer.nombres}</Text>
                          <Text style={styles.textRoutineName}>{routine.nombre}</Text>
                          <Text style={styles.textType}>{routine.tipo}</Text>
                        </TouchableOpacity>
                      )
                    }
                  })
                )
                :
                (
                  <Text>Loading</Text>
                )
              }
              </View>
              <View style={styles.containerAllRoutines}>
                <Text style={styles.textTitle}>Mis rutinas</Text>
              {
                routines.length > 0 ?
                (
                  routines.map((routine,index) => {
                    if(!routine.id_relacion_entrenador_usuario)
                    {
                      return(
                        <TouchableOpacity key={index} style={styles.containerRoutine}
                           onPress={() => changeScreen(routine)}>
                          <Text style={styles.textRoutineName}>{routine.nombre}</Text>
                          <Text style={styles.textType}>{routine.tipo}</Text>
                        </TouchableOpacity>
                      )
                    }
                  })
                )
                :
                (
                  <Text>Loading</Text>
                )
              }
              </View>
           </>
         )
         :
         (
           <Text>llol</Text>
         )
       }
      </ScrollView>
      <BottomBar/>
    </>
  );
};

const styles = StyleSheet.create({
  containerAllRoutines:{
    flex: 1,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15
  },
  containerIconInput:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    backgroundColor: '#fff',
    paddingVertical: 0,
    marginVertical: 10,
    //borderColor: '#FB5012',
    borderColor: Colors.MainBlue,
    borderBottomWidth: 2,
  },
  containerRoutine:{
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.MainBlue,
    width: '90%',
    marginVertical: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  textTrainerName:{
    fontSize: 18,
    fontWeight: '700',
    color: '#fff'
  },
  textRoutineName:{
    fontSize: 16,
    fontWeight: '700',
    color: '#fff'
  },
  textType: {
    fontSize: 14,
    color: '#fff'
  },

  textTitle:{
    backgroundColor: Colors.Orange,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  }
});
