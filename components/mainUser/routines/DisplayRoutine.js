import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import TopBar from '../../shared/TopBar';

import { createDrawerNavigator } from '@react-navigation/drawer';

import SideBarUser from '../../shared/SideBarUser';
import BottomBar from '../../shared/BottomBarUser';


import { saveCurrentExercise } from '../../../store/actions/actionsReducer';


import { urlServer } from '../../../services/urlServer';


const Drawer = createDrawerNavigator();


export default function DisplayRoutine() {


  return (
    <>
      <Drawer.Navigator drawerContent={(props) => <SideBarUser {...props} />}>
        <Drawer.Screen name="DisplayRoutine" component={DisplayRoutineScreen }/>
      </Drawer.Navigator>
    </>
  );
}



const DisplayRoutineScreen = ({navigation}) => {



  const serverUrl = urlServer.url;

  const dispatch = useDispatch();

  const currentRoutine = useSelector(state => state.currentRoutine);


  const changeScreen = (routine, index) => {
    
    dispatch(saveCurrentExercise({exercise: routine, index}));
    navigation.navigate('CurrentRoutine');
  }


  return (
    <>
      <TopBar navigation={navigation} title={currentRoutine.nombre} returnButton={true} />
        <View style={styles.containerScrollView}>
            <ScrollView>
              {
                currentRoutine.ejercicios.map((routine, index) => {

                  return(
                    <View key={index} style={styles.containerTouchableImage}>
                      <TouchableOpacity style={styles.touchableContainerImage}
                        onPress={() => changeScreen(routine, index)} >
                          <Text style={styles.textImageButton}>{routine.name}</Text>
                      </TouchableOpacity>
                    </View>
                  )
                })
              }
            </ScrollView>
        </View>
      <BottomBar navigation={navigation}/>
    </>
  );
};

const styles = StyleSheet.create({
    containerScrollView:{
        flex: 1
      },
      containerTouchableImage:{
        height: 150,
        width: '100%',
        backgroundColor: '#fff',
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 25,
        marginBottom: 10
      },
      touchableContainerImage:{
        height: '100%',
        width: '100%',
        backgroundColor: '#123456',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        overflow: 'hidden', 
      },
      imageButton: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
      },
      textImageButton:{
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#244EABa0"
      },  
      containerTextDescriptionButton:{
        paddingHorizontal: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems:'center'
      },
      textDescriptionButton:{
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '700'
      },
      textDescriptionButtonSubtitle:{
        fontSize: 14,
        marginTop: 5
      },
});
