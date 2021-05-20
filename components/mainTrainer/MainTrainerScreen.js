import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/FontAwesome';

import TopBar from '../shared/TopBar';

import Colors from '../../colors/colors';

import SideBarTrainer from '../shared/SideBarTrainer';
import BottomBar from '../shared/BottomBarUser';


const Drawer = createDrawerNavigator();

export default function MainTrainerScreen({navigation}) {

  return (
    <>
      <Drawer.Navigator drawerContent={( navigation) => <SideBarTrainer {...navigation} />}>
        <Drawer.Screen name="TrainerScreen" component={TrainerScreen} />
      </Drawer.Navigator>
    </>
  );
}

const TrainerScreen = ({navigation}) => {



  /*

  const proof = async() => {

    try {
      // Retrieve the credentials
      const credentials = await Keychain.getGenericPassword();

      if (credentials) {
        console.log(
          'trainer Credentials successfully loaded for user ' + credentials.username
        );
      } else {
        console.log(' Trainer No credentials stored');
      }
    } catch (error) {
      console.log(" Trainer Keychain couldn't be accessed!", error);
    }

    const q = await Keychain.resetGenericPassword();

    console.log(q);

  }

  proof();

*/

  return (
    <>
      <TopBar navigation={navigation} title={`Bienvenido Entrenador`} returnButton={false} />
      
      <ScrollView>

        <View style={styles.containerTrainerCard}>
          <View style={styles.trainerCard}>
            <View style={styles.containerImage_Name}>
                <Icon name="user-o" size={24} style={styles.iconImage} color="#fff" />
              <Text style={styles.trainerName}>Alejandro Díaz Medina</Text>
            </View>
            <View style={styles.containerDescription}>
              <Text style={styles.description}>
                survived not only five centuries, but also the leap into electronic 
                typesetting, remaining essentially unchanged. It was popularised in the 1960s
                with the release of Letraset sheets containing Lorem Ipsum passages, and more
                recently with desktop publishing software like Aldus PageMaker including 
                versions of Lorem Ipsum
              </Text>
            </View>
            <View style={styles.containerContactInformation}>
                <Icon name="envelope" size={24} style={styles.iconContact} color="#fff" />
                <Icon name="instagram" size={24} style={styles.iconContact} color="#fff" />
                <Icon name="facebook-square" size={24} style={styles.iconContact} color="#fff" />
                <Icon name="twitter-square" size={24} style={styles.iconContact} color="#fff" />
            </View>
          </View>
        </View>

        {
          /*
        <View style={styles.containerAdvices}> 
          <View style={styles.advice}>
            <Text style={styles.adviceTitle}>Consejo 1</Text>
            <Text style={styles.advicedescription}>
                with the release of Letraset sheets containing Lorem Ipsum passages, and more
                recently with desktop publishing software like Aldus PageMaker including 
                versions of Lorem Ipsum
            </Text>
          </View>
        </View>
        <View style={styles.containerAdvices}> 
          <View style={styles.advice}>
            <Text style={styles.adviceTitle}>Consejo 2</Text>
            <Text style={styles.advicedescription}>
                with the release of Letraset sheets containing Lorem Ipsum passages, and more
                recently with desktop publishing software like Aldus PageMaker including 
                versions of Lorem Ipsum
            </Text>
          </View>
        </View>
          */
        }

        <View style={styles.containerButtonSubscribe}>
          <TouchableOpacity style={styles.buttonSubscribe} onPress={ () => navigation.navigate('CreateNotes')}>
            <Text style={styles.textButoonSubscribe}>Crear nota</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.containerButtonSubscribe}>
          <TouchableOpacity style={styles.buttonSubscribe} onPress={ () => navigation.navigate('MainUserScreen')}>
            <Text style={styles.textButoonSubscribe}>Pantalla Usuario</Text>
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

      </ScrollView>

      <BottomBar navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  containerTrainerCard:{
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  trainerCard:{
    backgroundColor: "#244EABa0",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  containerImage_Name:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  iconImage:{
    fontSize: 80,
    color: '#fff'
  },
  trainerName:{
    fontSize: 22,
    fontWeight: '700',
    color: '#fff'
  },  
  containerDescription:{
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  description:{
    fontSize: 18
  },
  containerContactInformation:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  iconContact:{
    fontSize: 24,
    color: '#fff'
  },

// advices

  containerAdvices:{
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  advice:{
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#244EABa0",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  adviceTitle:{
    fontSize: 22,
    color: '#fff'
  },
  advicedescription:{
    fontSize: 18
  },


  // button subscribe
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

  // bottom bar
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
