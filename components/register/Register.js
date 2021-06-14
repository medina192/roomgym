import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { Button, Paragraph, Dialog, Portal } from 'react-native-paper';

import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios';

import FontAwesome, { SolidIcons, RegularIcons, BrandIcons } from 'react-native-fontawesome';
import Icon from 'react-native-vector-icons/FontAwesome';

import DateTimePickerModal from "react-native-modal-datetime-picker";
import CheckBox from '@react-native-community/checkbox';

//import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';

//import { LoginButton, AccessToken } from 'react-native-fbsdk';
//import { Colors } from 'react-native/Libraries/NewAppScreen';
import Colors from '../../colors/colors';

import { urlServer } from '../../services/urlServer';

import { saveUser, T_saveTrainer} from '../../store/actions/actionsReducer';

import AlertComponent from '../shared/AlertComponent';


const Register = ({navigation}) => {

  const [checkboxValue, setCheckBoxValue] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleAlertPassword, setVisibleAlertPassword] = useState(false);
  const [visibleAlertEmail, setVisibleAlertEmail] = useState(false);
  const [mainIndicator, setMainIndicator] = useState(false);
  const [form, setform] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: '',
    fecha_de_nacimiento: '',
    descripcion: '',
    cedula: '',
    tipo_de_cuenta: ''
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

  useEffect(() => {
     /* 
    GoogleSignin.configure({
     webClientId: '709820780972-mk9hr8a6rmdfm90pr1pf81tp2pkuvbs8.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    });
    */

    const getUsers1 = async () => {
      console.log('presionar', serverUrl);
      const url = `${serverUrl}/getusers`;
      const users =  axios.get(url).then(res => {
        console.log('users',res);
      }).catch((err) => {
        console.log('error',err);
        
      });
      console.log('timeOut');
    }
    //getUsers1();


    /*
    const getUsers = async () => {
      console.log('presionar', serverUrl);
      const url = `http://mrelberni.blogspot.com`;
      const users =  axios.get(url).then(res => {
        console.log('users',res);
      }).catch((err) => {
        console.log('errorsito',err);
        
      });

    }
    
    getUsers();
    
    const getCountries = async () => {
        console.log('presionar');
        const url = `https://restcountries.eu/rest/v2/all`;
        const users =  axios.get(url).then(res => {
          console.log('users',res);
        }).catch((err) => {
          console.log('errorsito',JSON.stringify(err));

        });
    }
    getCountries();
    */

  }, []);




  const dispatch = useDispatch();

  const serverUrl = urlServer.url;
  //const serverUrl = 'http://localhost:3001';


  // begin  dialog error empty fields alert _________________________

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  // end  dialog error empty fields alert _________________________



  // begin  dialog error password alert _________________________

  const showDialogPassword = () => setVisibleAlertPassword(true);

  const hideDialogPassowrd = () => setVisibleAlertPassword(false);

  // end  dialog error password alert _________________________


    // begin  dialog error Email alert _________________________

    const showDialogEmail = () => setVisibleAlertEmail(true);

    const hideDialogEmail = () => setVisibleAlertEmail(false);
  
    // end  dialog error Email alert _________________________


/*
   //  begin google sign ______________________________________
  const signIn = async () => {
    console.log('sign');
    try {
      const t = await GoogleSignin.hasPlayServices();
      console.log('t',t);
      const userInfo = await GoogleSignin.signIn();

      console.log('userinfo',userInfo);

      //setstate(userInfo);
      //this.setState({ userInfo });
    } catch (error) {
      console.log('error',error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('sign in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log('in process');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log('play services not available');
      } else {
        // some other error happened
        console.log('sabe');
      }
    }
  };
   //  end google out ______________________________________
*/

   // begin picker functions _______________________________
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {


    console.warn("A date has been picked: ", date);

    const dateShortFormat = date.toISOString();
    const dateMysqlFormat = dateShortFormat.slice(0,10);

    saveInputsValues('fecha_de_nacimiento',dateMysqlFormat);
    hideDatePicker();
  };

// end picker functions _______________________________



