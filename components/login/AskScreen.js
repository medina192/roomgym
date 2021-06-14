import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  Dimensions
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { saveUser, T_saveTrainer } from '../../store/actions/actionsReducer';

import * as Keychain from 'react-native-keychain';

import  Colors  from '../../colors/colors';

const AskScreen = ({navigation}) => {

    const dispatch = useDispatch();

    const [mainIndicator, setMainIndicator] = useState(true);

    const user = useSelector(state => state.user);
    const T_trainer = useSelector(state => state.T_trainer);
    const state = useSelector(state => state.changeState);
    


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
      //console.log('else');
      //setMainIndicator(false);
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
            
    
            if(credentials.password == '1')
            {
              //setMainIndicator(false);
              dispatch(saveUser(userObject));
              navigation.navigate('MainUserScreen');
            }
            else{
              //setMainIndicator(false);
              dispatch(T_saveTrainer(userObject));
              navigation.navigate('MainTrainerScreen');
            }
          } 
          else {
            console.log('No credentials stored');
            //navigation.navigate('MainUserGeneralScreen');
            setMainIndicator(false);
          }
        } catch (error) {
          console.log("Keychain couldn't be accessed!", error);
        }
        //await Keychain.resetGenericPassword();
      }
  
    useEffect(() => {
      console.log('use effect');
      verifyIfUserIsLogged();

      return () => {
        console.log('return [] ask screen');
      }
  
    }, []);

    const changeScreen = (newScreen) => {
        navigation.navigate(newScreen);
    }

   console.log('main indicator', mainIndicator);

    return (
        <>
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
              <ImageBackground source={ require('../../assets/img/background_question.jpg')} style={styles.backgroundImage}>
                <View style={styles.containerAskScreen}>
                    <Text style={styles.textQuestion}>¿Deseas registrarte o iniciar sesión?</Text>
                    <TouchableOpacity style={styles.buttonRegisterLogin} onPress={() => changeScreen('Login')} >
                        <Text style={styles.textButttonregisterLogin}>Iniciar sesión</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonRegisterLogin} onPress={() => changeScreen('Register')} >
                        <Text style={styles.textButttonregisterLogin}>Registrarme</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonContinue} onPress={() => changeScreen('MainUserGeneralScreen')} >
                        <Text style={styles.textButtonConitnue}>Continuar sin registrarme</Text>
                    </TouchableOpacity>
                </View>
              </ImageBackground>
             )
            }
        </>
    );

}

export default AskScreen;

const styles = StyleSheet.create({ 

    containerIndicator:{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1
    },

    backgroundImage:{
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center",
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },

    containerAskScreen: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    textQuestion:{
        fontSize: 22,
        marginBottom: 15,
        color: '#fff',
        backgroundColor: '#FFA50044',
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    buttonRegisterLogin:{
        backgroundColor: Colors.MainBlue,
        width: '70%',
        paddingVertical: 10,
        marginVertical: 8,

    },
    textButttonregisterLogin:{
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
    },
    buttonContinue:{
        backgroundColor: Colors.Orange,
        width: '80%',
        paddingVertical: 10,
        marginTop: 12,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    textButtonConitnue:{
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
    },
});