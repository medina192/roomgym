import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';

import RNFetchBlob from 'rn-fetch-blob';

import { createDrawerNavigator } from '@react-navigation/drawer';

import ImageSlider from '../ImageSlider';

import TopBar from '../../shared/TopBar';

import Colors from '../../../colors/colors';
import SideBarUser from '../../shared/SideBarUser';
import BottomBar from '../../shared/BottomBarUser';

import { useDispatch, useSelector } from 'react-redux';

import { changeState } from '../../../store/actions/actionsReducer';

import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({ name: 'roomGym.db' });


const Drawer = createDrawerNavigator();

export default function MainUserGeneralScreen({navigation}) {
  return (
    <>
      <Drawer.Navigator drawerContent={(navigation) => <SideBarUser {...navigation} />}>
        <Drawer.Screen name="UserGeneralScreen" component={UserGeneralScreen} />
      </Drawer.Navigator>
    </>
  );
}

const UserGeneralScreen = ({navigation}) => {

  const [stopImageSlider, setStopImageSlider] = useState(false);

  const state = useSelector(state => state.changeState);

  const dispatch = useDispatch();

  useEffect(() => {
  
    const createTable = () => {
      db.transaction(function (txn) {
        txn.executeSql(
          //"SELECT name FROM sqlite_master WHERE type='table' AND name='Student_Table'",
          "SELECT name FROM sqlite_master WHERE type='table' AND name='GeneralUser'",
          [],
          function (tx, res) {
            
            
            if (res.rows.length == 0) {
              txn.executeSql('DROP TABLE IF EXISTS GeneralUser', []);
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS GeneralUser(id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(30), ejercicios TEXT, tipo VARCHAR(15))',
                []
              );
            }
            
          }
        );
      })

    };

    createTable();


    const downloadPdf = () => {

      // Main function to download the image
      // https://aboutreact.com/download-image-in-react-native/    image
      // To add the time suffix in filename
      let date = new Date();
      // Image URL which we want to download
      let image_URL = 'https://res.cloudinary.com/dvtdipogm/image/upload/v1623355459/ob78hihastd1lkumu3gq.png';    
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
          console.log('res --------> ', JSON.stringify(res));
          const pathLocalDocument = `file://${res.data}`;
          //insertData(pathLocalDocument );
          alert('video Downloaded Successfully.');
        })
        .catch(err => {
            console.log('error ----------------------------------', err);
        });
    };


    //downloadPdf();

    return () => {
      setStopImageSlider(true);
      dispatch(changeState(!state));
    }
  }, [])

  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ?
             /[^.]+$/.exec(filename) : undefined;
  };
  
  const changeUserScreen = (newScreen) => {
    navigation.navigate(newScreen);
  }

  const openMenu = () => {
    console.log('drawer');
    navigation.openDrawer();
  }


  return (
    <>
        <TopBar navigation={navigation} title={`Bienvenido Usuario`} returnButton={true} />
        <ScrollView style={styles.containerScrollView}>
          <ImageSlider />          
          <View style={styles.containerTextDescriptionButton}>
            <Text style={styles.textDescriptionButton}>Comienza ya¡</Text>
          </View>
          <View style={styles.containerTouchableImage}>
            <TouchableOpacity style={styles.touchableContainerImage}
              onPress={() => changeUserScreen('Routines')} >
              <ImageBackground source={ require('../../../assets/img/4.jpg')} style={styles.imageButton}>
                <Text style={styles.textImageButton}>Rutinas</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
    
          <View style={styles.containerTextDescriptionButton}>
            <Text style={styles.textDescriptionButton}>¿No sabes por donde comenzar?</Text>
            <Text style={styles.textDescriptionButtonSubtitle}>Conoce a nuestros entrenadores para que te guien</Text>
          </View>
          <View style={styles.containerTouchableImage}>
            <TouchableOpacity style={styles.touchableContainerImage}
              onPress={() => changeUserScreen('ListTrainers')} >
              <ImageBackground source={ require('../../../assets/img/_1.jpg')} style={styles.imageButton}>
                <Text style={styles.textImageButton}>Entrenadores</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
    
          <View style={styles.containerTextDescriptionButton}>
            <Text style={styles.textDescriptionButton}>¿Deseas entrenar a tu manera?</Text>
            <Text style={styles.textDescriptionButtonSubtitle}>Crea tu plan personalizado</Text>
          </View>
          <View style={styles.containerTouchableImage}>
            <TouchableOpacity style={styles.touchableContainerImage}
              onPress={() => changeUserScreen('CustomPlan')} >
              <ImageBackground source={ require('../../../assets/img/_3.jpg')} style={styles.imageButton}>
                <Text style={styles.textImageButton}>Plan personalizado</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
          <View style={styles.containerTextDescriptionButton}>
            <Text style={styles.textDescriptionButton}>¿Cuanto eh mejorado?</Text>
            <Text style={styles.textDescriptionButtonSubtitle}>Registra tu progreso</Text>
          </View>
          <View style={styles.containerTouchableImage}>
            <TouchableOpacity style={styles.touchableContainerImage}
              onPress={() => changeUserScreen('StatisticsUserGeneral')} >
              <ImageBackground source={ require('../../../assets/img/_4.jpg')} style={styles.imageButton}>
                <Text style={styles.textImageButton}>Estadísticas</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>

          <View style={styles.containerTouchableImage}>
            <TouchableOpacity style={styles.touchableContainerImage}
              onPress={() => changeUserScreen('ListGyms')} >
              <ImageBackground source={ require('../../../assets/img/_6.jpg')} style={styles.imageButton}>
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