// begin save form _______________________________

  const saveInputsValues = (input, value) => {

    switch (input) {
      case 'nombres':
        setform({
          ...form,
          nombres: value
        });
      break;
      case 'apellidos':
        setform({
          ...form,
          apellidos: value
        });  
      break;
      case 'email':
        setform({
          ...form,
          email: value
        });    
      break;
      case 'password':
        setform({
          ...form,
          password: value
        });    
      break;
      case 'confirmPassword':
        setform({
          ...form,
          confirmPassword: value
        });    
      break;
      case 'fecha_de_nacimiento':
        setform({
          ...form,
          fecha_de_nacimiento: value
        });    
      break;
      case 'descripcion':
        setform({
          ...form,
          descripcion: value
        });    
      break;
      case 'cedula':
        setform({
          ...form,
          cedula: value
        });    
      break;
    
      default:
        break;
    }
  }
  // end save form _______________________________


  // Begin send form _______________________________
  /*
  const sendForm = () => {

    if(!checkboxValue)
    {
      if(form.nombres && form.apellidos && form.email && form.password && form.confirmPassword
        && form.fecha_de_nacimiento){
        
          if(form.password !== form.confirmPassword)
          {
            console.log('passwords are not equal');
            showDialogPassword();
            return;
          }
          else{

            const bodyUser = {
              nombres: form.nombres,
              apellidos: form.apellidos,
              email: form.email,
              password: form.password,
              fecha_de_nacimiento: form.fecha_de_nacimiento,
              role: 1,
              google: 0,
              facebook: 0,
              estado: 0
            } 
            console.log('bodyuse,', bodyUser);
            axios({
              method: 'post',
              url: `${serverUrl}/auth/register`,
              data: bodyUser
            })
            .then(function (response) {
                console.log('good, user registered',response);
                dispatch(saveUser(bodyUser));
                navigation.navigate('SaveSessionQuestion');
            })
            .catch(function (error) {
                //console.log('res', error.response.data.sqlMessage);
                if(error.response?.data.sqlMessage)
                {
                  console.log('hi',error.response?.data.sqlMessage);
                  console.log('email already exists');
                  showDialogEmail();
                }
                else{
                   console.log('server error');
                }
            });
          }
      }
      else{
        console.log('dialog');
        showDialog();
      }
    }
    else{
      if(form.nombres && form.apellidos && form.email && form.password && form.confirmPassword
        && form.fecha_de_nacimiento && form.descripcion){
      
        if(form.password !== form.confirmPassword)
        {
          console.log('passwords are not equal');
          showDialogPassword();
          return;
        }
        else{
          const bodyUser = {
            nombres: form.nombres,
            apellidos: form.apellidos,
            email: form.email,
            password: form.password,
            fecha_de_nacimiento: form.fecha_de_nacimiento,
            role: 2,
            descripcion_entrenador: form.descripcion,
            cedula_entrenador: form.cedula,
            google: 0,
            facebook: 0,
            estado: 0
          } 
          axios({
            method: 'post',
            url: `${serverUrl}/auth/register`,
            data: bodyUser
          })
          .then(function (response) {
              console.log('good, trainer registered',response);
              dispatch(T_saveTrainer(bodyUser));
              navigation.navigate('SaveSessionQuestion');
          })
          .catch(function (error) {
              console.log('error axios',error);
          });
        }
      }
      else{
        showDialog();
      }
    }
  }

//  end save form ______________________________
*/

