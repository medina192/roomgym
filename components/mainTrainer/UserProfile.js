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

import Colors from '../../colors/colors';

import Icon from 'react-native-vector-icons/FontAwesome';

import { useDispatch, useSelector } from 'react-redux';

import SideBarTrainer from '../shared/SideBarTrainer';

import { createDrawerNavigator } from '@react-navigation/drawer';
import TopBar from '../shared/TopBar';
import BottomBar from '../shared/BottomBarUser';

import { saveIdRelation } from '../../store/actions/actionsReducer';

import { urlServer } from '../../services/urlServer';



const Drawer = createDrawerNavigator();

export default function UserProfile() {
  return (
    <>
      <Drawer.Navigator drawerContent={(props) => <SideBarTrainer {...props} />}>
        <Drawer.Screen name="UserProfileScreen" component={UserProfileScreen} />
      </Drawer.Navigator>
    </>
  );
}

const UserProfileScreen = ({navigation}) => {

  const serverUrl = urlServer.url;

  const [loadingRoutines, setLoadingRoutines] = useState(true);
  const [userSubscribed, setUserSubscribed] = useState({
    state_subscription: 0,
    userSubscribedStatus: false
  });  

  const [routines, setRoutines] = useState([]);

  const trainer = useSelector(state => state.T_trainer);
  const user = useSelector(state => state.T_user);
  const idRelation = useSelector(state => state.idRelation);
  console.log(user);
  useEffect(() => {
    verifyRelation();
    
  }, []);


  const getRoutines = () => {
    
    axios({
      method: 'get',
      url: `${serverUrl}/relations/getroutines/${idRelation}`,
    })
    .then(function (response) {
        console.log('routine',response.data.resp);
        
        if(response.data.resp.length > 0)
        {
          const routinesString = response.data.resp;
          
          console.log('if');
          //let r = JSON.parse(response.data.resp);
          //console.log('r---------', r);
          setLoadingRoutines(false);
          setRoutines(routinesString);
          
        }
        else{
          console.log('else');
          setLoadingRoutines(false);
        }

    })
    .catch(function (error) {
        console.log('error get routines  axios',error);
    });
  }



  const verifyRelation = () => {
 
    axios({
      method: 'get',
      url: `${serverUrl}/relations/getrelation/${user.email_usuario+trainer.email}`,
    })
    .then(function (response) {

      if(response.data.resp.length > 0)
      {
        const statusSubscription =  response.data.resp[0].estado_subscripcion;
        
        setUserSubscribed({
          state_subscription: statusSubscription,
          userSubscribedStatus: true
        });
        dispatch(saveIdRelation(response.data.resp[0].id_relacion_entrenador_usuario));
        getRoutines();
      }
    })
    .catch(function (error) {
        console.log('error verify relation axios',error);
    });
  }

  const dispatch = useDispatch();


/*
  const subscribe = () => {
    const dateSubscription = new Date();
    const dateShortFormat = dateSubscription.toISOString();
    const dateMysqlFormat = dateShortFormat.slice(0,10);

    axios({
      method: 'post',
      url: `${serverUrl}/relations/registerRelation`,
      data: {
        email_usuario: user.email,
        email_entrenador: trainer.email,
        email_usuario_entrenador: `${user.email+trainer.email}`,
        fecha_subscripcion: dateMysqlFormat,
        estado_subscripcion: 1
      }
    })
    .then(function (response) {
      //console.log('response', response.data);
      verifyRelation();
      
      setUserSubscribed({
        state_subscription: 0,
        userSubscribedStatus: true
      });
      
    })
    .catch(function (error) {
        console.log('error subscribe axios',error);
    });
  }
*/
  const sendMessage = () => {
    navigation.navigate('MessageTrainer');
  }

  const createNewRoutine = () => {
    dispatch(saveIdRelation(user.id_relacion_entrenador_usuario));
    navigation.navigate('CreateRoutines');
  } 
  console.log('rou', routines);

  return (
    <>
       <TopBar navigation={navigation} title={'Usuario'} returnButton={true}/>
        <ScrollView style={{padding: 15, flex: 1, marginBottom: 10}}>
          <View style={styles.trainerCard}>
            <View style={styles.containerImage_Name}>
                <Icon name="user-o" size={24} style={styles.iconImage} color="#fff" />
              <Text style={styles.trainerName}>{user.email_usuario}</Text>
            </View>
            <View style={styles.containerDescription}>

            </View>
            <View style={styles.containerContactInformation}>
                <Icon name="envelope" size={24} style={styles.iconContact} color="#fff" />
                <Icon name="instagram" size={24} style={styles.iconContact} color="#fff" />
                <Icon name="facebook-square" size={24} style={styles.iconContact} color="#fff" />
                <Icon name="twitter-square" size={24} style={styles.iconContact} color="#fff" />
            </View>
          </View>
          
              <View style={styles.containerButtonSubscribe}>
                <ScrollView>
                  <TouchableOpacity style={styles.buttonSubscribe} onPress={ sendMessage }>
                    <Text style={styles.textButoonSubscribe}>Enviar Mensaje</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>

              <View style={styles.containerRoutines}>
                <View style={styles.containerButtonSubscribe}>
                  <TouchableOpacity style={styles.buttonSubscribe} onPress={ createNewRoutine }>
                    <Text style={styles.textButoonSubscribe}>Crear nueva rutina</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.textRutinas}>Rutinas</Text>

              <View style={styles.blueLine}></View>
              
                <View>
                  {
                    loadingRoutines ? 
                    (
                      <View style={styles.containerIndicator}>
                      <ActivityIndicator
                        size={80}
                        color={Colors.MainBlue}
                        style={styles.activityIndicator}
                      />
                    </View>
                    )
                    :
                    (
                      <View>
                                              {
                        (routines.length > 0) ?
                        
                          
                            routines.map((routine, index) => {
                              //let routineObject = JSON.parse(routine.ejercicios);
                              let exercises = JSON.parse(routine.ejercicios);
                              return(
                                <View key={index} style={styles.routineCard}>
                                  <Text style={{fontSize: 18, color: '#fff'}}>{routine.nombre}</Text>
                                   {
                                     exercises.map((rutina, indexRutina) => {
                                      
                                      return(
                                        <View key={indexRutina}>
                                          <Text style={styles.textRoutineCard}>{rutina.name}</Text>
                                        </View>
                                      )
                                     })
                                   }
                                </View>
                              )
                             })
                          
                        
                        :
                        (
                          <View style={styles.containerTextWithoutRoutines}>
                            <Text style={styles.textWithoutRoutines}>No has asignado rutinas aún a este usuario</Text>
                          </View>
                        )
                      }
                      </View>
                    )
                  }
                </View>
              </ScrollView>

      <BottomBar navigation={navigation}/>
    </>
  );
};

