import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import axios from 'axios';

import Colors from '../../../colors/colors';

import Icon from 'react-native-vector-icons/FontAwesome';

import { useDispatch, useSelector } from 'react-redux';

import SideBarUser from '../../shared/SideBarUser';

import { createDrawerNavigator } from '@react-navigation/drawer';
import TopBar from '../../shared/TopBar';
import BottomBar from '../../shared/BottomBarUser';

import { saveIdRelation } from '../../../store/actions/actionsReducer';

import { urlServer } from '../../../services/urlServer';

const Drawer = createDrawerNavigator();

export default function TrainerProfile() {
  return (
    <>
      <Drawer.Navigator drawerContent={(props) => <SideBarUser {...props} />}>
        <Drawer.Screen name="TrainerProfileScreen" component={TrainerProfileScreen} />
      </Drawer.Navigator>
    </>
  );
}

const TrainerProfileScreen = ({navigation}) => {

  const serverUrl = urlServer.url;

  const dispatch = useDispatch();

  const [userSubscribed, setUserSubscribed] = useState({
    state_subscription: 0,
    userSubscribedStatus: false
  });  
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    verifyRelation();
  }, []);

  const verifyRelation = () => {
    axios({
      method: 'get',
      url: `${serverUrl}/relations/getrelation/${user.email}${trainer.email}`,
    })
    .then(function (response) {

      if(response.data.resp.length > 0)
      {
        const statusSubscription =  response.data.resp[0].estado_subscripcion;
        //const currentDate = new Date('2021-03-30');
        const currentDate = new Date();
        const dbDate = response.data.resp[0].fecha_subscripcion;

        const subscriptionDate = new Date(dbDate.slice(0,10));
        const year = subscriptionDate.getFullYear();
        const month = subscriptionDate.getMonth();
        const day = subscriptionDate.getDate();
        const datePlus30 = new Date(year, month, day  + 30) // PLUS 30 DAY
        const relationInfo =  response.data.resp[0];

        dispatch(saveIdRelation(response.data.resp[0].id_relacion_entrenador_usuario));

        if(currentDate.getTime() > datePlus30.getTime())
        {

          axios({
            method: 'put',
            url: `${serverUrl}/relations/updatestatus`,
            data: {
              email_usuario: relationInfo.email,
              email_entrenador: relationInfo.email,
              email_usuario_entrenador: relationInfo.email_usuario_entrenador,
              fecha_subscripcion: relationInfo.fecha_subscripcion,
              estado_subscripcion: 2
            }
          })
          .then(function (response) { 

            setUserSubscribed({
              state_subscription: 2,
              userSubscribedStatus: true
            });
            setDisabled(true);
          })
          .catch(function (error) {
            console.log('error status axios',error);
          });
        }
        else{
          setUserSubscribed({
            state_subscription: 1,
            userSubscribedStatus: true
          });
        }
      }
    })
    .catch(function (error) {
        console.log('error axios',error);
    });
  }


  const trainer = useSelector(state => state.trainer);
  const user = useSelector(state => state.user);

  const subscribe = () => {
    const dateSubscription = new Date();
    const dateShortFormat = dateSubscription.toISOString();
    const dateMysqlFormat = dateShortFormat.slice(0,10);

    axios({
      method: 'post',
      url: `${serverUrl}/relations/registerRelation`,
      data: {
        idUsuario: user.idusuario,
        idEntrenador: trainer.idusuario,
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
        console.log('error axios',error);
    });
  }

  const sendMessage = () => {
    navigation.navigate('MessageUser');
  }

  const sendEmail = () => {
    axios({
      method: 'post',
      url: `${serverUrl}/relations/sendemail`,
      data: {

      }
    })
    .then(function (response) {
      //console.log('response', response.data);
      
      /*
      setUserSubscribed({
        state_subscription: 0,
        userSubscribedStatus: true
      });
      */
    })
    .catch(function (error) {
        console.log('error axios',error);
    });
  }

  return (
    <>
       <TopBar navigation={navigation} title={trainer.nombres} returnButton={true}/>
       <View style={styles.containerTrainerCard}>
          <View style={styles.trainerCard}>
            <View style={styles.containerImage_Name}>
                <Icon name="user-o" size={24} style={styles.iconImage} color="#fff" />
              <Text style={styles.trainerName}>{trainer.nombres + ' '+ trainer.apellidos}</Text>
            </View>
            <View style={styles.containerDescription}>
              <Text style={styles.description}>
                survived not only five centuries, but also the leap into electronic 
                typesetting, remaining essentially unchanged. It was popularised in the 1960s
                with the release of Letraset sheets containing Lorem Ipsum passages, and more
                recently with desktop publishing software like Aldus PageMaker including 
                versions of Lorem Ipsum
              </Text>
            </View>
            <View style={styles.containerContactInformation}>
                <Icon name="envelope" size={24} style={styles.iconContact} color="#fff" />
                <Icon name="instagram" size={24} style={styles.iconContact} color="#fff" />
                <Icon name="facebook-square" size={24} style={styles.iconContact} color="#fff" />
                <Icon name="twitter-square" size={24} style={styles.iconContact} color="#fff" />
            </View>
          </View>
          {
            userSubscribed.userSubscribedStatus ? 
            (
              <View style={styles.containerButtonSubscribe}>
                <TouchableOpacity style={!disabled ? styles.buttonSubscribe : styles.buttonSubscribeDisabled}
                 onPress={ disabled ? null :  sendMessage }>
                  <Text style={styles.textButoonSubscribe}>Enviar Mensaje</Text>
                </TouchableOpacity>
              </View>
            )
            : 
            (
            <View style={styles.containerButtonSubscribe}>
              <TouchableOpacity style={styles.buttonSubscribe} onPress={ subscribe }>
                <Text style={styles.textButoonSubscribe}>Suscribirse</Text>
              </TouchableOpacity>
            </View>
            )
          }

          {
          (() => { 

              if(userSubscribed.state_subscription == 2)
              {
                return(
                  <View style={styles.conatinerStatus2}>
                  <Text style={styles.textStatus2}>
                    Su subscripción ha terminado, si desea
                    continuar con ella, presione el siguiente botón y le enviaremos un correo
                    con la información de pago
                  </Text>
                  <TouchableOpacity style={styles.buttonStatus2} onPress={ sendEmail}>
                    <Text style={styles.textButtonStatus2}>Enviar correo</Text>
                  </TouchableOpacity>
                </View> 
                ) 
              }

           } )()
           }
        </View>
        <BottomBar navigation={navigation}/>
    </>
  );
};

const styles = StyleSheet.create({
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
  buttonSubscribeDisabled:{
    backgroundColor: 'rgba(255, 127, 17, 0.4)',
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
    fontWeight: '700',
  },
  
  //status 2
  conatinerStatus2:{
    paddingHorizontal: 15,
  },
  textStatus2:{

  },
  buttonStatus2:{
    backgroundColor: Colors.Orange,
    paddingVertical: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 10
  },
  textButtonStatus2:{
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center'
  },
});