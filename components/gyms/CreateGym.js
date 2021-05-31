import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

import axios from 'axios';

import Colors from '../../colors/colors';

import TopBar from '../shared/TopBar';
import BottomBar from '../shared/BottomBarUser';

import { openDatabase } from 'react-native-sqlite-storage';
import { ScrollView } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/FontAwesome';

import { useDispatch, useSelector } from 'react-redux';

import { Button, Paragraph, Dialog, Portal } from 'react-native-paper';
import { urlServer } from '../../services/urlServer';

import  SideBarTrainer  from '../shared/SideBarTrainer';

import { createDrawerNavigator } from '@react-navigation/drawer';
import AlertComponent from '../shared/AlertComponent';

const db = openDatabase({ name: 'roomGym.db' });

const Drawer = createDrawerNavigator();

export default function CreateGym() {
  return (
    <>
      <Drawer.Navigator drawerContent={(props) => <SideBarTrainer {...props} />}>
        <Drawer.Screen name="CreateGym" component={CreateGymScreen} />
      </Drawer.Navigator>
    </>
  );
}


const CreateGymScreen = ({navigation}) => {



  const serverUrl = urlServer.url;

  const T_trainer = useSelector(state => state.T_trainer);

  const [textInputValue, setTextInputValue] = useState({
    nombre: '',
    ciudad: '',
    entidad: '',
    domicilio: '',
    telefono: '',
  });
  const [showAlert, setShowAlert] = useState({
    show: false,
    type: 'error',
    action: 'close', 
    message: '', 
    title: '', 
    iconAlert: 'times-circle',
    nextScreen: 'MyGymTrainer'
  });

  const [errorMesssageAlert, setErrorMesssageAlert] = useState('');
  const [visible, setVisible] = useState(false); // alert
  const [mainIndicator, setMainIndicator] = useState(true);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);


  useEffect(() => {
    axios({
      method: 'get',
      url: `${serverUrl}/gyms/searchgym/${T_trainer.idusuario}`,
    })
    .then(function (response) {
        console.log('pdf',response.data.resp);
        if(response.data.resp.length > 0)
        {
          setMainIndicator(false);
          setShowAlert({
            show: true,
            type: 'warn',
            action: 'return', 
            message: 'Puedes editar el que ya tienes, o borrarlo y crear uno nuevo', 
            title: 'Ya tienes un gimnasio', 
            iconAlert: 'warning',
            nextScreen: 'MyGymTrainer'
          });
        }
        else{
          setMainIndicator(false);
        }

    })  
    .catch(function (error) {  
      console.log('error axios',  error);
      if(error == {})
      {
        console.log('error axios',error?.response.status);
        console.log('error axios',error?.response.data);
        setMainIndicator(false);
        setShowAlert({
          show: true,
          type: 'error',
          action: 'return', 
          message: 'Verifica tu conexión a internet', 
          title: 'No se pudo conectar con el servidor', 
          iconAlert: 'wifi',
          nextScreen: 'MyGymTrainer'
        });
      }
      else{
        console.log('the server is disconnected');
        setMainIndicator(false);
        setShowAlert({
          show: true,
          type: 'error',
          action: 'return', 
          message: 'Verifica tu conexión a internet', 
          title: 'No se pudo conectar con el servidor', 
          iconAlert: 'wifi',
          nextScreen: 'MyGymTrainer'
        });
      }

    });
  }, []);



  const setInputValue = (data, input) => {

    switch (input) {

      case "nombre":
        setTextInputValue({
          ...textInputValue,
          nombre: data
        });
      break;

      case "ciudad":
        setTextInputValue({
          ...textInputValue,
          ciudad: data
        });
      break;
    
      case "entidad":
        setTextInputValue({
          ...textInputValue,
          entidad: data
        });
      break;

      case "domicilio":
        setTextInputValue({
          ...textInputValue,
          domicilio: data
        });
      break;

      case "telefono":
        setTextInputValue({
          ...textInputValue,
          telefono: data
        });
      break;

      default:
        break;
    }
  }
    


  const saveGym = () => {

    setMainIndicator(true);

    const checkIsGood = checkTextInputs();

    if(!checkIsGood)
    {
      return false;
    }

    if(checkIsGood)
    {
      axios({
        method: 'post',
        url: `${serverUrl}/gyms/registergym`,
        data: {
          idEntrenador: T_trainer.idusuario,
          nombre: textInputValue.nombre,
          ciudad: textInputValue.ciudad,
          entidad: textInputValue.entidad,
          domicilio: textInputValue.domicilio,
          telefono: textInputValue.telefono,
        }
      })
      .then(function (response) {
        console.log('resp messages',response);
        setShowAlert({
          show: true,
          type: 'good',
          action: 'next', 
          message: 'Vamos a agregar algunas características extras al perfil de tu gimansio', 
          title: 'Bien Hecho', 
          iconAlert: 'check',
          nextScreen: 'MyGymTrainer'
        });
      })
      .catch(function (error) {
          console.log('error axios get messages',error);
      });
    }
    else{
      setErrorMesssageAlert('Faltan campos por completar');
      showDialog();
    }

  }

  const checkTextInputs = () => {
    
    if(textInputValue.nombre == '' || textInputValue.ciudad == '' || textInputValue.entidad == ''
    || textInputValue.domicilio == '' || textInputValue.telefono == '' )
    {
      setShowAlert({
        show: true,
        type: 'warn',
        action: 'close', 
        message: 'Llena todos los campos con la información que se te pide', 
        title: 'Uno o más campos estan incompletos', 
        iconAlert: 'warning',
        nextScreen: 'MyGymTrainer'
      });
      return false;
    }
    else{
      return true;
    }
  }

  return (
    <SafeAreaView style={{flex: 1, position: 'relative'}}>
       <TopBar navigation={navigation} title={'Registrar Gimnasio'} returnButton={true}/>
        {
          mainIndicator ? 
          (
            <View style={styles.containerIndicator}>
              <ActivityIndicator
                size={80}
                color={Colors.MainBlue}
                style={styles.activityIndicator}
              />
            </View>
          )
          :
          (
            <ScrollView style={{flex: 1}}>
            <View style={styles.mainContainer}>
              <Text style={styles.title}>Nuevo Gimnasio</Text>
  
              <Text style={styles.nameTextInput}>Nombre</Text>
              <View style={styles.containerTextInput}>
                <TextInput
                  placeholder="Nombre"
                  placeholderTextColor="#559"
                  onChangeText={(text) => setInputValue(text, 'nombre')}
                  style={styles.textInput}
                />
              </View>
  
              <Text style={styles.nameTextInput}>Ciudad</Text>
              <View style={styles.containerTextInput}>
                <TextInput
                  placeholder="Ciudad"
                  placeholderTextColor="#559"
                  onChangeText={(text) => setInputValue(text, 'ciudad')}
                  style={styles.textInput}
                />
              </View>
  
              <Text style={styles.nameTextInput}>Entidad</Text>
              <View style={styles.containerTextInput}>
                <TextInput
                  placeholder="Entidad"
                  placeholderTextColor="#559"
                  onChangeText={(text) => setInputValue(text, 'entidad')}
                  style={styles.textInput}
                />
              </View>
  
              <Text style={styles.nameTextInput}>Domicilio</Text>
              <View style={styles.containerTextInput}>
                <TextInput
                  placeholder="Domicilio"
                  placeholderTextColor="#559"
                  onChangeText={(text) => setInputValue(text, 'domicilio')}
                  style={styles.textInput}
                />
              </View>
  
              <Text style={styles.nameTextInput}>Teléfono</Text>
              <View style={styles.containerTextInput}>
                <TextInput
                  placeholder="Teléfono"
                  placeholderTextColor="#559"
                  onChangeText={(text) => setInputValue(text, 'telefono')}
                  style={styles.textInput}
                  keyboardType="numeric"
                />
              </View>
  
              <View style={styles.containerButtonSaveGym}>
                <TouchableOpacity
                  onPress={saveGym}
                  style={styles.buttonSaveGym}
                >
                  <Text style={styles.textButton}>Guardar</Text>
                </TouchableOpacity>
              </View>
  
              <View>
                <Portal>
                  <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>Error</Dialog.Title>
                    <Dialog.Content>
                      <Paragraph>{errorMesssageAlert}</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                      <Button onPress={hideDialog}>Cerrar</Button>
                    </Dialog.Actions>
                  </Dialog>
                </Portal>
              </View>
  
            </View>
          </ScrollView>
          )
        }
       <BottomBar navigation={navigation}/>
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

  containerIndicator:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },

  title:{
    fontSize: 30,
    fontWeight: '700',
    color: Colors.MainBlue
  },

  // text inputs
  mainContainer:{
    paddingVertical: 80,
    paddingHorizontal: 20,
    marginBottom: 20,
  },  
  nameTextInput:{
    marginTop: 15,
    marginBottom: 0,
    fontSize: 16,
    color: '#555'
  },
  containerTextInput:{
    borderColor: Colors.MainBlue,
    borderBottomWidth: 2,
    borderBottomRightRadius: 3,
    borderBottomLeftRadius: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  textInput:{
    color: Colors.MainBlue
  },

  // button save
  containerButtonSaveGym:{
    display: 'flex',
    alignItems: 'center'
  },
  buttonSaveGym:{
    marginTop: 40,
    backgroundColor: Colors.MainBlue
  },
  textButton:{
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    padding: 10
  },

});