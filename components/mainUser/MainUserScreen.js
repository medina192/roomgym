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
} from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';

import ImageSlider from './ImageSlider';

import TopBar from '../shared/TopBar';

import Colors from '../../colors/colors';
import SideBarUser from '../shared/SideBarUser';
import BottomBar from '../shared/BottomBarUser';

import DocumentPicker from 'react-native-document-picker';

import Pdf from 'react-native-pdf';

import RNFetchBlob from 'rn-fetch-blob';

import axios from 'axios';

import messaging from '@react-native-firebase/messaging';

import { openDatabase } from 'react-native-sqlite-storage';

import { useDispatch, useSelector } from 'react-redux';

import { changeState, imageSliderCancel } from '../../store/actions/actionsReducer';

const db = openDatabase({ name: 'roomGym.db' });

const Drawer = createDrawerNavigator();

export default function MainUserScreen({navigation}) {
  return (
    <>
      <Drawer.Navigator drawerContent={(navigation) => <SideBarUser {...navigation} />}>
        <Drawer.Screen name="UserScreen" component={UserScreen} />
      </Drawer.Navigator>
    </>
  );
}


const UserScreen = ({navigation}) => {

  const state = useSelector(state => state.changeState);

  const dispatch = useDispatch();

  const user = useSelector(state => state.user);

  const [stopImageSlider, setStopImageSlider] = useState(false);

  useEffect(() => {
    
      const unsubscribe = messaging().onMessage(async remoteMessage => {
          Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      });

      messaging()
      .subscribeToTopic('usuario')
      .then(() => console.log(' subscribe to usuario'))
      .catch(error => console.log('error subscribed', error));

      const background = messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('notification background', JSON.stringify(remoteMessage))
      });

      dispatch(imageSliderCancel(false));
      return () => {
        //unsubscribe();
        //topicSubscriber();
        //background();
        setStopImageSlider(true);
        dispatch(changeState(!state));
      }
  }, []);

  const changeUserScreen = (newScreen) => {
    navigation.navigate(newScreen);
  }

  const openMenu = () => {
    navigation.openDrawer();
  }

  
  const pickDocument = async () => {
    // Pick a single file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images   ],
      });
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size
      );
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }

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
  }
  const source = {uri: 'content://com.android.providers.downloads.documents/document/1253',cache:true};

  const readPdf = () => {
    let data = ''
    RNFetchBlob.fs.readStream(
        // file path
        'content://com.android.providers.downloads.documents/document/1253',
        // encoding, should be one of `base64`, `utf8`, `ascii`
        'base64',
        // (optional) buffer size, default to 4096 (4095 for BASE64 encoded data)
        // when reading file in BASE64 encoding, buffer size must be multiples of 3.
        4095)
    .then((ifstream) => {
        console.log('ifstream', ifstream);
        //const formData = new FormData();
        //formData.append('file', ifstream);
        data = ifstream;









        ifstream.open()
        ifstream.onData((chunk) => {
          // when encoding is `ascii`, chunk will be an array contains numbers
          // otherwise it will be a string
          data += chunk
        })
        ifstream.onError((err) => {
          console.log('oops', err)
        })
        ifstream.onEnd(() => {
          //<Image source={{ uri : 'data:image/png,base64' + data }}
          console.log('end');
        });
    });

    
    setTimeout(() => {
      //console.log('data', data);
      aucFun(data);
    }, 3000);

    const aucFun = async(data1) => {

      const fileToUpload = {
        uri: 'content://com.android.providers.downloads.documents/document/1253',
        type: 'application/pdf',
        name: 'ooooooooo'
      }

        const formData = new FormData();
        formData.append('file', fileToUpload);
        console.log('form', formData);
        
      try {
        const resp = await axios({
          method: 'post',
          url: 'http://192.168.0.9:3002/files/savefile',
          data: formData
        });
        console.log('resp', resp);
      } catch (error) {
        console.log('error try', error); 
      }
    }
  }


  /// sql litre _______________________________________________________________---

  useEffect(() => {
    const createTable = () => {
      db.transaction(function (txn) {
        txn.executeSql(
          //"SELECT name FROM sqlite_master WHERE type='table' AND name='Student_Table'",
          "SELECT name FROM sqlite_master WHERE type='table' AND name='UserFiles'",
          [],
          function (tx, res) {

            
            if (res.rows.length == 0) {
              txn.executeSql('DROP TABLE IF EXISTS UserFiles', []);
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS UserFiles(id INTEGER PRIMARY KEY AUTOINCREMENT, nameTrainer VARCHAR(30), nameDocument VARCHAR(30), type VARCHAR(30), idTrainerMysql INT(15), idDocumentMysql INT(15), urlInPhone VARCHAR(255))',
                []
              );
            }
            
          }
        );
      })

    };

    createTable();

    //downloadPdf();
    //deleteData();
    //getData();
  }, [])


  const insertData = () => {
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO UserFiles (nameDocument, idTrainerMysql, idDocumentMysql, urlInPhone) VALUES (?,?,?,?)',
        ['jo', 1, 2, 'jdhfj'],
        (tx, results) => {
          console.log('Results', results);
          console.log('tx', tx);
          if (results.rowsAffected > 0) {
            //Alert.alert('Data Inserted Successfully....');
          } else Alert.alert('Failed....');
        }
      );
    });
  }

  const deleteData = () => {
    db.transaction(function (tx) {
      tx.executeSql(
        'DELETE FROM UserFiles',
        (tx, results) => {
          console.log('Results delete', results);
          console.log('tx', tx);
          if (results.rowsAffected > 0) {
            //Alert.alert('Data Inserted Successfully....');
          } else Alert.alert('Failed....');
        }
      );
    });
  }

  const getData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM UserFiles',
        [],
        (tx, results) => {
          var temp = [];
          console.log('results get', results);
          console.log('length', results.rows.length);
          for (let i = 0; i < results.rows.length; ++i)
          {
            temp.push(results.rows.item(i));
            console.log('results---', results.rows.item(i));
          }
        }
      );
 
    });
  }

  //const urlInServer = `https://res.cloudinary.com/dvtdipogm/video/upload/v1623434542/hqy7eflugfnf2kxnxfp7.mp4`;

  const urlInServer = `https://res.cloudinary.com/dvtdipogm/video/upload/v1623693764/u53q4vxzvwxtxc6btc5a.mp4`;
  const downloadPdf = () => {

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
          '/video_' + 
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
        console.log('res --------> ', res);
        const pathLocalDocument = `file://${res.data}`;
        insertData(pathLocalDocument );
        alert('video Downloaded Successfully.');
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


  //UPDATE users SET first_name = ? , last_name = ? WHERE id = ?', ["Doctor", "Strange", 3]
  //DELETE FROM users WHERE id = ?', [4]

  return (
    <>
        <TopBar navigation={navigation} title={`Hola ${user.nombres}`} returnButton={false} />
        <ScrollView style={styles.containerScrollView}>
          {
            /*
                      <ImageSlider />    
            */
          }
      
          <ImageSlider stopImageSlider={stopImageSlider}/>    
          <View style={styles.containerTextDescriptionButton}>
            <Text style={styles.textDescriptionButton}>Conitnua con tu rutina del d??a de hoy</Text>
            <Text style={styles.textDescriptionButtonSubtitle}>La disciplina es lo m??s importante</Text>
          </View>
          <View style={styles.containerTouchableImage}>
            <TouchableOpacity style={styles.touchableContainerImage}
              onPress={() => changeUserScreen('CustomPlan')} >
              <ImageBackground source={ require('../../assets/img/_3.jpg')} style={styles.imageButton}>
                <Text style={styles.textImageButton}>Plan personalizado</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
    
          <View style={styles.containerTextDescriptionButton}>
            <Text style={styles.textDescriptionButton}>Cada d??a se agregan nuevos entrenadores</Text>
            <Text style={styles.textDescriptionButtonSubtitle}>Conoce nuevos entrenadores</Text>
          </View>
          <View style={styles.containerTouchableImage}>
            <TouchableOpacity style={styles.touchableContainerImage}
              onPress={() => changeUserScreen('ListTrainers')} >
              <ImageBackground source={ require('../../assets/img/_1.jpg')} style={styles.imageButton}>
                <Text style={styles.textImageButton}>Entrenadores</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>

          <View style={styles.containerTextDescriptionButton}>
            <Text style={styles.textDescriptionButton}>??Cuanto eh mejorado?</Text>
            <Text style={styles.textDescriptionButtonSubtitle}>Registra tu progreso</Text>
          </View>
          <View style={styles.containerTouchableImage}>
            <TouchableOpacity style={styles.touchableContainerImage}
              onPress={() => changeUserScreen('Statistics')} >
              <ImageBackground source={ require('../../assets/img/_4.jpg')} style={styles.imageButton}>
                <Text style={styles.textImageButton}>Estad??sticas</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>

          <View style={styles.containerTextDescriptionButton}>
            <Text style={styles.textDescriptionButton}>Crear rutinas</Text>
          </View>
          <View style={styles.containerTouchableImage}>
            <TouchableOpacity style={styles.touchableContainerImage}
              onPress={() => changeUserScreen('Routines')} >
              <ImageBackground source={ require('../../assets/img/4.jpg')} style={styles.imageButton}>
                <Text style={styles.textImageButton}>Rutinas</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
    
          <View style={styles.containerTextDescriptionButton}>
            <Text style={styles.textDescriptionButton}>??Que gimansios me recomiendas?</Text>
            <Text style={styles.textDescriptionButtonSubtitle}>Revisa los gimansios de tus entrenadores</Text>
          </View>
          <View style={styles.containerTouchableImage}>
            <TouchableOpacity style={styles.touchableContainerImage}
              onPress={() => changeUserScreen('ListGyms')} >
              <ImageBackground source={ require('../../assets/img/_6.jpg')} style={styles.imageButton}>
                <Text style={styles.textImageButton}>Gimnasios</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>


        </ScrollView>

        <BottomBar navigation={navigation}/>
    </>
  );
};

const styles = StyleSheet.create({
  containerScrollView:{
    flex: 1,
    backgroundColor: '#fff'
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



  containerButtonSubscribe:{
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginBottom: 20
  },
  buttonSubscribe:{
    backgroundColor: '#f10265',
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


  containerBottomBar:{
    width: '100%',
    height: 'auto',
    paddingVertical: 10,
    backgroundColor: Colors.MainBlue,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  iconBottomBar:{
    fontSize: 35,
    color: '#fff'
  }
});
