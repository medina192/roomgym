import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import Colors from '../../colors/colors';

const TopBar = ({title, returnButton, navigation}) => {

  const returnPrevousScreen = () => {
    navigation.goBack();
  }

  const openMenu = () => {
    console.log('drawer');
    navigation.openDrawer();
  }

  return (
    <>
      {
        returnButton ? (

          <View style={styles.topBarWithButton}>
            <TouchableOpacity onPress={openMenu}>
              <Icon name="navicon" size={24} style={styles.iconBottomBar} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.titleTopBar}>{title}</Text>
            <TouchableOpacity onPress={returnPrevousScreen}>
              <Icon name="mail-reply" size={24} style={styles.iconBottomBar} color="#fff" />
            </TouchableOpacity>
          </View>
        )
        : (
          <View style={styles.topBarWith2Button}>
            <TouchableOpacity onPress={openMenu}>
              <Icon name="navicon" size={24} style={styles.iconBottomBar} color="#fff" />
            </TouchableOpacity>
            <View style={styles.justTitleBar}>
              <Text style={styles.titleJustTopBar}>{title}</Text>
            </View>
          </View>
        )
      }
    </>
  );
};

const styles = StyleSheet.create({
  topBar:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    backgroundColor: Colors.MainBlue,
  },
  titleTopBar:{
    fontSize: 20,
    fontWeight: '700',
    color: '#fff'
  },
  topBarWithButton:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: Colors.MainBlue,
  },
  iconBottomBar:{
    fontSize: 30,
    color: '#fff'
  },

  topBarWith2Button:{
    backgroundColor: Colors.MainBlue,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  justTitleBar:{
    flex: 1,
  },
  titleJustTopBar:{
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center'
  },
});

export default TopBar;