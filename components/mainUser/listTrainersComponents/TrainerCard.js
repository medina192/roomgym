import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import Colors from '../../../colors/colors';

import Icon from 'react-native-vector-icons/FontAwesome';

import { useDispatch, useSelector } from 'react-redux';

import { saveTrainer } from '../../../store/actions/actionsReducer';

const TrainerCard = ({trainer, navigation}) => {

  const dispatch = useDispatch();


  const watchProfile = () => {
    dispatch(saveTrainer(trainer.item));
    navigation.navigate('TrainerProfile');
  }

  console.log(trainer);

  return (
    <>
       <View style={styles.containerTrainerCard}>
          <View style={styles.trainerCard}>
            <View style={styles.containerImage_Name}>
                <Icon name="user-o" size={24} style={styles.iconImage} color="#fff" />
              <Text style={styles.trainerName}>{trainer.item.nombres + ' '+ trainer.item.apellidos}</Text>
            </View>
            <View style={styles.containerDescription}>
              <Text style={styles.description}>
                {trainer.item.descripcion_entrenador}
              </Text>
            </View>
            {
              /*
                          <View style={styles.containerContactInformation}>
                <Icon name="envelope" size={24} style={styles.iconContact} color="#fff" />
                <Icon name="instagram" size={24} style={styles.iconContact} color="#fff" />
                <Icon name="facebook-square" size={24} style={styles.iconContact} color="#fff" />
                <Icon name="twitter-square" size={24} style={styles.iconContact} color="#fff" />
            </View>
              */
            }
          </View>
          <View style={styles.containerButtonSubscribe}>
          <TouchableOpacity style={styles.buttonSubscribe} onPress={ watchProfile }>
            <Text style={styles.textButoonSubscribe}>Ver perfil</Text>
          </TouchableOpacity>
        </View>
        </View>

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

    // button subscribe
  containerButtonSubscribe:{
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginBottom: 20
  },
  buttonSubscribe:{
    backgroundColor: Colors.Orange,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  textButoonSubscribe:{
    color: '#fff',
    fontSize: 20,
    fontWeight: '700'
  },
});

export default TrainerCard;