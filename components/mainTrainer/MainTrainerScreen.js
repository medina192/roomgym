import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Button,
  Switch,
  Image,
  Dimensions,
  ActivityIndicator
} from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/FontAwesome';

import { Icon as icon } from 'react-native-vector-icons/Fontisto';

import TopBar from '../shared/TopBar';

import Colors from '../../colors/colors';

import SideBarTrainer from '../shared/SideBarTrainer';
import BottomBar from '../shared/BottomBarUser';

import {launchCamera, launchImageLibrary, ImagePickerResponse} from 'react-native-image-picker';

import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios';

import { urlServer } from '../../services/urlServer';

import Video, {FilterType} from 'react-native-video';

import Pdf from 'react-native-pdf';

import { changeState } from '../../store/actions/actionsReducer';

import RNFetchBlob from 'rn-fetch-blob';

import DocumentPicker from 'react-native-document-picker';

import LinearGradient from 'react-native-linear-gradient';

import messaging from '@react-native-firebase/messaging';

const Drawer = createDrawerNavigator();

export default function MainTrainerScreen({navigation}) {

  return (
    <>
      <Drawer.Navigator drawerContent={( navigation) => <SideBarTrainer {...navigation} />}>
        <Drawer.Screen name="TrainerScreen" component={TrainerScreen} />
      </Drawer.Navigator>
    </>
  );
}