const styles = StyleSheet.create({

    containerIndicator:{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    },


    containerTrainerCard:{
        paddingHorizontal: 15,
        paddingVertical: 20,
        flex: 1
      },
      trainerCard:{
        backgroundColor: "#244EABa0",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
      },
      containerImage_Name:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15
      },
      iconImage:{
        fontSize: 80,
        color: '#fff'
      },
      trainerName:{
        fontSize: 22,
        fontWeight: '700',
        color: '#fff'
      },  
      containerDescription:{
        paddingHorizontal: 15,
        paddingVertical: 15
      },
      description:{
        fontSize: 18
      },
      containerContactInformation:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
      },
      iconContact:{
        fontSize: 24,
        color: '#fff'
      },

    // routines
    containerRoutines:{
      flex: 1,
    },  
    textRutinas:{
      fontSize: 18,
      color: Colors.MainBlue,
      fontWeight: '700',
    },
    blueLine:{
      height: 2,
      width: '100%',
      backgroundColor: Colors.MainBlue,
      marginTop: 3,
      marginBottom: 10
    },
    routineCard:{
      marginBottom: 20,
      backgroundColor: Colors.MainBlue,
      paddingVertical: 7,
      paddingHorizontal: 10,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    textRoutineCard:{
      color: '#fff',
      fontSize: 16
    },
    containerTextWithoutRoutines:{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    textWithoutRoutines:{
      backgroundColor: "#999",
      color: '#fff',
      fontWeight: '700',
      fontSize: 16,
      padding: 8,
      marginTop: 15,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },

    // button subscribe
  containerButtonSubscribe:{
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginBottom: 20
  },
  buttonSubscribe:{
    backgroundColor: Colors.Orange,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textButoonSubscribe:{
    color: '#fff',
    fontSize: 20,
    fontWeight: '700'
  },



});

