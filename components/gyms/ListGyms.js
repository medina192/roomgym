import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/FontAwesome';

import TopBar from '../shared/TopBar';

import Colors from '../../colors/colors';
import SideBarUser from '../shared/SideBarUser';
import BottomBar from '../shared/BottomBarUser';

import axios from 'axios';


import { openDatabase } from 'react-native-sqlite-storage';

import { useDispatch, useSelector } from 'react-redux';

import { changeState } from '../../store/actions/actionsReducer';

import AlertComponent from '../shared/AlertComponent';

import { urlServer } from '../../services/urlServer';

const db = openDatabase({ name: 'roomGym.db' });

const Drawer = createDrawerNavigator();

export default function ListGyms({navigation}) {
  return (
    <>
      <Drawer.Navigator drawerContent={(navigation) => <SideBarUser {...navigation} />}>
        <Drawer.Screen name="ListGyms" component={ListGymsScreen} />
      </Drawer.Navigator>
    </>
  );
}


const ListGymsScreen = ({navigation}) => {

    
  const serverUrl = urlServer.url;

  const dispatch = useDispatch();

  const user = useSelector(state => state.user);
  console.log('user', user);

  const [gymsList, setGymsList] = useState([]);
  const [mainIndicator, setMainIndicator] = useState(true);
  const [showAlert, setShowAlert] = useState({
    show: false,
    type: 'error',
    action: 'close', 
    message: '', 
    title: '', 
    iconAlert: 'times-circle',
    nextScreen: 'MyGymTrainer'
  });


  useEffect(() => {
    axios({
        method: 'get',
        url: `${serverUrl}/gyms/getgyms`,
      })
      .then(function (response) {
        console.log('resp messages',response.data.resp);
        setGymsList(response.data.resp);
        setMainIndicator(false);
      })
      .catch(function (error) {
          //console.log('error axios get messages',error);
          setMainIndicator(false);
          if(error.request._response.slice(0,17) === 'Failed to connect')
          {
  
            setShowAlert({
              show: true,
              type: 'error',
              action: 'close', 
              message: 'Verifica tu conexión a internet o notifica al equipo de GymRoom sobre el problema', 
              title: 'No se pudo conectar con el servidor', 
              iconAlert: 'wifi',
              nextScreen: 'MyGymTrainer'
            });
          }
      });
  }, [])


  return (
    <View style={styles.mainContainer}>
        <TopBar navigation={navigation} title={`Gimnasios`} returnButton={true} />
        <ScrollView style={{flex:1}}>
        {
                    mainIndicator ? 
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
                                gymsList.map( (gym, indexGym) => {

                                    return(
                                        <View key={indexGym} style={styles.containerGymsCards}>
                                            <View style={styles.gymCard}>
                                                <Text style={styles.gymName}>{gym.nombre}</Text>
                                                <View style={styles.blueLine}></View>
                                                <Text style={styles.gymLocation}>{gym.ciudad+', '+gym.entidad}</Text>
                                                <View style={styles.containerWidthAuto}>
                                                    <TouchableOpacity
                    
                                                    style={styles.buttonGoToGym}
                                                    >
                                                        <Icon name="arrow-right" size={24} style={styles.iconGoToGym} color="#fff" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    )
        }
        </ScrollView>
        <BottomBar navigation={navigation}/>

                  {
                    showAlert.show ? 
                    (
                      <AlertComponent 
                        navigation={navigation} 
                        type={showAlert.type}  
                        action={showAlert.action} 
                        message={showAlert.message} 
                        title={showAlert.title} 
                        iconAlert={showAlert.iconAlert}
                        closeFunction={setShowAlert}
                        stateVariable={showAlert}
                        nextScreen={showAlert.nextScreen}
                      />
                    )
                    :
                    (
                      <>
                      </>
                    )
                  }
    </View>
  );
};

const styles = StyleSheet.create({
    mainContainer:{
        flex: 1,
        position: 'relative'
    },

    containerIndicator:{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    containerGymsCards:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    gymCard:{
        width: Dimensions.get('window').width * 0.9,
        padding: 10,
        marginVertical: 15,
        backgroundColor: '#fff',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 5,
        elevation: 5,
    },
    gymName:{
        color: Colors.MainBlue,
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 5
    },
    blueLine:{
        width: '100%',
        height: 2,
        backgroundColor: Colors.MainBlue
    },
    gymLocation:{
        color: Colors.MainBlue,
        fontSize: 18,
        fontWeight: '600',
        marginTop: 5,
        marginBottom: 10
    },
    containerWidthAuto:{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    buttonGoToGym:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.Orange,
        padding: 5,
        width: 40,
        height: 40,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
    },
    iconGoToGym:{
        color: '#fff',
        fontSize: 25,
    },
 
});
