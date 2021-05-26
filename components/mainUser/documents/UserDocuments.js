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

//import {NativeModules} from 'react-native';  // resolve the warning of require cycles
//const RNFetchBlob = NativeModules.RNFetchBlob
import RNFetchBlob from 'rn-fetch-blob';

import Video, {FilterType} from 'react-native-video';

import Pdf from 'react-native-pdf';

import { openDatabase } from 'react-native-sqlite-storage';



 
const db = openDatabase({ name: 'roomGym.db' });
 

const Drawer = createDrawerNavigator();


export default function UserDocuments() {


  return (
    <>
      <Drawer.Navigator drawerContent={(props) => <SideBarTrainer {...props} />}>
        <Drawer.Screen name="UserDocuments" component={UserDocumentsScreen}/>
      </Drawer.Navigator>
    </>
  );
}



const UserDocumentsScreen = ({navigation}) => {



  useEffect(() => {
    const createTable = () => {
      db.transaction(function (txn) {
        txn.executeSql(
          //"SELECT name FROM sqlite_master WHERE type='table' AND name='Student_Table'",
          "SELECT name FROM sqlite_master WHERE type='table' AND name='documentsUser'",
          [],
          function (tx, res) {
            console.log('item:', res.rows.length);
            console.log('tx', tx);
            
            if (res.rows.length == 0) {
              txn.executeSql('DROP TABLE IF EXISTS documentsUser', []);
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS documentsUser(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(30), phone INT(15), address VARCHAR(255))',
                []
              );
            }
            
          }
        );
      })
      console.log('SQLite Database and Table Successfully Created...');
    };

    //createTable();
  }, [])



  const getData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM documentsUser',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
          {
            temp.push(results.rows.item(i));
            console.log('results---', results.rows.item(i));
          }
        }
      );
 
    });
  }

  const deleteDB = () => {
    console.log('hola');
    db.transaction((tx) => {
      tx.executeSql(
        'DROP TABLE documentsUser',
        [],
        (tx, results) => {
          console.log('results');
        }
      );
 
    });
  }

  //getData();
 
  //deleteDB();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'fff'}}>
        <TopBar navigation={navigation} title={`Bienvenido Usuario`} returnButton={true} />
          <ScrollView style={{flex: 1}}>

          </ScrollView>
        <BottomBar navigation={navigation}/>
    </SafeAreaView>
  );


};




const styles = StyleSheet.create({

});
