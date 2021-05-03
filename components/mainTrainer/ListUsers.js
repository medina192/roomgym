import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';

import axios from 'axios';

import TopBar from '../shared/TopBar';

import { useDispatch, useSelector } from 'react-redux';

import { createDrawerNavigator } from '@react-navigation/drawer';

import SideBarTrainer from '../shared/SideBarTrainer';
import BottomBar from '../shared/BottomBarUser';

import Colors from '../../colors/colors';

import { urlServer } from '../../services/urlServer';

import CardUser from './CardUser';

const Drawer = createDrawerNavigator();

export default function ListUsers() {
  return (
    <>
      <Drawer.Navigator drawerContent={(props) => <SideBarTrainer {...props} />}>
        <Drawer.Screen name="ListUsers" component={ListUsersScreen} />
      </Drawer.Navigator>
    </>
  );
}


const ListUsersScreen = ({navigation}) => {



  const serverUrl = urlServer.url;

  const [usersLoaded, setUsersLoaded] = useState(false);
  const [listUsers, setlistUsers] = useState([]);

  const trainerInformation = useSelector(state => state.T_trainer);
 

  useEffect(() => {
    ListMyUsers();
  }, []);

  const ListMyUsers = async() => {
    try {
      const res = await axios({method: 'get',url: `${serverUrl}/relations/getmyusers/${trainerInformation.email}`});
      //console.log(res.data.resp);
      //setlistTrainers(response.data.resp);
      setUsersLoaded(true);
      setlistUsers(res.data.resp);
 
     
      /*
      for(let i = 0; i < users.length; i++)
      {
        auxUsers = await axios({method: 'get',url: `${serverUrl}/relations/searchforatrainer/${trainers[i].email_entrenador}`});
        trainersList[i] = auxtrainers.data.resp[0];
      }

      setlistTrainers(trainersList);
      setTrainersLoaded(true);
      */
    } catch (error) {
      console.log(error);        
    }
  }

  return (
    <>
      <View style={styles.containerListTrainers}>
        <TopBar navigation={navigation} title={`Usuarios Suscritos`} returnButton={true} />

        <View style={{ flex:1}}>
            {(() => { 

            if(usersLoaded)
            {
              return(
                <View>
                  <FlatList
                    data={listUsers}
                    renderItem= { (user) => 
                    {
                      return( ()=> {
   
                        return(
                          <>      
                            <CardUser user={user} navigation={navigation}/>
                          </>
                        );
                      })()
                    }
                    }
                    keyExtractor= {(trainer, key) => key.toString()}
                  />
                </View>
                  );
                }
                else{
                  return(
                    <Text>There is no trainers</Text>
                  );
                }
              } )()}
        </View>
        <BottomBar navigation={navigation}/>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  containerListTrainers:{
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  // buttons
  containerButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 5,
    width: '100%'
  },
  button: {
    backgroundColor: Colors.Orange,
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  buttonPressed:{
    backgroundColor: '#dd5d00',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  textButton: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff'
  },
});