const sendForm = () => {

    setMainIndicator(true);
  console.log('passwird', form.password);
    if(form.nombres && form.apellidos && form.email && form.password && form.confirmPassword
      && form.fecha_de_nacimiento){
      
        if(form.password !== form.confirmPassword)
        {
          setMainIndicator(false);
          setShowAlert({
            show: true,
            type: 'error',
            action: 'close', 
            message: 'Las contraseñas no coinciden', 
            title: 'Contraseñas diferentes', 
            iconAlert: 'times',
            nextScreen: 'MyGymTrainer'
          });
          //showDialogPassword();
          return;
        }
        else{

          const bodyUser = {
            nombres: form.nombres,
            apellidos: form.apellidos,
            email: form.email,
            password: form.password,
            fecha_de_nacimiento: '2021-02-07',
            google: 0,
            facebook: 0,
            estado: 0,
            idusuario: 0
          } 
          console.log('body', bodyUser);
          axios({
            method: 'post',
            url: `${serverUrl}/auth/register`,
            data: bodyUser
          })
          .then(function (response) {
              console.log('good, user registered',response);
              setMainIndicator(false);
              bodyUser.idusuario = response.data.resp.insertId;
              setform({
                nombres: '',
                apellidos: '',
                email: '',
                password: '',
                confirmPassword: '',
                fecha_de_nacimiento: '',
                descripcion: '',
                cedula: '',
                tipo_de_cuenta: ''
              });
              navigation.navigate('ChooseRole',bodyUser);
              //dispatch(saveUser(bodyUser));
              //navigation.navigate('SaveSessionQuestion');
          })
          .catch(function (error) {
              console.log('res', error);

              setMainIndicator(false);
              if(error.request._response.slice(0,17) === 'Failed to connect')
              {
                console.log('if');
                setShowAlert({
                  show: true,
                  type: 'error',
                  action: 'close', 
                  message: 'Verifica tu conexión a internet o notifica al equipo de GymRoom sobre el problema', 
                  title: 'No se pudo conectar con el servidor', 
                  iconAlert: 'wifi',
                  nextScreen: 'MyGymTrainer'
                });
              }
              else{

                if(error.response?.data.sqlMessage.slice(0,15) == 'Duplicate entry')
                {
                  setShowAlert({
                    show: true,
                    type: 'error',
                    action: 'close', 
                    message: 'El Email que introduciste ya esta registrado, intenta con uno nuevo', 
                    title: 'Correo duplicado', 
                    iconAlert: 'envelope',
                    nextScreen: 'MyGymTrainer'
                  });
                }
                //console.log('rese', error);
                /*
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
                */
              }
              /*
                            if(error.response?.data.sqlMessage)
              {
                console.log('hi',error.response?.data.sqlMessage);
                console.log('email already exists');
                showDialogEmail();
              }
              else{
                 console.log('server error');
              }
              */

          });

        }
    }
    else{
      //showDialog();
      setMainIndicator(false);
      setShowAlert({
        show: true,
        type: 'error',
        action: 'close', 
        message: 'Debes llenar todos los campos', 
        title: 'Faltan campos por llenar', 
        iconAlert: 'envelope',
        nextScreen: 'MyGymTrainer'
      });
    }
}

