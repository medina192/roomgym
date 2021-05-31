import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import Colors from '../../colors/colors';

import * as Keychain from 'react-native-keychain';

const SideBarTrainer = ({navigation}) => {


    const deleteSecureStorage = async() => {
        await Keychain.resetGenericPassword();
        navigation.navigate('Login');
    }

    return(
        <>
            <View style={styles.containerTop}>
                <View style={styles.containerImagePhrase}>
                    <Image  style={styles.iconImage}
                            source={ require('../../assets/img/mainicon.png')} 
                    />
                </View>
            </View>
            <View style={styles.containerLinks}>
                <TouchableOpacity style={styles.buttonLink} onPress={ () => navigation.navigate('Routines')}>
                    <Icon name="envelope" size={24} style={styles.iconLink} color="#fff" />
                    <Text style={styles.textLink}>Mensajes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonLink} onPress={ () => navigation.navigate('ListUsers')}>
                    <Icon name="group" size={24} style={styles.iconLink} color="#fff" />
                    <Text style={styles.textLink}>Usuarios</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonLink} onPress={ () => navigation.navigate('MainTrainerScreen')}>
                    <Icon name="user-o" size={24} style={styles.iconLink} color="#fff" />
                    <Text style={styles.textLink}>Mi perfil</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonLink} onPress={ () => navigation.navigate('CustomPlan')}>
                    <Icon name="bar-chart-o" size={24} style={styles.iconLink} color="#fff" />
                    <Text style={styles.textLink}>Estadísticas</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.containerLine}>
                <View style={styles.line}></View>
            </View>
            <View style={styles.containerButtonLogOut}>
                <TouchableOpacity style={styles.buttonLink} onPress={deleteSecureStorage}>
                    <Icon name="share-square-o" size={24} style={styles.iconLink} color="#fff" />
                    <Text style={styles.textLink}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>
        </>
    );
} 


const styles = StyleSheet.create({
    containerTop:{
      backgroundColor: '#fff'
    },
    containerImagePhrase:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconImage:{
        width: 180,
        height: 180
    },
    textImage:{
        textAlign: 'center',
        marginTop: 1,
        marginBottom: 5
    },
    containerLinks:{
        backgroundColor: Colors.MainBlue,
        paddingHorizontal: 10,
        paddingVertical: 20,
        flex: 1
    },
    buttonLink:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        //backgroundColor: '#246dab',
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    iconLink:{
        fontSize: 30,
        marginRight: 10
    },
    textLink:{
        fontSize: 16,
        fontWeight: '700',
        color: '#fff'
    },
    containerLine:{
        backgroundColor: Colors.MainBlue
    },  
    line:{
        marginHorizontal: 10,
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
    },  
    containerButtonLogOut:{
        backgroundColor: Colors.MainBlue,
    },
});   

export default SideBarTrainer;