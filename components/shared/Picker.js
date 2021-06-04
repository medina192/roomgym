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

const PickerText = ({navigation}) => {



    return(
        <View style={styles.transparentOpaqueBackground}>
            <View style={styles.alertCard}>
                <Text>Hola</Text>
            </View>
        </View>
    )

}

export default PickerText;

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

});

