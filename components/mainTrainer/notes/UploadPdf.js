import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  PermissionsAndroid,
  Switch,
  ActivityIndicator,
} from 'react-native';



import {Picker} from '@react-native-picker/picker';

import axios from 'axios';

import { useDispatch, useSelector } from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Button, Paragraph, Dialog, Portal } from 'react-native-paper';

import TopBar from '../../shared/TopBar';

import { createDrawerNavigator } from '@react-navigation/drawer';

import SideBarTrainer from '../../shared/SideBarTrainer';
import BottomBar from '../../shared/BottomBarUser';

import Colors  from '../../../colors/colors';


//import {NativeModules} from 'react-native';  // resolve the warning of require cycles
//const RNFetchBlob = NativeModules.RNFetchBlob
import RNFetchBlob from 'rn-fetch-blob';

import Video, {FilterType} from 'react-native-video';

import Pdf from 'react-native-pdf';

import { openDatabase } from 'react-native-sqlite-storage';
import SavedNote from './SavedNote';
import EditNote from './EditNote';
import { createIconSetFromFontello } from 'react-native-vector-icons';

import DocumentPicker from 'react-native-document-picker';

import { urlServer } from '../../../services/urlServer';

import AlertComponent from '../../shared/AlertComponent';

 
var db = openDatabase({ name: 'SchoolDatabase.db' });
 

const Drawer = createDrawerNavigator();


export default function UploadPdf() {

  return (
    <>
      <Drawer.Navigator drawerContent={(props) => <SideBarTrainer {...props} />}>
        <Drawer.Screen name="UploadPdf" component={UploadPdfScreen}/>
      </Drawer.Navigator>
    </>
  );
}


