import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';


import TopBar from '../shared/TopBar';

import Icon from 'react-native-vector-icons/FontAwesome';

import { createDrawerNavigator } from '@react-navigation/drawer';

import SideBarUser from '../shared/SideBarUser';

import BottomBar from '../shared/BottomBarUser';

import { routines } from '../../services/routines';

import { saveSubCategorie } from '../../store/actions/actionsReducer';

import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';

import Colors from '../../colors/colors';

const Drawer = createDrawerNavigator();

export default function Routines() {
  return (
    <>
      <Drawer.Navigator drawerContent={(props) => <SideBarUser {...props} />}>
        <Drawer.Screen name="Routines" component={RoutinesScreen} />
      </Drawer.Navigator>
    </>
  );
}


const RoutinesScreen = ({navigation}) => {
  
  const dispatch = useDispatch();

  const categories = Object.keys(routines);

  const changeToCategorie = (categorie) => {
    
    const subCategories = Object.values(routines[categorie]);

    const auxObject = {categorie, subCategories}
    dispatch(saveSubCategorie(auxObject));
    navigation.navigate('SubCategories');
  }


  
  return (
    <View style={{flex: 1, position: 'relative'}}>
      <TopBar navigation={navigation} title={'Categorias'} returnButton={true} />
        <ScrollView style={{flex: 1 }}>
          <View style={styles.containerScrollView}>
            {
              categories.map((categorie, indexCategorie) => {

                let categorieUpperCase = categorie[0].toUpperCase() + categorie.slice(1,categorie.length );
                return(
                  <View key={indexCategorie} style={styles.optionsCard}>
                    <View style={styles.containerFlexRow}>
                      <Text style={styles.titleOption}>{categorieUpperCase}</Text>

                      <TouchableOpacity 
                            onPress={() => changeToCategorie(categorie)}
                            style={styles.buttonIconShowOptions}>
                            <Icon name="angle-double-right" size={24} style={styles.iconShowOptions} color="#fff" />
                      </TouchableOpacity>

                    </View>
                    <View style={styles.blueLine}></View>
                  </View>
                )
              })
            }
          </View>
        </ScrollView>
      <BottomBar navigation={navigation}/>
    </View>
  );
};

const styles = StyleSheet.create({
  containerScrollView:{
    flex: 1,
    display: 'flex',
    alignItems: 'center'
  },
  
  
  optionsCard:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
        width: 10,
        height: 15,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
    width: Dimensions.get('window').width * 0.9,
    marginVertical: 10
  },
  containerFlexRow:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.8
  },
  titleOption:{
    color: Colors.MainBlue,
    fontSize: 20,
    fontWeight: '700'
  },
  buttonIconShowOptions:{
  },
  iconShowOptions:{
    color: Colors.MainBlue,
    fontSize: 28
  },

  blueLine:{
    width: Dimensions.get('window').width * 0.8,
    height: 1,
    backgroundColor: Colors.MainBlue,
    marginTop: 10,
    marginBottom: 10
  },  

});