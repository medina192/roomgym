import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Button,
  Switch,
} from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/FontAwesome';

import TopBar from '../shared/TopBar';

import Colors from '../../colors/colors';

import SideBarTrainer from '../shared/SideBarTrainer';
import BottomBar from '../shared/BottomBarUser';

import {launchCamera, launchImageLibrary, ImagePickerResponse} from 'react-native-image-picker';

import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios';

import { urlServer } from '../../../services/urlServer';

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

  const dispatch = useDispatch();

  const T_trainer = useSelector(state => state.T_trainer);


  const [showButtonPhoto, setShowButtonPhoto] = useState(true);
  const [showButtonVideo, setShowButtonVideo] = useState(true);

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
          console.log(resp);
          
          setImageAdded({
            boolean: true,
            object: resp
          });
        }
      }
    });
  }


  const uploadImage = async (data) => {
    
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

    try {

      const formData = new FormData();
      formData.append('file', fileToUpload);


      const resp = await axios({
        method: 'post',
        url: 'http://192.168.0.9:3002/files/saveimage',
        data: formData,
        headers
      });
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
          console.log(resp);
          
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


  return (
    <>
      <TopBar navigation={navigation} title={`Bienvenido Entrenador`} returnButton={false} />
      
      <ScrollView>

        <View style={styles.containerTrainerCard}>
          <View style={styles.trainerCard}>
            <View style={styles.containerImage_Name}>
                <Icon name="user-o" size={24} style={styles.iconImage} color="#fff" />
              <Text style={styles.trainerName}>Alejandro Díaz Medina</Text>
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
        </View>

        {
          /*
        <View style={styles.containerAdvices}> 
          <View style={styles.advice}>
            <Text style={styles.adviceTitle}>Consejo 1</Text>
            <Text style={styles.advicedescription}>
                with the release of Letraset sheets containing Lorem Ipsum passages, and more
                recently with desktop publishing software like Aldus PageMaker including 
                versions of Lorem Ipsum
            </Text>
          </View>
        </View>
        <View style={styles.containerAdvices}> 
          <View style={styles.advice}>
            <Text style={styles.adviceTitle}>Consejo 2</Text>
            <Text style={styles.advicedescription}>
                with the release of Letraset sheets containing Lorem Ipsum passages, and more
                recently with desktop publishing software like Aldus PageMaker including 
                versions of Lorem Ipsum
            </Text>
          </View>
        </View>
          */
        }

        {
          showButtonPhoto ? 
          (
            <TouchableOpacity 
              onPress={() => setShowButtonPhoto(false)}
              style={{backgroundColor: '#0f0', padding: 10, marginTop: 10, width: '40%', marginLeft: 20}}>
              <Text>Añadir foto</Text>
            </TouchableOpacity>
          )
          :
          (
            <View style={styles.containerFileOptions}>
              <Text style={{fontSize: 16, marginTop: 10, marginBottom: 5}}>Nombre Imagen</Text>
              <View style={styles.containerBorderFileOptions}>
                  <TextInput 
                      style={styles.nameInput}
                      placeholderTextColor="#000"
                      multiline={false}
                      onChangeText={ (text) => setImageNameInputValue(text)}
                  />
              </View>

              <TouchableOpacity 
                onPress={takePhoto}
                style={{backgroundColor: '#0f0', padding: 10, marginTop: 10, width: '40%', marginLeft: 20}}>
                <Text>Tomar foto</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={galleryPhoto}
                style={{backgroundColor: '#0f0', padding: 10, marginTop: 10, width: '40%', marginLeft: 20}}>
                <Text>subir foto de la galería</Text>
              </TouchableOpacity>

              <View>
              {
                imageAdded.boolean ? 
                (
                  <Text>Has añadido una imagen exitosamente</Text>
                )
                :
                (
                  <Text>No has añadido una imagen aún</Text>
                )
              }
              </View>

              <Text>¿Deseas que la imagen sea publica?</Text>
              <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={imagePublic ? Colors.MainBlue : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setImagePublic(!imagePublic)}
                  value={imagePublic}
              />

              <Text>¿Deseas que la imagen se muestre en tu perfil?</Text>
              <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={imageShowInPerfil ? Colors.MainBlue : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setImageShowInPerfil (!imageShowInPerfil)}
                  value={imageShowInPerfil}
              />

              <View style={styles.containerButtonsCheck}>          
                  <TouchableOpacity
                    onPress={() => setShowButtonPhoto(true)}
                    style={styles.containerIconButtonClose}>
                    <Icon name="close" size={24} style={styles.iconButtonClose} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                      onPress={savePhoto}
                      style={styles.containerIconButtonAdd}>
                      <Icon name="check" size={24} style={styles.iconButtonAdd} color="#fff" />
                  </TouchableOpacity>
            </View>              

          </View>
          )
        }



        {
      
          showButtonVideo ? 
          (
            <TouchableOpacity 
              onPress={() => setShowButtonVideo(false)}
              style={{backgroundColor: '#0f0', padding: 10, marginTop: 10, width: '40%', marginLeft: 20}}>
              <Text>Añadir video</Text>
            </TouchableOpacity>
          )
          :
          (
            <View style={styles.containerFileOptions}>
              <Text style={{fontSize: 16, marginTop: 10, marginBottom: 5}}>Nombre Video</Text>
              <View style={styles.containerBorderFileOptions}>
                  <TextInput 
                      style={styles.nameInput}
                      placeholderTextColor="#000"
                      multiline={false}
                      onChangeText={ (text) => setVideoNameInputValue(text)}
                  />
              </View>

              <TouchableOpacity 
                onPress={takeVideo}
                style={{backgroundColor: '#0f0', padding: 10, marginTop: 10, width: '40%', marginLeft: 20}}>
                <Text>Tomar video</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={galleryVideo}
                style={{backgroundColor: '#0f0', padding: 10, marginTop: 10, width: '40%', marginLeft: 20}}>
                <Text>subir video de la galería</Text>
              </TouchableOpacity>

              <View>
              {
                videoAdded.boolean ? 
                (
                  <Text>Has añadido un video exitosamente</Text>
                )
                :
                (
                  <Text>No has añadido un video aún</Text>
                )
              }
              </View>

              <Text>¿Deseas que el video sea publica?</Text>
              <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={imagePublic ? Colors.MainBlue : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setVideoPublic(!videoPublic)}
                  value={videoPublic}
              />

              <Text>¿Deseas que el video se muestre en tu perfil?</Text>
              <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={imageShowInPerfil ? Colors.MainBlue : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setVideoShowInPerfil (!videoShowInPerfil)}
                  value={videoShowInPerfil}
              />

              <View style={styles.containerButtonsCheck}>          
                  <TouchableOpacity
                    onPress={() => setShowButtonVideo(true)}
                    style={styles.containerIconButtonClose}>
                    <Icon name="close" size={24} style={styles.iconButtonClose} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                      onPress={saveVideo}
                      style={styles.containerIconButtonAdd}>
                      <Icon name="check" size={24} style={styles.iconButtonAdd} color="#fff" />
                  </TouchableOpacity>
            </View>              

          </View>
          )
        }




        <TouchableOpacity 
          onPress={ () => navigation.navigate('CreatePdf')}
          style={{backgroundColor: '#0f0', padding: 10, marginTop: 10, width: '40%', marginLeft: 20}}>
          <Text>Crear archivo pdf</Text>
        </TouchableOpacity>

   
        <View style={styles.containerButtonSubscribe}>
          <TouchableOpacity style={styles.buttonSubscribe} onPress={ () => navigation.navigate('CreateNotes')}>
            <Text style={styles.textButoonSubscribe}>Crear nota</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.containerButtonSubscribe}>
          <TouchableOpacity style={styles.buttonSubscribe} onPress={ () => navigation.navigate('MainUserScreen')}>
            <Text style={styles.textButoonSubscribe}>Pantalla Usuario</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.containerButtonSubscribe}>
          <TouchableOpacity style={styles.buttonSubscribe} onPress={ () => navigation.navigate('Registro')}>
            <Text style={styles.textButoonSubscribe}>Pantalla Registro</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.containerButtonSubscribe}>
          <TouchableOpacity style={styles.buttonSubscribe} onPress={ () => navigation.navigate('Login')}>
            <Text style={styles.textButoonSubscribe}>Pantalla Login</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <BottomBar navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  containerTrainerCard:{
    paddingHorizontal: 15,
    paddingVertical: 20,
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

  // bottom bar
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
    borderColor: '#000',
    width: '85%',
    height: 50
  },
  nameInput:{
    color: '#000',
    fontSize: 20
  },
  

  // card options
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

});