const TrainerScreen = ({navigation}) => {

  const serverUrl = urlServer.url;

  const dispatch = useDispatch();

  const T_trainer = useSelector(state => state.T_trainer);
  const state = useSelector(state => state.changeState);


  useEffect(() => {

    const unsubscribe = messaging().onMessage(async remoteMessage => {
        Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    messaging()
    .subscribeToTopic('entrenador')
    .then(() => console.log(' subscribe to entrenador'))
    .catch(error => console.log('error subscribed', error));

    const background = messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('notification background', JSON.stringify(remoteMessage))
    });
  
    
    return (unsubscribe, background) => {
      //unsubscribe();
      //topicSubscriber();
      //background();
      dispatch(changeState(!state));
    }

  }, []);


  const [showButtonPhoto, setShowButtonPhoto] = useState(true);
  const [showButtonVideo, setShowButtonVideo] = useState(true);
  const [showButtonPdf, setShowButtonPdf] = useState(true);

  const [imageNameInputValue, setImageNameInputValue] = useState('');
  const [imagePublic, setImagePublic] = useState(false);
  const [imageShowInPerfil, setImageShowInPerfil] = useState(false);
  const [imageAdded, setImageAdded] = useState({
    boolean: false,
    data: {}
  });

  const [videoNameInputValue, setVideoNameInputValue] = useState('');
  const [videoPublic, setVideoPublic] = useState(false);
  const [videoShowInPerfil, setVideoShowInPerfil] = useState(false);
  const [videoAdded, setVideoAdded] = useState({
    boolean: false,
    data: {}
  });

  const [pdfNameInputValue, setPdfNameInputValue] = useState('');
  const [pdfPublic, setPdfPublic] = useState(false);
  const [pdfShowInPerfil, setPdfShowInPerfil] = useState(false);
  const [pdfAdded, setPdfAdded] = useState({
    boolean: false,
    data: {}
  });

  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);

  const [disableButton, setDisableButton] = useState(false);



   // add photograph    begin _____________________________________________________________________

   const takePhoto = () => {

    launchCamera({
      mediaType: 'photo',
      quality: 0.5
    }, (resp) => {
 
      if(resp.didCancel)
      {

      }
      else{
        if(resp.uri)
        { 
          console.log('photo',resp);
          
          setImageAdded({
            boolean: true,
            object: resp
          });
        }
      }
    });
  }


  const uploadImage = async (data) => {
    
    setLoadingPhoto(true);

    const fileToUpload = {
      uri: data.uri,
      type: data.type,
      name: data.fileName
    }

    let publicImage = imagePublic ? true : false;
    let ShowInPerfil = imageShowInPerfil ? true : false;

    const bodyFile = {
      idTrainer: T_trainer.idusuario,
      trainerName: T_trainer.nombres,
      trainerLastName: T_trainer.apellidos,
      publicImage,
      ShowInPerfil,
      nameImage: imageNameInputValue
    }

    const bodyString = JSON.stringify(bodyFile);

    const headers = {
      'body': bodyString
    }

    const config = {
      headers
    }

    setDisableButton(true);

    setLoadingPhoto(true);

    try {

      const formData = new FormData();
      formData.append('file', fileToUpload);


      const resp = await axios({
        method: 'post',
        url: `${serverUrl}/files/saveimagecloud`,
        data: formData,
        headers
      });
      
      setLoadingPhoto(false);
      setDisableButton(false);
      setShowButtonPhoto(true);
      setImageNameInputValue('');
      setImagePublic(false);
      setImageShowInPerfil(false);      
      setImageAdded({
        boolean: false,
        data: {}
      });
     console.log('respones', resp);
    } catch (error) {
      console.log('error submiting image', error);
      Alert.alert('La imagen no se pudo cargar');
      setDisableButton(false);
      setLoadingPhoto(false);
    }
  }


  const galleryPhoto = async() => {
    launchImageLibrary({
      mediaType: 'photo',
      quality: 0.5
    }, (resp) => {
 
      if(resp.didCancel)
      {

      }
      else{
        if(resp.uri)
        { 
          console.log('gallery ',resp);
          
          setImageAdded({
            boolean: true,
            object: resp
          });
        }
      }
    });
  }


  const takeVideo = () => {

    launchCamera({
      mediaType: 'video',
      quality: 0.3
    }, (resp) => {
 
      if(resp.didCancel)
      {

      }
      else{
        if(resp.uri)
        { 
          console.log('a',resp);
          
          setVideoAdded({
            boolean: true,
            object: resp
          });
        }
      }
    });
  }

  const uploadVideo = async (data) => {
    
    

    const fileToUpload = {
      uri: data.uri,
      type: 'video/mp4',
      name: data.fileName
    }

    let publicVideo = videoPublic ? true : false;
    let ShowInPerfil = videoShowInPerfil ? true : false;

    const bodyFile = {
      idTrainer: T_trainer.idusuario,
      trainerName: T_trainer.nombres,
      trainerLastName: T_trainer.apellidos,
      publicVideo,
      ShowInPerfil,
      nameVideo: videoNameInputValue
    }

    const bodyString = JSON.stringify(bodyFile);

    const headers = {
      'body': bodyString
    }

    const config = {
      headers
    }

    setDisableButton(true);
    setLoadingVideo(true);
    try {

      const formData = new FormData();
      formData.append('file', fileToUpload);


      const resp = await axios({
        method: 'post',
        url: `${serverUrl}/files/savevideocloud`,
        data: formData,
        headers
      });
      setLoadingVideo(false);
      setDisableButton(false);
      setShowButtonVideo(true);
      setVideoNameInputValue('');
      setVideoPublic(false);
      setVideoShowInPerfil(false);      
      setVideoAdded({
        boolean: false,
        data: {}
      });
     console.log('respones', resp);
    } catch (error) {
      console.log('error submiting image', error);
      Alert.alert('El video no se pudo cargar');
      setLoadingVideo(false);
      setDisableButton(false);
    }
  }



  const galleryVideo = async() => {
    launchImageLibrary({
      mediaType: 'video',
      quality: 0.5
    }, (resp) => {
 
      if(resp.didCancel)
      {
  
      }
      else{
        if(resp.uri)
        { 
          setVideoAdded({
            boolean: true,
            object: resp
          });
        }
      }
    });
  }



  const savePhoto = () => {
    uploadImage(imageAdded.object);
  }


  const saveVideo = () => {
    uploadVideo(videoAdded.object);
  }

  // end photograph    end ________________________________________________________________________


  const pickDocument = async () => {
    setShowButtonPdf(false);
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
          url: `${serverUrl}/files/savefile`,
          data: formData
        });
        console.log('resp', resp);
      } catch (error) {
        console.log('error try', error); 
      }
    }
  }



  const savePdf = () => {
    uploadPdf(pdfAdded.object);
  }

  
  const uploadPdf = async (data) => {
    
    /*
    const fileToUpload = {
      uri: data.uri,
      type: 'video/mp4',
      name: data.fileName
    }

    let publicVideo = videoPublic ? true : false;
    let ShowInPerfil = videoShowInPerfil ? true : false;

    const bodyFile = {
      idTrainer: T_trainer.idusuario,
      trainerName: T_trainer.nombres,
      trainerLastName: T_trainer.apellidos,
      publicVideo,
      ShowInPerfil,
      nameVideo: videoNameInputValue
    }

    const bodyString = JSON.stringify(bodyFile);

    const headers = {
      'body': bodyString
    }

    const config = {
      headers
    }

    try {

      const formData = new FormData();
      formData.append('file', fileToUpload);


      const resp = await axios({
        method: 'post',
        url: 'http://192.168.0.9:3002/files/savevideo',
        data: formData,
        headers
      });
      setShowButtonVideo(true);
      setVideoNameInputValue('');
      setVideoPublic(false);
      setVideoShowInPerfil(false);      
      setVideoAdded({
        boolean: false,
        data: {}
      });
     console.log('respones', resp);
    } catch (error) {
      console.log('error submiting image', error);
    }
    */
  }

  const cancelPhoto = () => {
    setShowButtonPhoto(true);
    setImageAdded({
      boolean: false,
      data: {}
    });
  }

  const cancelVideo = () => {
    setShowButtonVideo(true);
    setVideoAdded({
      boolean: false,
      data: {}
    });
  }


  return (
    <>
      <TopBar navigation={navigation} title={`Hola ${T_trainer.nombres}`} returnButton={false} />
      
      <ScrollView style={{flex: 1, backgroundColor: Colors.White}}>
        <LinearGradient colors={[Colors.MainBlue, Colors.White]}>
          <View style={styles.containerTrainerCard}>
            <View style={styles.trainerCard}>
              <Text style={styles.trainerName}>{T_trainer.nombres+' '+T_trainer.apellidos}</Text>
              <Text style={styles.trainerDescription}>{T_trainer.descripcion_entrenador}</Text>
            </View>

            <View style={styles.optionsCard}>
              <View style={styles.containerFlexRow}>
                <Text style={styles.titleOption}>Mis usuarios</Text>

                <TouchableOpacity 
                      onPress={() => navigation.navigate('ListUsers')}
                      style={styles.buttonIconShowOptions}>
                      <Icon name="angle-double-right" size={24} style={styles.iconShowOptions} color="#fff" />
                </TouchableOpacity>

              </View>
              <View style={styles.blueLine}></View>
            </View>

            <View style={styles.optionsCard}>
              <View style={styles.containerFlexRow}>
                <Text style={styles.titleOption}>Subir foto</Text>


                {
                  showButtonPhoto ?
                  (
                    <TouchableOpacity 
                      onPress={() => setShowButtonPhoto(false)}
                      style={styles.buttonIconShowOptions}>
                      <Icon name="angle-double-down" size={24} style={styles.iconShowOptions} color="#fff" />
                    </TouchableOpacity>
                    
                  )
                  :
                  (
                    <>
                    </>
                  )
                }

              </View>

                
              <View style={styles.blueLine}></View>

              {
          showButtonPhoto ? 
          (
            <>
            </>
          )
          :
          (
            <View style={styles.containerOptionsCard}>
              <Text style={styles.nameFile}>Nombre Imagen</Text>


              <View>
              {
                imageAdded.boolean ? 
                (
                  <>
                          <Image width={100} height={50} source={{uri: imageAdded.object.uri,
                            width: 300, 
                            height: 300}} />

                          <Text 
                            style={{color: '#080', marginVertical: 5, textAlign: 'center'}}
                          >
                              Has añadido una imagen exitosamente¡
                          </Text>
                  </>
                )
                :
                (
                  <View style={styles.falseImage}>
                   <View style={styles.containerBorderFileOptions}>
                        <TextInput 
                            style={styles.nameInput}
                            placeholderTextColor="#999"
                            placeholder="Escribe el nombre aquí"
                            multiline={false}
                            onChangeText={ (text) => setImageNameInputValue(text)}
                        />
                    </View>
                    <Text style={{color: Colors.alertRed}}>No has añadido una imagen aún</Text>
                  </View>
                )
              }
              </View>

              <View style={styles.containerFlexRowOptionsButtons}>
                <TouchableOpacity 
                  onPress={takePhoto}
                  style={styles.optionsButtons}>
                  <Text style={styles.textButtonOptions}>Tomar foto</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={galleryPhoto}
                  style={styles.optionsButtons}>
                  <Text  style={styles.textButtonOptions}>Galería</Text>
                </TouchableOpacity>
              </View>


              <Text style={styles.textQuestion}>¿Deseas que la imagen sea publica?</Text>
              <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={imagePublic ? Colors.MainBlue : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setImagePublic(!imagePublic)}
                  value={imagePublic}
              />

              <Text style={styles.textQuestion}>¿Deseas que la imagen se muestre en tu perfil?</Text>
              <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={imageShowInPerfil ? Colors.MainBlue : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setImageShowInPerfil (!imageShowInPerfil)}
                  value={imageShowInPerfil}
              />

              <View style={styles.blueLine}></View>

              <View style={styles.containerButtonsCheck}>          
                  <TouchableOpacity
                    onPress={cancelPhoto}
                    style={styles.containerIconButtonClose}>
                    <Icon name="angle-double-up" size={24} style={styles.iconButtonClose} color="#fff" />
                  </TouchableOpacity>
                  {
                    loadingPhoto ? 
                    (
                      <ActivityIndicator
                        size={50}
                        color={Colors.MainBlue}
                        style={styles.activityIndicator}
                      />
                    )
                    :
                    (
                      <TouchableOpacity
                        onPress={savePhoto}
                        disabled={disableButton}
                        style={styles.containerIconButtonAdd}>
                        <Icon name="cloud-upload" size={24} style={styles.iconButtonAdd} color="#fff" />
                      </TouchableOpacity>
                    )
                  }
            </View>              

          </View>
          )
        }

            </View>




{
  //___________________________________________________________________________
}

            <View style={styles.optionsCard}>
              <View style={styles.containerFlexRow}>
                <Text style={styles.titleOption}>Subir Video</Text>
                {
                  showButtonVideo ?
                  (
                    <TouchableOpacity 
                      onPress={() => setShowButtonVideo(false)}
                      style={styles.buttonIconShowOptions}>
                      <Icon name="angle-double-down" size={24} style={styles.iconShowOptions} color="#fff" />
                    </TouchableOpacity>
                    
                  )
                  :
                  (
                    <>
                    </>
                  )
                }

              </View>

                
              <View style={styles.blueLine}></View>

              {
          showButtonVideo ? 
          (
            <>
            </>
          )
          :
          (
            <View style={styles.containerOptionsCard}>
              <Text style={styles.nameFile}>Nombre Video</Text>


              <View>
              {
                 videoAdded.boolean ? 
                (
                  <>
                      <View style={{height: 200, width: 200, backgroundColor: '#444'}}>
                                      <Video source={{uri: videoAdded.object.uri}}   // Can be a URL or a local file.
                            style={{ flex: 1 }}
                            //controls={true}
                            resizeMode="contain"
                          />
                      </View>

                          <Text 
                            style={{color: '#080', marginVertical: 5, textAlign: 'center'}}
                          >
                              Has añadido un video exitosamente¡
                          </Text>
                  </>
                )
                :
                (
                  <View style={styles.falseImage}>
                   <View style={styles.containerBorderFileOptions}>
                        <TextInput 
                            style={styles.nameInput}
                            placeholderTextColor="#999"
                            placeholder="Escribe el nombre aquí"
                            multiline={false}
                            onChangeText={ (text) => setVideoNameInputValue(text)}
                        />
                    </View>
                    <Text style={{color: Colors.alertRed}}>No has añadido ningún video aún</Text>
                  </View>
                )
              }
              </View>

              <View style={styles.containerFlexRowOptionsButtons}>
                <TouchableOpacity 
                  onPress={takeVideo}
                  style={styles.optionsButtons}>
                  <Text style={styles.textButtonOptions}>Tomar Video</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={galleryVideo}
                  style={styles.optionsButtons}>
                  <Text  style={styles.textButtonOptions}>Galería</Text>
                </TouchableOpacity>
              </View>


              <Text style={styles.textQuestion}>¿Deseas que el video sea publica?</Text>
              <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={videoPublic ? Colors.MainBlue : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setVideoPublic(!videoPublic)}
                  value={videoPublic}
              />

              <Text style={styles.textQuestion}>¿Deseas que la imagen se muestre en tu perfil?</Text>
              <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={videoShowInPerfil ? Colors.MainBlue : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setVideoShowInPerfil (!videoShowInPerfil)}
                  value={videoShowInPerfil}
              />

              <View style={styles.blueLine}></View>

              <View style={styles.containerButtonsCheck}>          
                  <TouchableOpacity
                    onPress={cancelVideo}
                    style={styles.containerIconButtonClose}>
                    <Icon name="angle-double-up" size={24} style={styles.iconButtonClose} color="#fff" />
                  </TouchableOpacity>
                  {
                    loadingVideo ? 
                    (
                      <ActivityIndicator
                        size={50}
                        color={Colors.MainBlue}
                        style={styles.activityIndicator}
                      />
                    )
                    :
                    (
                      <TouchableOpacity
                        onPress={saveVideo}
                        disabled={disableButton}
                        style={styles.containerIconButtonAdd}>
                        <Icon name="cloud-upload" size={24} style={styles.iconButtonAdd} color="#fff" />
                      </TouchableOpacity>
                    )
                  }
              </View>              

            </View>
            )
          }

          </View>



{
  //_________________________________
}


            <View style={styles.optionsCard}>
              <View style={styles.containerFlexRow}>
                <Text style={styles.titleOption}>Crear Pdf</Text>

                <TouchableOpacity 
                      onPress={() => navigation.navigate('CreatePdf')}
                      style={styles.buttonIconShowOptions}>
                      <Icon name="angle-double-right" size={24} style={styles.iconShowOptions} color="#fff" />
                </TouchableOpacity>

              </View>
              <View style={styles.blueLine}></View>
            </View>


            <View style={styles.optionsCard}>
              <View style={styles.containerFlexRow}>
                <Text style={styles.titleOption}>Subir Pdf</Text>

                <TouchableOpacity 
                      onPress={() => navigation.navigate('UploadPdf')}
                      style={styles.buttonIconShowOptions}>
                      <Icon name="angle-double-right" size={24} style={styles.iconShowOptions} color="#fff" />
                </TouchableOpacity>

              </View>
              <View style={styles.blueLine}></View>
            </View>



            <View style={styles.optionsCard}>
              <View style={styles.containerFlexRow}>
                <Text style={styles.titleOption}>Actualizar Gimnasio</Text>

                <TouchableOpacity 
                      onPress={ () => navigation.navigate('MyGymTrainer')}
                      style={styles.buttonIconShowOptions}>
                      <Icon name="angle-double-right" size={24} style={styles.iconShowOptions} color="#fff" />
                </TouchableOpacity>

              </View>
              <View style={styles.blueLine}></View>
            </View>



            <View style={styles.optionsCard}>
              <View style={styles.containerFlexRow}>
                <Text style={styles.titleOption}>Registrar Gimnasio</Text>

                <TouchableOpacity 
                      onPress={ () => navigation.navigate('CreateGym')}
                      style={styles.buttonIconShowOptions}>
                      <Icon name="angle-double-right" size={24} style={styles.iconShowOptions} color="#fff" />
                </TouchableOpacity>

              </View>
              <View style={styles.blueLine}></View>
            </View>


        </View>

        </LinearGradient>


   
{
  /*
          <View style={styles.containerButtonSubscribe}>
          <TouchableOpacity style={styles.buttonSubscribe} onPress={ () => navigation.navigate('CreateNotes')}>
            <Text style={styles.textButoonSubscribe}>Crear nota</Text>
          </TouchableOpacity>
        </View>
  */
}


      </ScrollView>

      <BottomBar navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  containerTrainerCard:{
    paddingVertical: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trainerCard:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
        width: 10,
        height: 15,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
    width: Dimensions.get('window').width * 0.9,
    marginBottom: 80
  },
  trainerName:{
    fontSize: 22,
    fontWeight: '700',
    color: Colors.MainBlue,
  },
  trainerDescription:{
    fontSize: 16,
    marginTop: 5,
    color: Colors.MainBlue
  },

  optionsCard:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
        width: 10,
        height: 15,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
    width: Dimensions.get('window').width * 0.9,
    marginVertical: 10
  },
  containerFlexRow:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.8
  },
  titleOption:{
    color: Colors.MainBlue,
    fontSize: 20,
    fontWeight: '700'
  },
  buttonIconShowOptions:{
  },
  iconShowOptions:{
    color: Colors.MainBlue,
    fontSize: 28
  },

  blueLine:{
    width: Dimensions.get('window').width * 0.8,
    height: 1,
    backgroundColor: Colors.MainBlue,
    marginTop: 10,
    marginBottom: 10
  },

  // hide options
  containerOptionsCard:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  containerFlexRowOptionsButtons:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  nameFile:{
    fontSize: 18, 
    marginVertical: 10, 
    fontWeight: '700', 
    color: Colors.MainBlue
  },
  falseImage:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsButtons:{
    backgroundColor: Colors.MainBlue,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 10,
    marginHorizontal: 10
  },
  textButtonOptions:{
    color: '#fff',
    fontWeight: '700',
    fontSize: 16
  },
  textQuestion:{
    fontSize: 16,
    color: Colors.MainBlue,
    marginTop: 10
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

// advices

  containerAdvices:{
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  advice:{
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#244EABa0",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  adviceTitle:{
    fontSize: 22,
    color: '#fff'
  },
  advicedescription:{
    fontSize: 18
  },


  // button subscribe
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







  //name input
  containerFileOptions:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#bbb',
    padding: 10
  },
  containerBorderFileOptions:{
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderColor: Colors.MainBlue,
    marginBottom: 10
  },
  nameInput:{
    color: '#000',
    fontSize: 16,
    width: Dimensions.get('window').width * 0.8
  },
  

  // card options
  containerButtonsCheck:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    marginTop: 10
  },
  containerIconButtonAdd:{
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: Colors.Orange,
    width: 50,
    height: 50,
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
    backgroundColor: Colors.MainBlue,
    width: 50,
    height: 50,
    marginHorizontal: 5
  },
  iconButtonAdd:{
    fontSize: 28,
  },
  iconButtonClose:{
    fontSize: 28,
  },

});
