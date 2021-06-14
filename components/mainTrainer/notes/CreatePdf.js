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

import Pdf from 'react-native-pdf';

import { openDatabase } from 'react-native-sqlite-storage';
import SavedNote from './SavedNote';
import EditNote from './EditNote';
import { createIconSetFromFontello } from 'react-native-vector-icons';


 
var db = openDatabase({ name: 'SchoolDatabase.db' });
 

const Drawer = createDrawerNavigator();


export default function CreatePdf() {

  return (
    <>
      <Drawer.Navigator drawerContent={(props) => <SideBarTrainer {...props} />}>
        <Drawer.Screen name="CreatePdf" component={CreatePdfScreen}/>
      </Drawer.Navigator>
    </>
  );
}



const CreatePdfScreen = ({navigation}) => {


  const dispatch = useDispatch();

  const T_trainer = useSelector(state => state.T_trainer);


  const serverUrl = urlServer.url;

  const [showTextInput, setShowTextInput] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');
  const [nameInputValue, setNameInputValue] = useState('');
  const [currentText, setCurrentText] = useState({
      fontSize: 10,
      fontWeight: '300', // light
      color: '#000000'
  });
  const [state, setState] = useState(false);
  const [paragraphs, setParagraphs] = useState([]);
  const [pdfCreated, setPdfCreated] = useState(false);


  //const REMOTE_IMAGE_PATH = 'http://192.168.0.9:3002/videos/mov_bbb.mp4';
  const REMOTE_IMAGE_PATH = 'http://192.168.0.9:3002/pdf/dieta.pdf';
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
     
            if (granted === PermissionsAndroid.RESULTS.GRANTED)
            {
                
                //downloadImage();
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

      const createTable = () => {
        db.transaction(function (txn) {
          txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='Student_Table'",
            [],
            function (tx, res) {
              console.log('item:', res.rows.length);
              if (res.rows.length == 0) {
                txn.executeSql('DROP TABLE IF EXISTS Student_Table', []);
                txn.executeSql(
                  'CREATE TABLE IF NOT EXISTS Student_Table(student_id INTEGER PRIMARY KEY AUTOINCREMENT, student_name VARCHAR(30), student_phone INT(15), student_address VARCHAR(255))',
                  []
                );
              }
            }
          );
        })
        console.log('SQLite Database and Table Successfully Created...');
      };

      createTable();
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

  const downloadPdf = () => {
    console.log('hi');
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
  


  const createPdf = () => {


    if(!nameInputValue == '')
    {
      if(paragraphs.length > 0)
      {
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
      }
      else{
        console.log('set at least one paragraph');
      }
    }
    else{
      console.log('the pdf must have name');
    }
  }

  const downloadPdf1 = () => {

    downloadPdf();
    
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
  }
  
  //const source = {uri:'http://samples.leanpub.com/thereactnativebook-sample.pdf',cache:true};
  //const source = {uri:'http://192.168.0.9:3002/pdf/dieta.pdf',cache:true};
  const source = {uri:'https://www.ti.com/lit/ds/symlink/lm555.pdf',cache:true};

  const checkMeasure = (event) => {
    
    var {x, y, width, height} = event.nativeEvent.layout;

    console.log('event', height);
  }



  const insertData = () => {

    let S_Name = 'Alejandro';
    let S_Phone = '34543';
    let S_Address = 'homo';
 
    if (S_Name == '' || S_Phone == '' || S_Address == '') {
      Alert.alert('Please Enter All the Values');
    } else {
 
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO Student_Table (student_name, student_phone, student_address) VALUES (?,?,?)',
          [S_Name, S_Phone, S_Address],
          (tx, results) => {
            console.log('Results', results);
            console.log('tx', tx);
            if (results.rowsAffected > 0) {
              Alert.alert('Data Inserted Successfully....');
            } else Alert.alert('Failed....');
          }
        );
      });
 
    }
  }


  const getData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Student_Table',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          console.log('results---', results.rows.item(3));

 
        }
      );
 
    });
  }


  // add remove  paragraphs    begin_____________________________________________________________________
  
  const addNewParagraph = () => {

    for(let i = 0; i <paragraphs.length; i++)
    {
      paragraphs[i].edit = false;
    }
     
    setParagraphs(paragraphs);

    setShowTextInput(true);
     
     let paragraphTemplate = {
       text: '',
       fontSize: 20,
       fontWeight: '400',
       color: '#000000',
       edit: true 
     }

     paragraphs.push(paragraphTemplate);
     setParagraphs(paragraphs);
     setState(!state);

  }



  const cancelParagraph = (indexParagraph) => {
    paragraphs.splice(indexParagraph, 1);
    setParagraphs(paragraphs);
    setShowTextInput(false);
    setTextInputValue('');
    setState(!state);
  }


  const editParagraph = (indexParagraph) => {


    for(let i = 0; i <paragraphs.length; i++)
    {
      paragraphs[i].edit = false;
    }

    setTextInputValue(paragraphs[indexParagraph].text);

    paragraphs[indexParagraph].edit = true;

    setParagraphs(paragraphs);

    setCurrentText({
      color: paragraphs[indexParagraph].color,
      fontWeight: paragraphs[indexParagraph].fontWeight,
      fontSize: paragraphs[indexParagraph].fontSize,
    });
    setShowTextInput(true);
  }


  const saveParagraph = (indexParagraph) => {

    paragraphs[indexParagraph] = {
      text: textInputValue,
      fontSize: currentText.fontSize,
      fontWeight: currentText.fontWeight,
      color: currentText.color,
      edit: false
    }

    setCurrentText({
        fontSize: 10,
        fontWeight: '300', // light
        color: '#000000'
    });

    setParagraphs(paragraphs);
    setShowTextInput(false);
    setTextInputValue('');

  }

  // add remove  paragraphs    end_____________________________________________________________________





 
 

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'fff'}}>
        <TopBar navigation={navigation} title={`Bienvenido Usuario`} returnButton={true} />

        <ScrollView style={{flex: 1, backgroundColor: '#fff'}}> 
            <Text style={{fontSize: 16, marginLeft: 3, marginTop: 10, textAlign: 'center'}}>Nombre pdf</Text>
            <View style={styles.containerNameInput}>
                <View style={styles.containerBorderNameInput}>
                    <TextInput 
                      style={styles.nameInput}
                      placeholderTextColor="#000"
                      multiline={false}
                      value={nameInputValue}
                      onChangeText={ (text) => setNameInputValue(text)}
                    />
                </View>
            </View>

            <View style={styles.containerNote}>
                <View style={styles.containerNoteShadow}>
                    <View style={styles.note}>
                        {
                          
                          paragraphs.map( (paragraph, indexParagraph) => {
                            if(!paragraph.edit)
                            {
                              return(
                                <View key={indexParagraph} style={{width: '100%'}}>
                                  <Text
                                    style={{
                                      color: paragraph.color,
                                      fontSize: paragraph.fontSize,
                                      fontWeight: paragraph.fontWeight
                                    }}
                                  >{paragraph.text}</Text>

                                  <View style={styles.containerButtonsCheck}>
                                    <TouchableOpacity
                                      onPress={() => editParagraph(indexParagraph)}
                                      style={styles.containerIconButtonAdd}>
                                      <Icon name="edit" size={24} style={styles.iconButtonAdd} color="#fff" />
                                    </TouchableOpacity>
                      
                                    <TouchableOpacity
                                      onPress={() => cancelParagraph(indexParagraph)}
                                      style={styles.containerIconButtonClose}>
                                      <Icon name="close" size={24} style={styles.iconButtonClose} color="#fff" />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={{width:'100%', height: 1, backgroundColor: '#000'}}>
                                  </View>
                                </View>
                              )
                            }
                            else{

                              return(
                                <View key={indexParagraph} style={{ width: '100%'}}>
                                  <Text
                                    style={{
                                      color: currentText.color,
                                      fontSize: currentText.fontSize,
                                      fontWeight: currentText.fontWeight
                                    }}
                                  >{textInputValue}</Text>

                                  <View style={styles.containerButtonsCheck}>
                                    <TouchableOpacity
                                      onPress={() => saveParagraph(indexParagraph)}
                                      style={styles.containerIconButtonAdd}>
                                      <Icon name="check" size={24} style={styles.iconButtonAdd} color="#fff" />
                                    </TouchableOpacity>
                      
                                    <TouchableOpacity
                                      onPress={() => cancelParagraph(indexParagraph)}
                                      style={styles.containerIconButtonClose}>
                                      <Icon name="close" size={24} style={styles.iconButtonClose} color="#fff" />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={{width:'100%', height: 1, backgroundColor: '#000'}}>
                                  </View>
                                </View>
                              )
                            }

                          })
                          
                        }
                    </View>
                </View>
            </View>

            <View style={styles.containerEditOptions}>
                
                {
                  showTextInput ? 
                  (
                    <View style={styles.containerMainTextInput}>
                      <TextInput 
                          style={styles.mainTextInput}
                          placeholderTextColor="#000"
                          multiline={true}
                          value={textInputValue}
                          onChangeText={ (text) => setTextInput(text)}
                      />
                    </View>
                  )
                  :
                  (
                    <>
                    </>
                  )
                }

                {
                    pdfCreated ? 
                    (
                        <Text style={{backgroundColor: '#00b', color: '#fff', padding: 15, margin: 15}}>Pdf Crated</Text>
                    )
                    :
                    (
                        <>
                        </>
                    )
                }

                <Text>Añadir</Text>
                <View style={styles.containerButtonsAdd}>
                    <TouchableOpacity 
                      style={showTextInput ? styles.buttonAddOptionDisabled : styles.buttonAddOption} 
                      onPress={addNewParagraph}
                      disabled={showTextInput}
                    >
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
                        <TouchableOpacity style={styles.buttonFontWeight} onPress={() => selectFontSize(20)}>
                            <Text style={styles.textBold}>20</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonFontWeight} onPress={() => selectFontSize(28)}>
                            <Text style={styles.textBold}>28</Text>
                        </TouchableOpacity>
            </View>
            <TouchableOpacity 
              //onPress={createPdf}  
              style={{backgroundColor: Colors.MainBlue, padding: 10, marginVertical: 10, marginLeft: 20, width: 200}}>
              <Text style={{color:'#fff', fontSize: 16, fontWeight: '700', textAlign:'center'}}>Crear Pdf</Text>
            </TouchableOpacity>
            {
              /*
              <TouchableOpacity onPress={downloadPdf1} style={{backgroundColor: Colors.MainBlue, padding: 10, marginVertical: 10, marginLeft: 20, width: 200}}>
                <Text style={{color:'#fff', fontSize: 16, fontWeight: '700', textAlign: 'center'}}>Descargar Pdf</Text>
              </TouchableOpacity>
              */
            }

        </ScrollView>
        <BottomBar navigation={navigation}/>
    </SafeAreaView>
  );


};




