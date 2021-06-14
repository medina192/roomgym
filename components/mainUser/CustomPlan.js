import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import axios from 'axios';

import { useDispatch, useSelector } from 'react-redux';

import TopBar from '../shared/TopBar';

import {urlServer} from '../../services/urlServer';

import SideBarUser from '../shared/SideBarUser';
import  Colors  from '../../colors/colors';

import { saveCurrentRoutine } from '../../store/actions/actionsReducer';

import BottomBar from '../shared/BottomBarUser';

import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({ name: 'roomGym.db' });

import { createDrawerNavigator } from '@react-navigation/drawer';

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

  const user = useSelector(state => state.user)

  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshState, setRefreshState] = useState(false);
 

  useEffect(() => {
    
    if(user == '')
    {
      getRoutinesGeneralUser();
    }
    else{
      getRoutines();
    }
  }, []);


  const getRoutinesGeneralUser = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM GeneralUser',
        [],
        (tx, results) => {
          console.log('results', results);
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
          {
            temp.push(results.rows.item(i));
            console.log('results---', results.rows.item(i));
          }
          setLoading(false);
          getTrainersOfRoutines(temp);
        }
      );
 
    });
  }
 


  const getRoutines = async() => {

    try {
      const response = await axios({
        method: 'get',
        url: `${serverUrl}/relations/getroutinesbyuser/${user.idusuario}`,
      });
      setLoading(false);
      getTrainersOfRoutines(response.data.resp);
    } catch (error) {
      console.log(error);
    }

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
    setRefreshState(!refreshState);
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
    <View style={{flex: 1, position: 'relative'}}>
      <TopBar navigation={navigation} title={`Mi plan personalizado`} returnButton={true} />

      <View style={{flex: 1}}>
      {
         !loading ?
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
                  <View>
                    {
                      user == '' ? 
                      (
                        <Text style={styles.textNoTrainerRoutines}>
                          Para que un entrenador pueda asignarte rutinas, debes registrarte y 
                          suscribirte a el
                        </Text>
                      )
                      :
                      (
                        <Text style={styles.textNoTrainerRoutines}>
                          Tu entrenador no te ha asignado rutinas aún
                        </Text>
                      )
                    }
                  </View>
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
                  <View>
                      <Text style={styles.textNoTrainerRoutines}>No has creado rutinas aún</Text>
                  </View>
                )
              }
              </View>
           </>
         )
         :
         (
          <View style={styles.containerIndicator}>
            <ActivityIndicator
              size={80}
              color={Colors.MainBlue}
              style={styles.activityIndicator}
            />
          </View>
         )
       }
      </View>

      <BottomBar navigation={navigation}/>
    </View>
  );
};

const styles = StyleSheet.create({

  containerIndicator:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  containerAllRoutines:{
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10
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
  },

  textNoTrainerRoutines:{
    backgroundColor: Colors.MainBlue,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    padding: 10,
    marginTop: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },


});