//  end save form ______________________________

  const hideKeyBoard = () => {
    Keyboard.dismiss();
  }

  const navigateLogin = () => {
    navigation.navigate('Login');
  }


  
  return (
    <>  

              <TouchableWithoutFeedback onPress={hideKeyBoard}>
              <ScrollView style={{flex:1, backgroundColor: '#fff'}}>
                <View style={styles.containerInputs} >
                  <Icon style={styles.mainIcon} name="user-circle" size={50} color="#fff" />
                  <View style={  styles.containerIconInput }>
                    <Icon name="user-o" size={24} style={styles.iconInputClass} color="#fff" />
                    <TextInput style={styles.inputRegister}
                      placeholder="Nombre"
                      placeholderTextColor={Colors.MainBlue}
                      onChangeText={ (text) => saveInputsValues('nombres',text) }
                    />
                  </View>
                  <View style={  styles.containerIconInput }>
                    <Icon name="drivers-license-o" style={styles.iconInputClass} size={24} color="#fff" />
                    <TextInput style={styles.inputRegister}
                      placeholder="Apellidos"
                      placeholderTextColor={Colors.MainBlue}
                      onChangeText={ (text) => saveInputsValues('apellidos',text) }
                    />
                  </View>
                  <View style={  styles.containerIconInput }>
                    <Icon name="envelope" style={styles.iconInputClass} size={24} color="#fff" />
                    <TextInput style={styles.inputRegister}
                      placeholder="Email"
                      placeholderTextColor={Colors.MainBlue}
                      onChangeText={ (text) => saveInputsValues('email',text) }
                    />
                  </View>
                  <View style={  styles.containerIconInput }>
                    <Icon name="lock" style={styles.iconInputClass} size={24} color="#fff" />
                    <TextInput style={styles.inputRegister}
                      placeholder="Contraseña"
                      secureTextEntry={true}
                      placeholderTextColor={Colors.MainBlue}
                      onChangeText={ (text) => saveInputsValues('password',text) }
                    />
                  </View>
                  <View style={  styles.containerIconInput }>
                    <Icon name="lock" style={styles.iconInputClass} size={24} color="#fff" />
                    <TextInput style={styles.inputRegister}
                      placeholder="Confirmar contraseña"
                      placeholderTextColor={Colors.MainBlue}
                      secureTextEntry={true}
                      onChangeText={ (text) => saveInputsValues('confirmPassword',text) }
                    />
                  </View>
      
                  <TouchableHighlight style={styles.buttonPicker} onPress={showDatePicker}>
                    <View style={styles.buttonPickerView}>
                      <Icon name="calendar" style={styles.buttonPickerIcon} size={24} color="#fff" />
                      <Text style={styles.textButtonPicker}>Fechas de nacimiento</Text>
                    </View>
                  </TouchableHighlight>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                  />
                  
                  {
                    /*
                                <Text style={styles.typeAccounText}>Selecciona tu tipo de cuenta</Text>
                  
                                <View style={styles.containerCheckBox1}>
                                  <CheckBox
                                  disabled={false}
                                  value={!checkboxValue}
                                  onValueChange={() => setCheckBoxValue(!checkboxValue)}
                                  />
                                  <Text style={styles.textCheckbox}>Usuario</Text>
                                </View>
                                <View style={styles.containerCheckBox2}>
                                  <CheckBox
                                  disabled={false}
                                  value={checkboxValue}
                                  onValueChange={() => setCheckBoxValue(!checkboxValue)}
                                  />
                                  <Text style={styles.textCheckbox}>Entrenador</Text>
                                </View>
                  }
      
      
                  {
                    /*
                    checkboxValue ? 
                    (
                      <TouchableWithoutFeedback onPress={hideKeyBoard}>
                      <View style={styles.containerInputs} >
                        <Text style={styles.textTrayectory}>* Agrega una descripción sobre ti y tu trayectoria</Text>
                        <View style={  styles.containerIconInput }>
                          <Icon name="folder-o" style={styles.iconInputClass} size={24} color="#fff" />
                          <TextInput style={styles.inputRegister}
                            placeholder="Descripcion"
                            multiline={true}
                            onChangeText={ (text) => saveInputsValues('descripcion',text) }
                          />
                        </View>
                        <View style={  styles.containerIconInput }>
                          <Icon name="id-card" style={styles.iconInputClass} size={24} color="#fff" />
                          <TextInput style={styles.inputRegister}
                            placeholder="Cedula"
                            onChangeText={ (text) => saveInputsValues('cedula',text) }
                          />
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                    )  : null
                    */
                  }
                  
                  {
                    // error empty fields alert
                  }
                  <View>
                    <Portal>
                      <Dialog visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title>Error</Dialog.Title>
                        <Dialog.Content>
                          <Paragraph>Faltan campos por llenar</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                          <Button onPress={hideDialog}>Cerrar</Button>
                        </Dialog.Actions>
                      </Dialog>
                    </Portal>
                  </View>
      
                  <View>
                    <Portal>
                      <Dialog visible={visibleAlertEmail} onDismiss={hideDialogEmail}>
                        <Dialog.Title>Error</Dialog.Title>
                        <Dialog.Content>
                          <Paragraph>El email ya existe</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                          <Button onPress={hideDialogEmail}>Cerrar</Button>
                        </Dialog.Actions>
                      </Dialog>
                    </Portal>
                  </View>
      
                  {
                    // error passwords are not equal alert
                  }
                  <View>
                    <Portal>
                      <Dialog visible={visibleAlertPassword} onDismiss={hideDialogPassowrd}>
                        <Dialog.Title>Error</Dialog.Title>
                        <Dialog.Content>
                          <Paragraph>Las contraseñas no coinciden</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                          <Button onPress={hideDialogPassowrd}>Cerrar</Button>
                        </Dialog.Actions>
                      </Dialog>
                    </Portal>
                  </View>
      
                  <TouchableHighlight style={styles.buttonLogin}  onPress={sendForm}>
                    <Text style={styles.buttonLoginText}>Registrarse</Text>
                  </TouchableHighlight>
      
                  {
                    /*
                                <View>
                    <LoginButton
                      onLoginFinished={
                        (error, result) => {
                          if (error) {
                            console.log("login has error: " + result.error);
                          } else if (result.isCancelled) {
                            console.log("login is cancelled.");
                          } else {
                            AccessToken.getCurrentAccessToken().then(
                              (data) => {
                                console.log(data.accessToken.toString())
                              }
                            )
                          }
                        }
                      }
                      onLogoutFinished={() => console.log("logout.")}/>
                  </View>
                    */
                  }
      
                  {
                      /*
                                  <GoogleSigninButton
                    style={{ width: 200, height: 60 }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={signIn} 
                    />
                      */
                  }
      
      
                  <Text style={styles.textAccount}>¿Ya tienes una cuenta?</Text>
                  <Text style={styles.textLogin} onPress={navigateLogin}>Inicia sesión aquí</Text>

                  {
                    mainIndicator ? 
                    (
                      <View style={styles.grayContainer}>
                        <View style={styles.containerIndicator}>
                          <ActivityIndicator
                            size={80}
                            color={Colors.MainBlue}
                            style={styles.activityIndicator}
                          />
                        </View>
                      </View>
                    )
                    :
                    (
                      <>
                      </>
                    )
                  }
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
                </View>
                  {
                      /*
                          <View style={styles.containerButtonSubscribe}>
                            <TouchableOpacity style={styles.buttonSubscribe} onPress={ () => navigation.navigate('MainUserScreen')}>
                              <Text style={styles.textButoonSubscribe}>Pantalla Usuario</Text>
                            </TouchableOpacity>
                          </View>
                  
                          <View style={styles.containerButtonSubscribe}>
                            <TouchableOpacity style={styles.buttonSubscribe} onPress={ () => navigation.navigate('MainTrainerScreen')}>
                              <Text style={styles.textButoonSubscribe}>Pantalla Entrenador</Text>
                            </TouchableOpacity>
                          </View>
                      */
                  }
              </ScrollView>
            </TouchableWithoutFeedback>
    </>
  );
};