const UploadPdfScreen = ({navigation}) => {

    const serverUrl = urlServer.url;

    const [pdfNameInputValue, setPdfNameInputValue] = useState('');
    const [pdfPublic, setPdfPublic] = useState(false);
    const [pdfShowInPerfil, setPdfShowInPerfil] = useState(false);
    const [pdfAdded, setPdfAdded] = useState({
      boolean: false,
      data: {}
    });

    const [mainIndicator, setMainIndicator] = useState(false);
    const [showAlert, setShowAlert] = useState({
      show: false,
      type: 'error',
      action: 'close', 
      message: '', 
      title: '', 
      iconAlert: 'times-circle',
      nextScreen: 'MyGymTrainer'
    });

    const [optionsPdf, setOptionsPdf] = useState(false);

    const T_trainer = useSelector(state => state.T_trainer)

    const pickDocument = async () => {
        // Pick a single file
        try {
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.pdf ],
          });
          console.log(
            res.uri,
            res.type, // mime type
            res.name,
            res.size
          );
          setPdfAdded({
            boolean: true,
            data: res
          });
          setOptionsPdf(true);
        } catch (err) {
          if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker, exit any dialogs or menus and move on
          } else {
            throw err;
          }
        }
    
        /*
        // Pick multiple files
        try {
          const results = await DocumentPicker.pickMultiple({
            type: [DocumentPicker.types.pdf],
          });
          for (const res of results) {
            console.log(
              res.uri,
              res.type, // mime type
              res.name,
              res.size
            );
          }
        } catch (err) {
          if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker, exit any dialogs or menus and move on
          } else {
            throw err;
          }
        }
        */
      }

      console.log('uri', pdfAdded.data.uri);


      const savePdf = () => {
        
        
        
        if(typeof pdfAdded.data.uri == 'undefined'){
          setShowAlert({
            show: true,
            type: 'error',
            action: 'close', 
            message: 'Carga un archivo desde tu teléfono', 
            title: 'No se cargo ningún archivo', 
            iconAlert: 'times',
            nextScreen: 'MyGymTrainer'
          });
            
        }
        else{

          setMainIndicator(true);

          const positionDot = pdfAdded.data.name.search(/\./);
          const namePdf = pdfAdded.data.name.substr(0, positionDot);
  
          const fileToUpload = {
              uri: pdfAdded.data.uri,
              type: pdfAdded.data.type,
              name: namePdf
          }
  
          const formData = new FormData();
          formData.append('file', fileToUpload);
  
          let publicPdf = pdfPublic ? true : false;
          let ShowInPerfil = pdfShowInPerfil ? true : false;
  
          const bodyFile = {
            idTrainer: T_trainer.idusuario,
            trainerName: T_trainer.nombres,
            trainerLastName: T_trainer.apellidos,
            publicPdf,
            ShowInPerfil,
            namePdf
          }
  
          const bodyString = JSON.stringify(bodyFile);
  
          const headers = {
            'body': bodyString
          }
          
          axios({
            method: 'post',
            url: `${serverUrl}/files/savepdf`,
            data: formData,
            headers
            })
            .then(function (response) {
                console.log('pdf',response);
                setMainIndicator(false);
                setShowAlert({
                  show: true,
                  type: 'good',
                  action: 'close', 
                  message: 'El pdf se subio correctamente', 
                  title: 'Archivo cargado', 
                  iconAlert: 'file-pdf-o',
                  nextScreen: 'MyGymTrainer'
                });
            })
            .catch(function (error) {
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
        }


      }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'fff'}}>
        <TopBar navigation={navigation} title={`Abrir pdf`} returnButton={true} />
            <View style={styles.containerCard}>
              <View style={styles.card}>
                <TouchableOpacity
                      style={styles.buttonLoad}
                      onPress={pickDocument}
                  >
                      <Text style={styles.textButton}>Cargar Pdf</Text>
                  </TouchableOpacity>

                  {
                    optionsPdf ? 
                    (
                      <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Text>¿Deseas que el pdf sea publico?</Text>
                          <Switch
                              trackColor={{ false: "#767577", true: "#81b0ff" }}
                              thumbColor={pdfPublic ? Colors.MainBlue : "#f4f3f4"}
                              ios_backgroundColor="#3e3e3e"
                              onValueChange={() => setPdfPublic(!pdfPublic)}
                              value={pdfPublic}
                          />
            
                          <Text>¿Deseas que el pdf se muestre en tu perfil?</Text>
                          <Switch
                              trackColor={{ false: "#767577", true: "#81b0ff" }}
                              thumbColor={pdfShowInPerfil ? Colors.MainBlue : "#f4f3f4"}
                              ios_backgroundColor="#3e3e3e"
                              onValueChange={() => setPdfShowInPerfil (!pdfShowInPerfil)}
                              value={pdfShowInPerfil}
                          />
            
                          <View style={styles.containerButtonsSave}>          
                              <TouchableOpacity
                                  style={styles.buttonSavePdf}
                                  onPress={savePdf}
                              >
                                  <Icon name="cloud-upload" size={24} style={styles.iconSave} color={Colors.MainBlue} />
                              </TouchableOpacity>
                          </View>  
                      </View>
                    )
                    :
                    (
                      <>
                      </>
                    )
                  }
              </View>
            </View>
            {
                pdfAdded.boolean ? 
                (
                    <View           
                    style={{
                        flex:1,
                        width:Dimensions.get('window').width,
                        height:Dimensions.get('window').height,
                    }}>
                    <Pdf
                        source={{ uri: pdfAdded.data.uri, cache: true}}
                        onLoadComplete={(numberOfPages,filePath)=>{
                            console.log(`number of pages: ${numberOfPages}`);
                        }}
                        onPageChanged={(page,numberOfPages)=>{
                            console.log(`current page: ${page}`);
                        }}
                        onError={(error)=>{
                            console.log(error);
                        }}
                        onPressLink={(uri)=>{
                            console.log(`Link presse: ${uri}`)
                        }}
                        style={{
                        flex:1,
                        width:Dimensions.get('window').width,
                        height:Dimensions.get('window').height,
                        }}/>
              </View>
                )
                :
                (
                   <View style={{flex: 1}}>

                   </View>
                )
            }
 
        <BottomBar navigation={navigation}/>
        {
                    mainIndicator ? 
                    (
                      <View style={styles.grayContainer}>
                        <View style={styles.containerIndicator}>
                          <ActivityIndicator
                            size={80}
                            color={Colors.MainBlue}
                            style={styles.activityIndicator}
                          />
                        </View>
                      </View>
                    )
                    :
                    (
                      <>
                      </>
                    )
                  }
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
    </SafeAreaView>
  );


};




const styles = StyleSheet.create({
  grayContainer:{
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#00000099',
    elevation: 40
  },
    containerIndicator:{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      backgroundColor: '#fff',
      width: '70%',
      height: '50%',
      top: '25%',
      left: '15%',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      elevation: 40
    },

    containerCard: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    card:{
      width: '90%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.White,
      shadowColor: "#000",
      shadowOffset: {
          width: 10,
          height: 15,
      },
      shadowOpacity: 1,
      shadowRadius: 20,
      elevation: 5  ,
      marginVertical: 15,
      borderTopLeftRadius: 5,
      borderBottomRightRadius: 5,
      borderTopRightRadius: 5,
      borderBottomLeftRadius: 5,
    },
    
    buttonLoad:{
      backgroundColor: Colors.Orange,
      padding: 15,
      marginVertical: 10
    },
    textButton:{
      fontSize: 16,
      fontWeight: '700',
      color: '#fff'
    },

    containerButtonsSave:{

    },
    buttonSavePdf:{
      backgroundColor: Colors.MainBlue,
      borderTopLeftRadius: 100,
      borderBottomRightRadius: 100,
      borderTopRightRadius: 100,
      borderBottomLeftRadius: 100,
      marginVertical: 10
    },
    iconSave:{
      color: '#fff',
      fontSize: 30,
      padding: 10
    }

});
