import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Image,
  Dimensions,
  Alert,
} from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';


import TopBar from '../shared/TopBar';

import Colors from '../../colors/colors';
import SideBarUser from '../shared/SideBarUser';
import BottomBar from '../shared/BottomBarUser';

import axios from 'axios';


import { openDatabase } from 'react-native-sqlite-storage';

import { useDispatch, useSelector } from 'react-redux';

import { changeState } from '../../store/actions/actionsReducer';

const db = openDatabase({ name: 'roomGym.db' });

const Drawer = createDrawerNavigator();


export default function GymProfile({navigation}) {
  return (
    <>
      <Drawer.Navigator drawerContent={(navigation) => <SideBarUser {...navigation} />}>
        <Drawer.Screen name="GymProfile" component={GymProfileScreen} />
      </Drawer.Navigator>
    </>
  );
}


const GymProfileScreen = ({navigation}) => {

  const state = useSelector(state => state.changeState);

  const dispatch = useDispatch();


  return (
    <View style={styles.mainContainer}>
        <TopBar navigation={navigation} title={`Gimnasio`} returnButton={false} />
        <ScrollView style={{flex:1}}>
            <Text>ho</Text>
        </ScrollView>

        <BottomBar navigation={navigation}/>
    </View>
  );
};

const styles = StyleSheet.create({
    mainContainer:{
        flex: 1
    }
});
