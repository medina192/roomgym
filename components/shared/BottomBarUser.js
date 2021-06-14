
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

import { useDispatch, useSelector } from 'react-redux';


const BottomBar = ({ navigation}) => {

  const dispatch = useDispatch();

  const user = useSelector(state => state.user);
  const T_trainer = useSelector(state => state.T_trainer);

    const changeUserScreen = (newScreen) => {
        navigation.navigate(newScreen);
    }
    

  return (
    <>
      {
        !T_trainer == '' ? 
        (
          <View style={styles.containerBottomBar}>
            <TouchableOpacity onPress={() => changeUserScreen('ListUsers')}>
              <Icon name="group" size={24} style={styles.iconBottomBar} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeUserScreen('MainTrainerScreen')}>
              <Icon name="user-o" size={24} style={styles.iconBottomBar} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeUserScreen('MyGymTrainer')}>
              <Icon name="home" size={24} style={styles.iconBottomBar} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeUserScreen('CreateGym')}>
              <Icon name="heart" size={24} style={styles.iconBottomBar} color="#fff" />
            </TouchableOpacity>
          </View>
        )
        :
        (
          <View style={styles.containerBottomBar}>
            <TouchableOpacity onPress={() => changeUserScreen('Routines')}>
              <Icon name="trophy" size={24} style={styles.iconBottomBar} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeUserScreen('ListTrainers')}>
              <Icon name="group" size={24} style={styles.iconBottomBar} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeUserScreen('CustomPlan')}>
              <Icon name="user-o" size={24} style={styles.iconBottomBar} color="#fff" />
            </TouchableOpacity>
            {
              user == '' ? 
              (
                <TouchableOpacity onPress={user == '' ? () => changeUserScreen('StatisticsUserGeneral') : () => changeUserScreen('Statistics')}>
                  <Icon name="bar-chart-o" size={24} style={styles.iconBottomBar} color="#fff" />
                </TouchableOpacity>
              )
              :
              (
                <TouchableOpacity onPress={user == '' ? () => changeUserScreen('Statistics') : () => changeUserScreen('Statistics')}>
                  <Icon name="bar-chart-o" size={24} style={styles.iconBottomBar} color="#fff" />
                </TouchableOpacity>
              )
            }
        </View>
        )
      }
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