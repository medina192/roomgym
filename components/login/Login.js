import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import FontAwesome, { SolidIcons, RegularIcons, BrandIcons } from 'react-native-fontawesome';
import axios from 'axios';

//import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
//import { LoginButton, AccessToken } from 'react-native-fbsdk';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Button, Paragraph, Dialog, Portal } from 'react-native-paper';
//import { Colors } from 'react-native/Libraries/NewAppScreen';
import Colors from '../../colors/colors';

import * as Keychain from 'react-native-keychain';

import { saveUser, T_saveTrainer } from '../../store/actions/actionsReducer';

import { urlServer } from '../../services/urlServer';

import AlertComponent from '../shared/AlertComponent';

const Login = ({navigation}) => {

  const dispatch = useDispatch();

  const state = useSelector(state => state.changeState);
  const user = useSelector(state => state.user);
  const T_trainer = useSelector(state => state.T_trainer);

  const [mainIndicator, setMainIndicator] = useState(false);
  const [showAlert, setShowAlert] = useState({
    show: false,
    type: 'error',
    action: 'close', 
    message: '', 
    title: '', 
    iconAlert: 'times-circle',
    nextScreen: 'MyGymTrainer'
  });

  const wer = useSelector(state => state);
  console.log('------------ user screen', wer);

  useEffect(() => {

    if(!user == '')
    {
      navigation.navigate('MainUserScreen');
    }
    else if(!T_trainer == '')
    {
      navigation.navigate('MainTrainerScreen');
    }
    else{
      setMainIndicator(false);
    }
  }, [state]);

  const verifyIfUserIsLogged = async() => {
    /*
    const username = 'zuck';
    const password = 'poniesRgr';
  
    // Store the credentials
    const p = await Keychain.setGenericPassword(username, password);
    */




    try {
      // Retrieve the credentials
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const userObject = JSON.parse(credentials.username);
        //console.log('password', credentials.password);
        if(credentials.password == '1')
        {
          dispatch(saveUser(userObject));
          navigation.navigate('MainUserScreen');
        }
        else{
          dispatch(T_saveTrainer(userObject));
          navigation.navigate('MainTrainerScreen');
        }
      } else {
        console.log('No credentials stored');
      }
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
    //await Keychain.resetGenericPassword();
  }

  useEffect(() => {
    
    verifyIfUserIsLogged();

  }, []);

  const [form, setform] = useState({
    email: '',
    password: ''
  });
  const [visible, setVisible] = useState(false); // alert

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const [isEnabled, setIsEnabled] = useState(false);    // bool variable that verifies if the user wants to remind the password
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
  };

  const serverUrl = urlServer.url;
  //const serverUrl = 'http://localhost:3001';



  const saveInputsValues = (input, value) => { // save the values of the form

    switch (input) {
      case 'email':
        setform({
          ...form,
          email: value
        })
      break;
      case 'password':
        setform({
          ...form,
          password: value
        })
      break;
    
      default:
        break;
    }
  }



  const generateSecureStorage = async(user, rol) => {  // save the session

    const username = user;
    const password = rol;

    const userObject = JSON.parse(user);
  
    try {
          // Store the credentials
      await Keychain.setGenericPassword(username, password);

          if(rol == '1'){
            dispatch(saveUser(userObject));
            navigation.navigate('MainUserScreen');
          }
          else{
            dispatch(T_saveTrainer(userObject));
            navigation.navigate('MainTrainerScreen');
          }

    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
  }



  const sendForm = () => {  // send the form to the backend


    setMainIndicator(true);

    if(form.email && form.password)
    {
      const bodyUser = {
        email: form.email,
        password: form.password,
      } 
      axios({
        method: 'post',
        url: `${serverUrl}/auth/login`,
        data: bodyUser
      })
      .then(function (response) {
        const userString = JSON.stringify(response.data.resp[0]);
        const userObject = JSON.parse(userString);
        /*
          console.log('good, user logged',response.data.resp[0].role);
          const userString = JSON.stringify(response.data.resp[0]);
          const userObject = JSON.parse(userString);
          if(isEnabled)
          {
            if(response.data.resp[0].role == '1')
            {
              console.log('user');

              dispatch(saveUser(userObject));
              generateSecureStorage(userString, '1', );
              //navigation.navigate('MainUserScreen');
            }
            else{
              console.log('trainer');

              dispatch(T_saveTrainer(userObject));
              generateSecureStorage(userString, '2',);
              //navigation.navigate('MainTrainerScreen');
            }
          }
          else{
            if(response.data.resp[0].role == '1')
            {

              dispatch(saveUser(userObject));
              navigation.navigate('MainUserScreen');
            }
            else{

              dispatch(T_saveTrainer(userObject));
              navigation.navigate('MainTrainerScreen');
            }
          }
          */
          const auxIdusuario = response.data.resp[0].idusuario;
          axios({
            method: 'get',
            url: `${serverUrl}/auth/getRol/${auxIdusuario}`
          }).then((resp) => {
            //console.log(resp.data.resp[0].idrol);

            if(isEnabled)
            {
              if(resp.data.resp[0].idrol == 1)
              {
  
                dispatch(saveUser(userObject));
                generateSecureStorage(userString, '1');
                //navigation.navigate('MainUserScreen');
              }
              else{
  
                dispatch(T_saveTrainer(userObject));
                generateSecureStorage(userString, '2');
                //navigation.navigate('MainTrainerScreen');
              }
            }
            else{
              if(resp.data.resp[0].idrol == 1)
              {
                setMainIndicator(false);
                dispatch(saveUser(userObject));
                navigation.navigate('MainUserScreen');
              }
              else{
                setMainIndicator(false);
                dispatch(T_saveTrainer(userObject));
                navigation.navigate('MainTrainerScreen');
              }
            }
          })
          .catch((error) => {

          });
      })
      .catch(function (error) {
          //console.log('error axios',error);
          //showDialog();
          setMainIndicator(false);
          if(error.request._response.slice(0,17) === 'Failed to connect')
          {

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

            const responseObject = JSON.parse(error.request._response);
            
            if(responseObject.message == 'the email does not exists')
            {
              setShowAlert({
                show: true,
                type: 'error',
                action: 'close', 
                message: 'El email o la contraseña son incorrectos', 
                title: 'Acceso denegado', 
                iconAlert: 'times',
                nextScreen: 'MyGymTrainer'
              });
            }
          }
      });
    }
    else{

      setMainIndicator(false);
      setShowAlert({
        show: true,
        type: 'error',
        action: 'close', 
        message: 'Es necesario que llenes todos los campos', 
        title: 'Campos faltantes', 
        iconAlert: 'edit',
        nextScreen: 'MyGymTrainer'
      });
    }
  }


  const hideKeyBoard = () => {   // hides the keyboard when the user touches out of it
    Keyboard.dismiss();
  }

  const goToRegister = () => {
    navigation.navigate('Register');
  }

/*
  //  begin google sign ______________________________________
  const signIn = async () => {
    console.log('sign');
    try {
      const t = await GoogleSignin.hasPlayServices();
      
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
   //  begin google out ______________________________________
*/


  return (
    <>
    <TouchableWithoutFeedback onPress={hideKeyBoard}>
      <View style={styles.containerInputs} >

        <Icon style={styles.mainIcon} name="user-circle" size={50} color="#fff" />
        <View style={  styles.containerIconInput }>
          <Icon name="envelope" size={24} style={styles.iconInputClass} color="#000" />
          <TextInput style={styles.inputRegister}
            placeholder="Email"
            placeholderTextColor={Colors.MainBlue}
            onChangeText={ (text) => saveInputsValues('email',text) }
          />
        </View>
        <View style={  styles.containerIconInput }>
          <Icon name="lock" size={24} style={styles.iconInputClass} color="#fff" />
          <TextInput style={styles.inputRegister}
            placeholder="Contraseña"
            secureTextEntry={true}
            placeholderTextColor={Colors.MainBlue}
            onChangeText={ (text) => saveInputsValues('password',text) }
          />
        </View>

          <View>
            <Portal>
              <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>Error</Dialog.Title>
                <Dialog.Content>
                  <Paragraph>El email o la contraseña son incorrectos</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={hideDialog}>Cerrar</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </View>

        <View style={styles.containerRememberPassword}>
          <Text style={styles.textRememberPassword}>Recordar contraseña</Text>
          <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? Colors.MainBlue : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
          />
        </View>

        <TouchableHighlight style={styles.buttonLogin} onPress={sendForm}>
          <Text style={styles.buttonLoginText}>Iniciar sesión</Text>
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

        <View>
          <Text style={styles.textForgetPassword}>¿Olvidaste tu contraseña?</Text>
          <View style={styles.containerRestore}>
            <Text style={styles.textRestorePassword}>Toca </Text>
            <Text  style={styles.textRestorePassword}>aquí </Text>
            <Text  style={styles.textRestorePassword}>para restaurarla</Text>
          </View>
        </View>

        <View style={styles.containerGoToRegister}>
          <Text style={styles.textGoToRegister}>¿No tienes una cuenta?</Text>
        <TouchableOpacity onPress={goToRegister}>
          <Text style={styles.textGoToRegister}>Registrate aquí</Text>
        </TouchableOpacity>
        </View>

        {
          /*
                  <View style={styles.containerButtonSubscribe}>
          <TouchableOpacity style={styles.buttonSubscribe} onPress={ () => navigation.navigate('MainUserScreen')}>
            <Text style={styles.textButoonSubscribe}>Pantalla Usuario</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.containerButtonSubscribe}>
          <TouchableOpacity style={styles.buttonSubscribe} onPress={ () => navigation.navigate('MainUserScreen')}>
            <Text style={styles.textButoonSubscribe}>Pantalla Entrenador</Text>
          </TouchableOpacity>
        </View>
          */
        }
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
    </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({

  grayContainer:{
    position: 'absolute',
    width: '100%',
    height: '100%',
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
 scrollContainer:{
  width: '100%',
  flex: 1,
  backgroundColor: '#fff'
 }, 
 inputRegister:{
  flex: 1,
  backgroundColor: '#fff',
  width: '75%',
  fontSize: 18,
  color: Colors.MainBlue
  //borderRightWidth: 1,
  //borderLeftWidth: 1,
  //borderTopWidth: 1,
  //borderBottomRightRadius: 3,
  //borderBottomLeftRadius: 3,
  //borderTopLeftRadius: 3,
  //borderTopRightRadius: 3
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
    borderColor: Colors.MainBlue,
    borderBottomWidth: 2,
  },
  containerRestore:{
    display: 'flex',
    flexDirection: 'row',
    marginTop: 8
  },
  textForgetPassword: {
    color: Colors.MainBlue,
    marginTop: 10
  },
  textRestorePassword:{
    color: Colors.MainBlue
  },
  buttonLogin:{
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
    marginVertical: 8    
  },
  buttonFacebook:{
    backgroundColor: '#3B5998',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '90%',
    paddingVertical: 14,
    marginVertical: 8    
  },
  buttonLoginText:{
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700'
  },
  mainIcon:{
    marginTop: 0,
    fontSize: 80,
    color: Colors.MainBlue,
    marginBottom: 15
  },
  iconInputClass:{
    //color: '#FB5012',
    color: Colors.MainBlue,
    marginRight: 5
  },
  containerRememberPassword:{
    marginVertical: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  textRememberPassword:{
    fontSize: 15,
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

    // got to register
    containerGoToRegister:{
      marginTop: 10,
    },
    textGoToRegister:{
      fontSize: 15,
      color: Colors.MainBlue,
      textAlign: 'center'
    },
});

export default Login;