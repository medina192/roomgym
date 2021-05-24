import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  PermissionsAndroid,
} from 'react-native';



import {Picker} from '@react-native-picker/picker';

import axios from 'axios';

import { useDispatch, useSelector } from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Button, Paragraph, Dialog, Portal } from 'react-native-paper';

import TopBar from '../../shared/TopBar';

import { createDrawerNavigator } from '@react-navigation/drawer';

import SideBarTrainer from '../../shared/SideBarTrainer';
import BottomBar from '../../shared/BottomBarUser';

import Colors  from '../../../colors/colors';

import { urlServer } from '../../../services/urlServer';



const SavedNote = ({navigation}) => { 

    return(
        <View>
            <Text>Saved note</Text>
        </View>
    );
}


const styles = StyleSheet.create({ 

});

export default SavedNote;





