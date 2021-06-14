import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
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
import { ScrollView } from 'react-native-gesture-handler';

import { openDatabase } from 'react-native-sqlite-storage';


const db = openDatabase({ name: 'roomGym.db' });

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

  const trainer = useSelector(state => state.trainer);
  const user = useSelector(state => state.user);
  const stateAux = useSelector(state => state.changeStateForDocuments);

  const [userSubscribed, setUserSubscribed] = useState({
    state_subscription: 0,
    userSubscribedStatus: false
  });  
  const [disabled, setDisabled] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [downloadedFiles, setDownloadedFiles] = useState({
    loaded: false,
    files: []
  });

  const [state, setState] = useState(false);

  

  useEffect(() => {

    if(user == '')
    {

    }
    else{
      getDownloadedFiles();
    }

  }, [stateAux]);

  useEffect(() => {
    verifyRelation();
    getTrainerDocuments();

    if(user == '')
    {

    }
    else{

      getDownloadedFiles();
    }

  }, []);

  const getDownloadedFiles = () => {

    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM UserFiles',
        [],
        (tx, results) => {
          var temp = [];

          for (let i = 0; i < results.rows.length; ++i)
          {
            temp.push(results.rows.item(i));
            //console.log('results---', results.rows.item(i));
          }
          setDownloadedFiles({
            loaded: true,
            files: temp
          }); 
        }
      );
 
    });
  }



  const verifyRelation = () => {
    axios({
      method: 'get',
      url: `${serverUrl}/relations/getrelation/${user.email}${trainer.email}`,
    })
    .then(function (response) {

      //console.log('response.data.resp.length, ', response.data.resp);

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




  const subscribe = () => {

    if(user == '')
    {
      //console.log('subscribe');
    }
    else{
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
        setState(!state);
        
      })
      .catch(function (error) {
          console.log('error axios',error);
      });
    }
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


  const getTrainerDocuments = async() => {
    axios({
      method: 'post',
      url: `${serverUrl}/files/getdocuments`,
      data: {
        idEntrenador: trainer.idusuario,
      }
    })
    .then(function (response) {
      //console.log('response', response.data.resp); 
      setDocuments(response.data.resp);
    })
    .catch(function (error) {
        console.log('error axios',error);
    });
  }


  return (
    <>
       <TopBar navigation={navigation} title={trainer.nombres} returnButton={true}/>
        <ScrollView>
        <View style={styles.containerTrainerCard}>
          <View style={styles.trainerCard}>
            <View style={styles.containerImage_Name}>
                <Icon name="user-o" size={24} style={styles.iconImage} color="#fff" />
              <Text style={styles.trainerName}>{trainer.nombres + ' '+ trainer.apellidos}</Text>
            </View>
            <View style={styles.containerDescription}>
              <Text style={styles.description}>
                {trainer.descripcion_entrenador}
              </Text>
            </View>
            {
              /*
                          <View style={styles.containerContactInformation}>
                <Icon name="envelope" size={24} style={styles.iconContact} color="#fff" />
                <Icon name="instagram" size={24} style={styles.iconContact} color="#fff" />
                <Icon name="facebook-square" size={24} style={styles.iconContact} color="#fff" />
                <Icon name="twitter-square" size={24} style={styles.iconContact} color="#fff" />
            </View>
              */
            }
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
              <View>
                {
                  user == '' ? 
                  (
                    <View style={styles.containerButtonSubscribe}>
                      <TouchableOpacity style={styles.buttonSubscribe} disabled={true} onPress={ subscribe }>
                        <Text style={styles.textButoonSubscribe}>Necesitas registrarte para suscribirte</Text>
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
           <View>
             {

               documents.length > 0 && downloadedFiles.loaded ?
               (
                <View>
                  <View>
                    <Text style={{fontSize: 16, fontWeight: '700', marginTop: 10, marginBottom: 5}}>Videos</Text>
                    {
                      documents.map( (document, indexDocument) => {
                        if(document.tipo === 'video')
                        {
                          const index___ = document.nombreDocumento.search('___');
                          const justName = document.nombreDocumento.slice(0, index___);

                          let downloadedFileBoolean = false;
                          let downloadedFile = {};

                          //console.log('jjjjjjjjjj',downloadedFiles.files.length);

                          for(let i = 0; i < downloadedFiles.files.length; i++)
                          {
                            //console.log('jjjjjjjjjj',downloadedFiles.files[i].idDocumentMysql);
                            
                            //console.log('---------------------------------------------------------');
                            //console.log('local ', downloadedFiles.files[i].idDocumentMysql, '   ', 'server', document.idDocumentos);
                            //console.log('---------------------------------------------------------');
                            if(downloadedFiles.files[i].idDocumentMysql == document.idDocumentos)
                            {
                              downloadedFileBoolean = true;
                              downloadedFile = downloadedFiles.files[i];
                              break;
                            }
   
                          }
                          let urlCloudinary = document.url;
                          return(
                            <TouchableOpacity key={indexDocument}
                              onPress={ () => navigation.navigate('WatchVideo',{ document, downloadedFile, downloadedFileBoolean, urlCloudinary})}
                              style={{backgroundColor: Colors.MainBlue, marginVertical: 3, padding: 5}} key={indexDocument}>
                              <Text style={{fontWeight: '700', color: '#fff'}}>{justName}</Text>
                              <View>
                                {
                                  downloadedFileBoolean  ?
                                  (
                                      <Text style={{backgroundColor: '#fff', padding: 5, color: Colors.MainBlue}}>Descargado</Text>
                                  )
                                  :
                                  (
                                      <Text style={{backgroundColor: '#fff', padding: 5, color: Colors.MainBlue}}>No Descargado</Text>
                                  )
                                }
                              </View>
                            </TouchableOpacity>
                          )
                        }
                      })
                    }
                  </View>
                  <View>
                    <Text  style={{fontSize: 16, fontWeight: '700', marginTop: 10, marginBottom: 5}}>Pdfs</Text>
                    {
                      documents.map( (document, indexDocument) => {


                        if(document.tipo === 'pdf')
                        {
                          const index___ = document.nombreDocumento.search('___');
                          const justName = document.nombreDocumento.slice(0, index___);

                          let downloadedFileBoolean = false;
                          let downloadedFile = {};

                          //console.log('jjjjjjjjjj',downloadedFiles.files.length);

                          for(let i = 0; i < downloadedFiles.files.length; i++)
                          {
                          
                            if(downloadedFiles.files[i].idDocumentMysql == document.idDocumentos)
                            {

                              downloadedFileBoolean = true;
                              downloadedFile = downloadedFiles.files[i];
                              break;
                            }
                            
                          }

                          return(
                            <TouchableOpacity  key={indexDocument}
                              onPress={ () => navigation.navigate('WatchPdf',{ document, downloadedFile,downloadedFileBoolean})}
                              style={{backgroundColor: Colors.MainBlue, marginVertical: 3, padding: 5}} key={indexDocument}>
                              <Text style={{fontWeight: '700', color: '#fff'}}>{justName}</Text>
                              <View>
                                {
                                  downloadedFileBoolean  ?
                                  (
                                      <Text style={{backgroundColor: '#fff', padding: 5, color: Colors.MainBlue}}>Descargado</Text>
                                  )
                                  :
                                  (
                                      <Text style={{backgroundColor: '#fff', padding: 5, color: Colors.MainBlue}}>No Descargado</Text>
                                  )
                                }
                              </View>
                            </TouchableOpacity>
                          )
                        }
                      })
                    }
                  </View>
                  <View>
                    <Text  style={{fontSize: 16, fontWeight: '700', marginTop: 10, marginBottom: 5}}>Imagenes</Text>
                    {
                      documents.map( (document, indexImage) => {

                        if(document.tipo === 'image')
                        {
                          const index___ = document.nombreDocumento.search('___');
                          const justName = document.nombreDocumento.slice(0, index___);
                          return(
                            <Image  key={indexImage} width={100} height={50} source={{uri: document.url,
                            width: 300, 
                            height: 300}} />
                          )
                        }
                      })
                    }
                  </View>
                </View>
               )
               :
               (
                 <Text>El entrenador aún no tiene documentos</Text>
               )
             }
           </View>
        </View>
        </ScrollView>
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