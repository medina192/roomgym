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
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import Colors from '../../colors/colors';

const AlertComponent = ({navigation, type, action, message, title, iconAlert, closeFunction, stateVariable, nextScreen}) => {


    const [dataAlert, setDataAlert] = useState({
        backgroundColor: '',
        action: '',
        colorButton: ''
    });

    console.log('-----', type, '-----', action);

    useEffect(() => {
        switch (type) {
            case 'error':
                setDataAlert({
                    backgroundColor: styles.backgroundColorIconError,
                    action,
                    colorButton: styles.buttonError
                });
                
            break;

            case 'warn':
                setDataAlert({
                    backgroundColor: styles.backgroundColorIconWarn,
                    action,
                    colorButton: styles.buttonWarn
                });

            break;

            case 'good':
                setDataAlert({
                    backgroundColor: styles.backgroundColorIconGood,
                    action,
                    colorButton: styles.buttonGood
                });
            break;
        
            default:
                break;
        }
    }, []);


    const closeAlert = () => {
        closeFunction({
            ...stateVariable,
            show: false
        });
    }


    const returnLastScreen = () => {
        navigation.goBack();
    }


    const changeToNextScreen = () => {
        navigation.navigate(nextScreen);
    }


    return(
        <View style={styles.transparentOpaqueBackground}>
            <View style={styles.alertCard}>
                <View style={dataAlert.backgroundColor}>
                    <Icon name={iconAlert} size={24} style={styles.iconAlert} color="#fff" />
                </View>
                <View style={styles.containerText}>
                    <Text style={styles.textTitle}>{title}</Text>
                    <Text style={styles.textMessage}>{message}</Text>
                </View>
                <View style={styles.containerButton}>
                        {
                            (() => { 
                                switch (dataAlert.action) {
                                    case 'close':
                                        return(
                                            <TouchableOpacity
                                                style={dataAlert.colorButton}
                                                onPress={closeAlert}
                                            >
                                                <Text style={styles.textButton}>Cerrar</Text>  
                                            </TouchableOpacity>  
                                        )
                                    break;

                                    case 'return':
                                        return(
                                            <TouchableOpacity
                                                style={dataAlert.colorButton}
                                                onPress={returnLastScreen}
                                            >
                                                <Text style={styles.textButton}>Regresar</Text>  
                                            </TouchableOpacity>  
                                        )
                                    break;

                                    case 'next':
                                        return(
                                            <TouchableOpacity
                                                style={dataAlert.colorButton}
                                                onPress={changeToNextScreen}
                                            >
                                                <Text style={styles.textButton}>Siguiente</Text>  
                                            </TouchableOpacity>   
                                        )
                                    break;

                                    default:
                                        break;
                                }
                            } )()
                        }
                </View>
            </View>
        </View>
    )

}

export default AlertComponent;

const styles = StyleSheet.create({
    transparentOpaqueBackground:{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#00000055'
    },
    alertCard:{
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
    backgroundColorIconError:{
        backgroundColor: Colors.alertRed,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '30%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    backgroundColorIconWarn:{
        backgroundColor: Colors.alertYellow,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '30%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    backgroundColorIconGood:{
        backgroundColor: Colors.alertGreen,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '30%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    iconAlert:{
        fontSize: 55,
    },

    // text
    containerText:{
        display: 'flex',
        justifyContent: 'center',
        paddingHorizontal: 15,
        alignItems: 'center',
        height: '40%',
    },
    textTitle:{
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
    },
    textMessage:{
        fontSize: 18,
        fontWeight: '400',
        textAlign: 'center',
        marginTop: 20,
    },

    // button
    containerButton:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '30%'
    },  
    buttonError:{
        backgroundColor: Colors.alertRed,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    buttonWarn:{
        backgroundColor: Colors.alertYellow,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    buttonGood:{
        backgroundColor: Colors.alertGreen,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    textButton:{
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});