const styles = StyleSheet.create({

  grayContainer:{
    position: 'absolute',
    width: '100%',
    flex:1,
    backgroundColor: '#00000099'
  },
    containerIndicator:{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      backgroundColor: '#fff',
      width: '70%',
      height: '50%',
      top: '25%',
      left: '15%',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },

    containerInputs:{
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    inputRegister:{
      flex: 1,
      backgroundColor: '#fff',
      color: Colors.MainBlue,
      width: '75%',
      fontSize: 18,
      marginLeft: 5,
      //borderRightWidth: 1,
      //borderLeftWidth: 1,
      //borderTopWidth: 1,
      //borderBottomRightRadius: 3,
      //borderBottomLeftRadius: 3,
      //borderTopLeftRadius: 3,
      //borderTopRightRadius: 3
    },
    mainIcon:{
      marginTop: 40,
      fontSize: 80,
      color: Colors.MainBlue,
      marginBottom: 15
    },
    buttonLogin:{
      //backgroundColor: '#FB5012',
      backgroundColor: Colors.MainBlue,
      borderBottomRightRadius: 5,
      borderBottomLeftRadius: 5,
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      width: 195,
      color: '#fff',
      paddingVertical: 12,
      marginBottom: 5,
      marginTop: 25 
    },
    buttonGoogle:{
      backgroundColor: '#34a853',
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      width: '90%',
      paddingVertical: 14,
      marginVertical: 6     
    },
    buttonFacebook:{
      backgroundColor: '#3B5998',
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      width: '90%',
      paddingVertical: 14,
      marginVertical: 6     
    },
    buttonLoginText:{
      textAlign: 'center',
      color: '#fff',
      fontWeight: '700',
      fontSize: 14
    },
    textAccount:{
      marginVertical: 5,
      color: Colors.MainBlue,
      marginTop: 10
    },
    textLogin:{
      color: Colors.MainBlue,
      marginBottom: 15
    },
    buttonPicker:{
     paddingVertical: 10,
     backgroundColor: Colors.MainBlue,
     width: '80%',
     borderBottomLeftRadius: 30,
     borderBottomRightRadius: 30,
     borderTopLeftRadius: 30,
     borderTopRightRadius: 30,
     marginTop: 15,
     marginBottom: 12
    },
    buttonPickerView: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonPickerIcon:{
      marginRight: 5,
    },
    buttonPickerText:{
      marginLeft: 5
    },
    textButtonPicker:{
      color: '#fff',
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '700',
      marginLeft: 5
    },
    typeAccounText:{
      width: '85%',
      textAlign: 'left',
      marginTop: 10,
      fontSize: 18,
      color: Colors.MainBlue
    },
    containerCheckBox1:{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '85%',
      marginVertical: 5
    },
    containerCheckBox2:{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '85%',
      marginBottom: 15,
    },
    textCheckbox:{
       color: Colors.MainBlue
    },
    containerIconInput:{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '80%',
      backgroundColor: '#fff',
      paddingVertical: 0,
      marginVertical: 10,
      //borderColor: '#FB5012',
      borderColor: Colors.MainBlue,
      borderBottomWidth: 2,
    },
    containerIconInput2:{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      backgroundColor: '#fff',
      paddingVertical: 0,
      marginVertical: 10,
      borderColor: '#FB5012',
      borderBottomWidth: 2,
    },
    iconInput:{
      fontSize: 30,
      backgroundColor: '#4b4b4b'
    },
    textTrayectory:{
      fontSize: 14,
      color: '#fff',
      marginTop: 20
    },
    iconInputClass:{
      //color: '#FB5012',
      color: Colors.MainBlue
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
});

export default Register;