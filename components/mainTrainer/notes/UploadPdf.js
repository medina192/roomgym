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

import { urlServer } from '../../../services/urlServer';

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

    const [pdfNameInputValue, setPdfNameInputValue] = useState('');
    const [pdfPublic, setPdfPublic] = useState(false);
    const [pdfShowInPerfil, setPdfShowInPerfil] = useState(false);
    const [pdfAdded, setPdfAdded] = useState({
      boolean: false,
      data: {}
    });

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

      const savePdf = () => {
        /*
        const fileToUpload = {
            uri: pdfAdded.data.uri,
            type: pdfAdded.data.type,
            name: pdfAdded.data.name
        }

        let publicPdf = pdfPublic ? true : false;
        let ShowInPerfil = pdfShowInPerfil ? true : false;

        axios({
            method: 'post',
            url: `${serverUrl}/files/createpdf`,
            data: {
              paragraphs,
              idTrainer: T_trainer.idusuario,
              nameFile: nameInputValue,
              trainerName: T_trainer.nombres,
              trainerLastName: T_trainer.apellidos,
              publicPdf: true,
              showInPerfil: false,
            }
          })
          .then(function (response) {
              console.log('pdf',response);
              setPdfCreated(true);
  
              setTimeout(() => {
                  setPdfCreated(false);
              }, 3000);
          })
          .catch(function (error) {
              console.log('error axios',error);
          });
          */
      }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'fff'}}>
        <TopBar navigation={navigation} title={`Abrir pdf`} returnButton={true} />
            <View style={{padding: 10}}>
                <TouchableOpacity
                    style={{backgroundColor: Colors.Orange, padding: 10}}
                    onPress={pickDocument}
                >
                    <Text style={{color: '#fff', fontWeight: '700'}}>Cargar Pdf</Text>
                </TouchableOpacity>

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
         
                       <View style={styles.containerButtonsCheck}>          
                           <TouchableOpacity

                             style={styles.containerIconButtonClose}>
                             <Icon name="close" size={24} style={styles.iconButtonClose} color={Colors.MainBlue} />
                           </TouchableOpacity>
                           <TouchableOpacity

                               style={styles.containerIconButtonAdd}>
                               <Icon name="cloud-upload" size={24} style={styles.iconButtonAdd} color={Colors.MainBlue} />
                           </TouchableOpacity>
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
    </SafeAreaView>
  );


};




const styles = StyleSheet.create({


});
