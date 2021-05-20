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

const Drawer = createDrawerNavigator();


export default function CreateNotes() {


  return (
    <>
      <Drawer.Navigator drawerContent={(props) => <SideBarTrainer {...props} />}>
        <Drawer.Screen name="CreateNotes" component={CreateNotesScreen}/>
      </Drawer.Navigator>
    </>
  );
}



const CreateNotesScreen = ({navigation}) => {


  const serverUrl = urlServer.url;

  const [showTextInput, setShowTextInput] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');
  const [currentText, setCurrentText] = useState({
      fontSize: 15,
      fontWeight: '300', // light
      color: '#000000'
  });
  const REMOTE_IMAGE_PATH = 'http://192.168.0.9:3002/videos/mov_bbb.mp4';
  useEffect(() => {

   /*
    axios({
        method: 'get',
        url: `${serverUrl}/files/downloadfile`,
      })
      .then(function (response) {
          console.log('routine',response);
      })
      .catch(function (error) {
          console.log('error axios',error);
      });
   */

      const permission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: "Cool Photo App Camera Permission",
              message:
                "Cool Photo App needs access to your camera " +
                "so you can take awesome pictures.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use");
          } else {
            console.log("permission denied");
          }
        } catch (err) {
          console.log('error',err);
        }
      };

      const isPermitted = async () => {
        if (Platform.OS === 'android') {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
              {
                title: 'External Storage Write Permission',
                message: 'App needs access to Storage data',
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
              },
            );
            console.log('resp per', granted);
            if (granted === PermissionsAndroid.RESULTS.GRANTED)
            {
                console.log('goog');
                downloadImage();
            }
            else{
                console.log('not');
            }
          } catch (err) {
            console.log('error', err);
            return false;
          }
        } else {
          return true;
        }
      };

      isPermitted();

      //permission();
  }, []);



  const downloadImage = () => {
    // Main function to download the image
    // https://aboutreact.com/download-image-in-react-native/    image
    // To add the time suffix in filename
    let date = new Date();
    // Image URL which we want to download
    let image_URL = REMOTE_IMAGE_PATH;    
    // Getting the extention of the file
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const { config, fs } = RNFetchBlob;
    console.log('fs', fs);
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/image_' + 
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        // Showing alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        alert('Image Downloaded Successfully.');
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



  const addEditOption = (type, value) => {

  }

  const selectFontWeight = (value) => {
    setCurrentText({
        ...currentText,
        fontWeight: value
    });
  }

  const selectFontSize = (value) => {
    setCurrentText({
        ...currentText,
        fontSize: value
    });
  }

  const selectFontColor = (value) => {
    setCurrentText({
        ...currentText,
        color: value
    });
  }

  const setTextInput = (text) => {
        setTextInputValue(text);
  }
  
  console.log('text', textInputValue);

  for(let i = 0; i < textInputValue.length; i++)
  {
      console.log('i',textInputValue[i]);
  }
  
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'fff'}}>
        <TopBar navigation={navigation} title={`Bienvenido Usuario`} returnButton={true} />
        <View style={{height: 200, width: 200, backgroundColor: '#444'}}>
        <Video source={{uri: "file:///storage/emulated/0/Pictures/image_1621468552407.mp4"}}   // Can be a URL or a local file.
          style={{ flex: 1 }}
          controls={true}
          resizeMode="contain"
        />
        </View>
        <Image width={100} height={50} source={{uri: 'file:///storage/emulated/0/Pictures/image_1621465488852.png',
                        width: 100, 
                        height: 100}} />
        <ScrollView style={{flex: 1, backgroundColor: '#fff'}}> 
            <View style={styles.containerNote}>
                <View style={styles.containerNoteShadow}>
                    <View style={styles.note}>
                        <Text>{textInputValue}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.containerEditOptions}>
                <View style={styles.containerMainTextInput}>
                    <TextInput 
                        style={styles.mainTextInput}
                        placeholderTextColor="#000"
                        multiline={true}
                        onChangeText={ (text) => setTextInput(text)}
                    />
                </View>
                <Text>Añadir</Text>
                <View style={styles.containerButtonsAdd}>
                    <TouchableOpacity style={styles.buttonAddOption} onPress={() => setShowTextInput(true)}>
                        <Text style={styles.textButton}>Texto</Text>
                    </TouchableOpacity>
                    <View style={styles.containerLightBoldButtons}>
                        <TouchableOpacity style={styles.buttonFontWeight} onPress={() => selectFontWeight('300')}>
                            <Text style={styles.textLigth}>N</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonFontWeight} onPress={() => selectFontWeight('700')}>
                            <Text style={styles.textBold}>N</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text>Colores</Text>
                <View style={styles.containerColorButtons}>
                    <TouchableOpacity style={styles.buttonRedColor} onPress={() => selectFontColor('#ff0000')}>
                        <Text style={styles.textLigth}></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonGreenColor} onPress={() => selectFontColor('#00ff00')}>
                        <Text style={styles.textBold}></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonBlueColor} onPress={() =>  selectFontColor('#0000ff')}>
                        <Text style={styles.textBold}></Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text>Tamaño</Text>
            <View style={styles.containerSizeButtons}>
                        <TouchableOpacity style={styles.buttonFontWeight} onPress={() => selectFontSize(10)}>
                            <Text style={styles.textBold}>10</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonFontWeight} onPress={() => selectFontSize(16)}>
                            <Text style={styles.textBold}>16</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonFontWeight} onPress={() => selectFontSize(22)}>
                            <Text style={styles.textBold}>22</Text>
                        </TouchableOpacity>
                    </View>
        </ScrollView>
        <BottomBar navigation={navigation}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    //note view
    containerNote:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 20
    },
    containerNoteShadow:{
        backgroundColor: '#fff',
        borderTopLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.41,
        shadowRadius: 10,
        elevation: 5,
    },
    note:{
        backgroundColor: '#fff',
        width: Dimensions.get('window').width*0.9,
        minHeight: Dimensions.get('window').height*0.2,
        padding: 5,
        borderTopLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.41,
        shadowRadius: 10,
        elevation: 5,
        display: 'flex',
        flexDirection: 'row'
    },

    // options edit buttons
    containerEditOptions:{
        paddingHorizontal: 10,
    },
    containerButtonsAdd:{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    buttonAddOption:{
        backgroundColor: '#0f0'
    },
    textButton:{
        padding: 10,
        backgroundColor: '#ddd',
        fontSize: 20,
        width: 100,
        fontWeight: '700'
    },
    containerLightBoldButtons:{
        display: 'flex',
        flexDirection: 'row'
    },
    buttonFontWeight:{
        backgroundColor: '#ddd',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    textBold:{
        fontWeight: '700',
        fontSize: 20,
        width: 30,
        textAlign: 'center'
    },
    textLigth:{
        fontSize: 20,
        fontWeight: '100',
        width: 30,
        textAlign: 'center'
    },

    //colors
    containerColorButtons:{
        display: 'flex',
        flexDirection: 'row',
    },
    buttonBlueColor:{
        backgroundColor: '#00f',
        width: 40,
        height: 40,
        marginRight: 5
    },
    buttonGreenColor:{
        backgroundColor: '#0d0',
        width: 40,
        height: 40,
        marginRight: 5
    },
    buttonRedColor:{
        backgroundColor: '#f00',
        width: 40,
        height: 40,
        marginRight: 5
    },

    // size
    containerSizeButtons:{
        padding: 10,
        display: 'flex',
        flexDirection: 'row'
    },  

    // text input
    containerMainTextInput:{
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderTopLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderColor: '#000'
    },
    mainTextInput:{
        color: '#000'
    },
});