const styles = StyleSheet.create({

    //name input
    containerNameInput:{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 5
    },
    containerBorderNameInput:{
      borderBottomWidth: 2,
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderTopWidth: 2,
      borderTopLeftRadius: 5,
      borderBottomRightRadius: 5,
      borderTopRightRadius: 5,
      borderBottomLeftRadius: 5,
      borderColor: '#000',
      width: '85%',
      height: 50
    },
    nameInput:{
      color: '#000',
      fontSize: 20
    },


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
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        minWidth: Dimensions.get('window').width*0.9,
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
    containerButtonsCheck:{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingVertical: 10
    },
    containerIconButtonAdd:{
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
      display: 'flex',
      justifyContent: 'center',
      alignItems:'center',
      backgroundColor: '#0d0',
      width: 40,
      height: 40,
      marginHorizontal: 5
    },
    containerIconButtonClose:{
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
      display: 'flex',
      justifyContent: 'center',
      alignItems:'center',
      backgroundColor: '#d00',
      width: 40,
      height: 40,
      marginHorizontal: 5
    },
    iconButtonAdd:{
      fontSize: 22,
    },
    iconButtonClose:{
      fontSize: 22,
    },
    buttonAddOption:{
        backgroundColor: '#dddddd'
    },
    buttonAddOptionDisabled:{
      backgroundColor: '#dddddd44'
  },
    textButton:{
        padding: 10,
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
