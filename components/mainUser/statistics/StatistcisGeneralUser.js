import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';


import { createDrawerNavigator } from '@react-navigation/drawer';


import TopBar from '../../shared/TopBar';

import Colors from '../../../colors/colors';
import SideBarUser from '../../shared/SideBarUser';
import BottomBar from '../../shared/BottomBarUser';

import { useDispatch, useSelector } from 'react-redux';

import { changeState } from '../../../store/actions/actionsReducer';

import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({ name: 'roomGym.db' });


const Drawer = createDrawerNavigator();

export default function StatisticsUserGeneral({navigation}) {
  return (
    <>
      <Drawer.Navigator drawerContent={(navigation) => <SideBarUser {...navigation} />}>
        <Drawer.Screen name="StatisticsUserGeneral" component={StatisticsUserGeneralScreen} />
      </Drawer.Navigator>
    </>
  );
}

const StatisticsUserGeneralScreen = ({navigation}) => {


  return (
    <>
        <TopBar navigation={navigation} title={`Bienvenido Usuario`} returnButton={true} />
        <ScrollView style={styles.containerScrollView}>

            <Text style={styles.textRegister}>Para guardar y visualizar estadisticas, necesitas registrarte</Text>

        </ScrollView>
        <BottomBar navigation={navigation}/>
    </>
  );
};

const styles = StyleSheet.create({
    containerScrollView:{
        flex: 1,
        padding: 15
    },
    textRegister:{
        fontSize: 18,
        color: '#fff',
        padding: 10,
        backgroundColor: Colors.MainBlue
    },
});