import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

import axios from 'axios';

import Colors from '../../../colors/colors';

import TopBar from '../../shared/TopBar';
import BottomBar from '../../shared/BottomBarUser';

import { saveIdRelation } from '../../../store/actions/actionsReducer';

import { urlServer } from '../../../services/urlServer';

import Pdf from 'react-native-pdf';

import RNFetchBlob from 'rn-fetch-blob';

import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({ name: 'roomGym.db' });


const WatchPdf = ({navigation, route}) => {

  console.log('params', route.params);
  
  const [urlPdf, seturlPdf] = useState('');

  useEffect(() => {
    if(route.params.downloadedFileBoolean)
    {

      console.log('--------------------------------------------------------------');
      console.log('if', urlPdf);
      seturlPdf(route.params.downloadedFile.urlInPhone);
    }
    else{
      console.log('--------------------------------------------------------------');
      const urlPdf = route.params.document.url;
      console.log('else', urlPdf);
      seturlPdf(route.params.document.url);
    }
    
  }, [])

  const serverUrl = urlServer.url;

  console.log('down', route.params.downloadedFile);
  console.log('down', route.params.downloadedFileBoolean);



  const source = {uri: urlPdf,cache:true};
  console.log(route.params.document);
  //const source = {uri:'https://www.ti.com/lit/ds/symlink/lm555.pdf',cache:true};


  const urlInServer = `http://192.168.0.9:3002/pdfs/${route.params.document.nombreDocumento}`;


    const downloadPdf = () => {
        console.log('hi');
        // Main function to download the image
        // https://aboutreact.com/download-image-in-react-native/    image
        // To add the time suffix in filename
        let date = new Date();
        // Image URL which we want to download
        let image_URL = urlInServer;    
        // Getting the extention of the file
        let ext = getExtention(image_URL);
        ext = '.' + ext[0];
        // Get config and fs from RNFetchBlob
        // config: To pass the downloading related options
        // fs: Directory path where we want our image to download
        const { config, fs } = RNFetchBlob;
    
        let PictureDir = fs.dirs.PictureDir;
        let options = {
          fileCache: true,
          addAndroidDownloads: {
            // Related to the Android only
            useDownloadManager: true,
            notification: true,
            path:
              PictureDir +
              '/pdf_' + 
              Math.floor(date.getTime() + date.getSeconds() / 2) +
              ext,
            description: 'pdf',
          },
        };
        console.log('options', options);
        config(options)
          .fetch('GET', image_URL)
          .then(res => {
            // Showing alert after successful downloading
            console.log('res --------> ', JSON.stringify(res));
            const pathLocalDocument = `file://${res.data}`;
            insertData(pathLocalDocument );
            alert('pdf Downloaded Successfully.');
          })
          .catch(err => {
              console.log('error ----------------------------------', err);
          });
      };

      const getExtention = filename => {
        // To get the file extension
        return /[.]/.exec(filename) ?
                 /[^.]+$/.exec(filename) : undefined;
      };

      const insertData = (path) => {
        db.transaction(function (tx) {
          tx.executeSql(
            'INSERT INTO UserFiles (nameTrainer, nameDocument, type, idTrainerMysql, idDocumentMysql, urlInPhone) VALUES (?,?,?,?,?,?)',
            [route.params.document.nombreEntrenador,
               route.params.document.nombreDocumento, 
               route.params.document.tipo,
               route.params.document.idEntrenador, 
              route.params.document.idDocumentos, 
              path],
            (tx, results) => {
              //console.log('Results', results);
              console.log('tx', tx);
              getData();
              if (results.rowsAffected > 0) {
                Alert.alert('Data Inserted Successfully....');
              } else Alert.alert('Failed....');
            },(error => {
              console.log('error', error);
            })
          );
        });
      }
    

  return (
    <>
       <TopBar navigation={navigation} title={'Pdf'} returnButton={true}/>

        <TouchableOpacity 
            onPress={downloadPdf}
            style={{backgroundColor: Colors.Orange, padding: 5, margin: 20}}>
            <Text style={{color: '#fff', fontWeight: '700', fontSize: 16}}>Descargar</Text>
        </TouchableOpacity>

       <View 
        
        style={{
            flex:1,
            width:Dimensions.get('window').width,
            height:Dimensions.get('window').height,
        }}>
        <Pdf
            source={source}
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
       <BottomBar navigation={navigation}/>
    </>
  );
};

export default WatchPdf;

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