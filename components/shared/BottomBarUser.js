
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

const BottomBar = ({ navigation}) => {

    const changeUserScreen = (newScreen) => {
        navigation.navigate(newScreen);
    }
    

  return (
    <>
      <View style={styles.containerBottomBar}>
          <TouchableOpacity onPress={() => changeUserScreen('Routines')}>
            <Icon name="envelope" size={24} style={styles.iconBottomBar} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeUserScreen('ListTrainers')}>
            <Icon name="group" size={24} style={styles.iconBottomBar} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeUserScreen('CustomPlan')}>
            <Icon name="bar-chart-o" size={24} style={styles.iconBottomBar} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeUserScreen('Statistics')}>
            <Icon name="user-o" size={24} style={styles.iconBottomBar} color="#fff" />
          </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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

export default BottomBar;