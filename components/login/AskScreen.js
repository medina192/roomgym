import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Switch,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { saveUser, T_saveTrainer } from '../../store/actions/actionsReducer';

import * as Keychain from 'react-native-keychain';

import  Colors  from '../../colors/colors';

const AskScreen = ({navigation}) => {

    const dispatch = useDispatch();

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
              console.log('asd',userObject);
              dispatch(saveUser(userObject));
              navigation.navigate('MainUserScreen');
            }
            else{
              dispatch(T_saveTrainer(userObject));
              navigation.navigate('MainTrainerScreen');
            }
          } 
          else {
            console.log('No credentials stored');
            //navigation.navigate('MainUserGeneralScreen');
          }
        } catch (error) {
          console.log("Keychain couldn't be accessed!", error);
        }
        //await Keychain.resetGenericPassword();
      }
  
    useEffect(() => {
      
      verifyIfUserIsLogged();
  
    }, []);

    const changeScreen = (newScreen) => {
        navigation.navigate(newScreen);
    }

    return (
        <>
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
        </>
    );

}

export default AskScreen;

const styles = StyleSheet.create({ 
    containerAskScreen: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textQuestion:{
        fontSize: 22,
        marginBottom: 15,
    },
    buttonRegisterLogin:{
        backgroundColor: Colors.MainBlue,
        width: '70%',
        paddingVertical: 10,
        marginVertical: 8,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
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