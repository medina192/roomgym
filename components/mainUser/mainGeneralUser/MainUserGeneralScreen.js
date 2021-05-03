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

import ImageSlider from '../ImageSlider';

import TopBar from '../../shared/TopBar';

import Colors from '../../../colors/colors';
import SideBarUser from '../../shared/SideBarUser';
import BottomBar from '../../shared/BottomBarUser';


const Drawer = createDrawerNavigator();

export default function MainUserGeneralScreen({navigation}) {
  return (
    <>
      <Drawer.Navigator drawerContent={(navigation) => <SideBarUser {...navigation} />}>
        <Drawer.Screen name="UserGeneralScreen" component={UserGeneralScreen} />
      </Drawer.Navigator>
    </>
  );
}

const UserGeneralScreen = ({navigation}) => {


  
  const changeUserScreen = (newScreen) => {
    navigation.navigate(newScreen);
  }

  const openMenu = () => {
    console.log('drawer');
    navigation.openDrawer();
  }


  return (
    <>
        <TopBar navigation={navigation} title={`Bienvenido Usuario`} returnButton={false} />
        <ScrollView style={styles.containerScrollView}>
          <ImageSlider />          
          <View style={styles.containerTextDescriptionButton}>
            <Text style={styles.textDescriptionButton}>Comienza ya¡</Text>
          </View>
          <View style={styles.containerTouchableImage}>
            <TouchableOpacity style={styles.touchableContainerImage}
              onPress={() => changeUserScreen('Routines')} >
              <ImageBackground source={ require('../../../assets/img/4.jpg')} style={styles.imageButton}>
                <Text style={styles.textImageButton}>Rutinas</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
    
          <View style={styles.containerTextDescriptionButton}>
            <Text style={styles.textDescriptionButton}>¿No sabes por donde comenzar?</Text>
            <Text style={styles.textDescriptionButtonSubtitle}>Conoce a nuestros entrenadores para que te guien</Text>
          </View>
          <View style={styles.containerTouchableImage}>
            <TouchableOpacity style={styles.touchableContainerImage}
              onPress={() => changeUserScreen('ListTrainers')} >
              <ImageBackground source={ require('../../../assets/img/_1.jpg')} style={styles.imageButton}>
                <Text style={styles.textImageButton}>Entrenadores</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
    
          <View style={styles.containerTextDescriptionButton}>
            <Text style={styles.textDescriptionButton}>¿Deseas entrenar a tu manera?</Text>
            <Text style={styles.textDescriptionButtonSubtitle}>Crea tu plan personalizado</Text>
          </View>
          <View style={styles.containerTouchableImage}>
            <TouchableOpacity style={styles.touchableContainerImage}
              onPress={() => changeUserScreen('CustomPlan')} >
              <ImageBackground source={ require('../../../assets/img/_3.jpg')} style={styles.imageButton}>
                <Text style={styles.textImageButton}>Plan personalizado</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
          <View style={styles.containerTextDescriptionButton}>
            <Text style={styles.textDescriptionButton}>¿Cuanto eh mejorado?</Text>
            <Text style={styles.textDescriptionButtonSubtitle}>Registra tu progreso</Text>
          </View>
          <View style={styles.containerTouchableImage}>
            <TouchableOpacity style={styles.touchableContainerImage}
              onPress={() => changeUserScreen('Statistics')} >
              <ImageBackground source={ require('../../../assets/img/_4.jpg')} style={styles.imageButton}>
                <Text style={styles.textImageButton}>Estadísticas</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>

          <View style={styles.containerButtonSubscribe}>
            <TouchableOpacity style={styles.buttonSubscribe} onPress={ () => navigation.navigate('MainTrainerScreen')}>
              <Text style={styles.textButoonSubscribe}>Pantalla Entrenador</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.containerButtonSubscribe}>
          <TouchableOpacity style={styles.buttonSubscribe} onPress={ () => navigation.navigate('Registro')}>
            <Text style={styles.textButoonSubscribe}>Pantalla Registro</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.containerButtonSubscribe}>
          <TouchableOpacity style={styles.buttonSubscribe} onPress={ () => navigation.navigate('Login')}>
            <Text style={styles.textButoonSubscribe}>Pantalla Login</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.containerButtonSubscribe}>
          <TouchableOpacity style={styles.buttonSubscribe} onPress={ openMenu}>
            <Text style={styles.textButoonSubscribe}>drawer</Text>
          </TouchableOpacity>
        </View>

        </ScrollView>

        <BottomBar navigation={navigation}/>
    </>
  );
};

const styles = StyleSheet.create({
  containerScrollView:{
    flex: 1,
    backgroundColor: '#fff'
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



  containerButtonSubscribe:{
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginBottom: 20
  },
  buttonSubscribe:{
    backgroundColor: '#f10265',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textButoonSubscribe:{
    color: '#fff',
    fontSize: 20,
    fontWeight: '700'
  },


  containerBottomBar:{
    width: '100%',
    height: 'auto',
    paddingVertical: 10,
    backgroundColor: Colors.MainBlue,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  iconBottomBar:{
    fontSize: 35,
    color: '#fff'
  }
});