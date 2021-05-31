import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';

import axios from 'axios';

import Colors from '../../colors/colors';

import TopBar from '../shared/TopBar';
import BottomBar from '../shared/BottomBarUser';

import { openDatabase } from 'react-native-sqlite-storage';

import Icon from 'react-native-vector-icons/FontAwesome';

import { useDispatch, useSelector } from 'react-redux';

import { urlServer } from '../../services/urlServer';

import  SideBarTrainer  from '../shared/SideBarTrainer';
import AlertComponent from '../shared/AlertComponent';



const db = openDatabase({ name: 'roomGym.db' });

const Drawer = createDrawerNavigator();


export default function MyGymTrainer({navigation}) {
  return (
    <>
      <Drawer.Navigator drawerContent={(props) => <SideBarTrainer {...props} />}>
        <Drawer.Screen name="MyGymTrainer" component={MyGymTrainerScreen} />
      </Drawer.Navigator>
    </>
  );
}


const MyGymTrainerScreen = ({navigation}) => {

  const serverUrl = urlServer.url;

  const T_trainer = useSelector(state => state.T_trainer);

  const [mainIndicator, setMainIndicator] = useState(true);
  const [addServices, setAddServices] = useState(false);

  const [textInputValue, setTextInputValue] = useState({
    nombre: '',
    ciudad: '',
    entidad: '',
    domicilio: '',
    telefono: '',
    servicio: '',
  });

  const [listServices, setListServices] = useState([]);

  const [showAlert, setShowAlert] = useState({
    show: false,
    type: 'error',
    action: 'close', 
    message: '', 
    title: '', 
    iconAlert: 'times-circle',
    nextScreen: 'MyGymTrainer'
  });


  useEffect(() => {
    getGymOfTrainer();
  }, []);


  const getGymOfTrainer = () => {

    axios({
      method: 'get',
      url: `${serverUrl}/gyms/searchgym/${T_trainer.idusuario}`,
    })
    .then(function (response) {
        //console.log('pdf',response.data.resp[0]);
        //console.log('pdf',response.status);

        const dataGym = response.data.resp[0];  

        if(response.data.resp.length > 0)
        {
          setMainIndicator(false);
          if(dataGym.services && !dataGym.services == '')
          {

          }
          else{
            setTextInputValue({
              nombre:dataGym.nombre,
              ciudad: dataGym.ciudad,
              entidad: dataGym.entidad,
              domicilio: dataGym.domicilio,
              telefono: dataGym.telefono,
              servicio: ''
            });

            setListServices([]);
          }
        }
        else{

          setMainIndicator(false);
          setShowAlert({
            show: true,
            type: 'warn',
            action: 'return', 
            message: 'Selecciona la opción "Crear Gimnasio" que aparece en la pantalla principal', 
            title: 'No has registrado ningún gimnasio', 
            iconAlert: 'warning',
            nextScreen: 'MyGymTrainer'
          });
        }

    })
    .catch(function (error) {  
      console.log('error axios',error);
      setMainIndicator(false);
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
  }


  
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

      case "servicio":
        setTextInputValue({
          ...textInputValue,
          servicio: data
        });
      break;

      default:
        break;
    }
  }

  const cancelService = () => {
    setTextInputValue({
      ...textInputValue,
      servicio: ''
    });

    setAddServices(false);
  }



  const saveService = () => {

    if(listServices.length > 0)
    {

    }
    else{
      let auxService = []
      auxService[0]= textInputValue.servicio;
      setListServices(auxService);
      
    }
    cancelService();
  }



  const saveData = () => {

    if( nombre == '' || ciudad == '' || entidad == '' || domicilio == '' || telefono == '')
    {
      // empty fields alert
    }
    else{

      let servicesString = '';
      if(listServices.length > 0)
      {
        servicesString = JSON.parse(listServices);
      }


      axios({
        method: 'get',
        url: `${serverUrl}/gyms/updategym`,
        data: {
          nombre: textInputValue.nombre,
          ciudad: textInputValue.ciudad,
          entidad: textInputValue.entidad,
          domicilio: textInputValue.domicilio,
          telefono: textInputValue.telefono,
          servicios: servicesString
        }
      })
      .then(function (response) {
        console.log('resp', response);
      }).catch(error => {
        console.log('error', error);
      })
    }
  }

  console.log('services', listServices);
  console.log('text', textInputValue);

  return (
    <>
      <SafeAreaView style={{flex: 1, position: 'relative'}}>
        <TopBar navigation={navigation} title={`Mi Gimnasio`} returnButton={true} />
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
                    <Text style={styles.title}>Editar Gimnasio</Text>
        
                    <Text style={styles.nameTextInput}>Nombre</Text>
                    <View style={styles.containerTextInput}>
                      <TextInput
                        placeholder={textInputValue.nombre}
                        placeholderTextColor="#000"
                        onChangeText={(text) => setInputValue(text, 'nombre')}
                        value={textInputValue.nombre}
                        style={styles.textInput}
                      />
                    </View>
        
                    <Text style={styles.nameTextInput}>Ciudad</Text>
                    <View style={styles.containerTextInput}>
                      <TextInput
                        placeholder={textInputValue.ciudad}
                        placeholderTextColor="#559"
                        onChangeText={(text) => setInputValue(text, 'ciudad')}
                        value={textInputValue.ciudad}
                        style={styles.textInput}
                      />
                    </View>
        
                    <Text style={styles.nameTextInput}>Entidad</Text>
                    <View style={styles.containerTextInput}>
                      <TextInput
                        placeholder={textInputValue.entidad}
                        placeholderTextColor="#559"
                        onChangeText={(text) => setInputValue(text, 'entidad')}
                        value={textInputValue.entidad}
                        style={styles.textInput}
                      />
                    </View>
        
                    <Text style={styles.nameTextInput}>Domicilio</Text>
                    <View style={styles.containerTextInput}>
                      <TextInput
                        placeholder={textInputValue.domicilio}
                        placeholderTextColor="#559"
                        onChangeText={(text) => setInputValue(text, 'domicilio')}
                        value={textInputValue.domicilio}
                        style={styles.textInput}
                      />
                    </View>
        
                    <Text style={styles.nameTextInput}>Teléfono</Text>
                    <View style={styles.containerTextInput}>
                      <TextInput
                        placeholder={textInputValue.telefono}
                        placeholderTextColor="#559"
                        onChangeText={(text) => setInputValue(text, 'telefono')}
                        value={textInputValue.telefono}
                        style={styles.textInput}
                        keyboardType="numeric"
                      />
                    </View>


                    <View>
                        {
                           listServices.map((service, indexService) => {
                             <View>
                               <Text>hola</Text>
                             </View>
                           })    
                        }
                    </View>



                    {
                      addServices ? 
                      (
                        <View>
                          <Text style={styles.nameTextInput}>Nuevo Servicio</Text>
                          <View style={styles.containerTextInput}>
                            <TextInput
                              placeholder={'Servicio'}
                              placeholderTextColor="#559"
                              onChangeText={(text) => setInputValue(text, 'servicio')}
                              style={styles.textInput}
                            />
                          </View>

                          <View>
                            <View style={styles.containerButtonServices}>
                            <TouchableOpacity 
                              style={styles.buttonServices}
                              onPress={cancelService}
                            >
                              <Text style={styles.textButtonServices}>Cancelar</Text>
                            </TouchableOpacity>
                            </View>

                            <View style={styles.containerButtonServices}>
                            <TouchableOpacity 
                              style={styles.buttonServices}
                              onPress={saveService}
                            >
                              <Text style={styles.textButtonServices}>Guardar</Text>
                            </TouchableOpacity>
                            </View>
                          </View>

                        </View>
                      )
                      :
                      (
                        <View style={styles.containerButtonServices}>
                          <TouchableOpacity 
                            style={styles.buttonServices}
                            onPress={() => setAddServices(true)}
                          >
                            <Text style={styles.textButtonServices}>Añadir servicios</Text>
                          </TouchableOpacity>
                        </View>
                      )
                    }
        
                    <View style={styles.containerButtonSaveGym}>
                      <TouchableOpacity
                        style={styles.buttonSaveGym}
                        onPress={saveData}
                      >
                        <Text style={styles.textButton}>Guardar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
              </ScrollView>
            )
          }
          <BottomBar navigation={navigation} />
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
    </>
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

  //button services
  containerButtonServices:{
    marginTop: 20, 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonServices:{
    backgroundColor: Colors.MainBlue,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  textButtonServices:{
    color: '#fff',
    fontWeight: '700',
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
