import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
} from 'react-native';

import axios from 'axios';


import TopBar from '../../shared/TopBar';

import { useDispatch } from 'react-redux';

import { createDrawerNavigator } from '@react-navigation/drawer';

import SideBarUser from '../../shared/SideBarUser';
import TrainerCard from '../listTrainersComponents/TrainerCard';
import BottomBar from '../../shared/BottomBarUser';

import { urlServer } from '../../../services/urlServer';



const Drawer = createDrawerNavigator();

export default function ListMyTrainers() {
  return (
    <>
      <Drawer.Navigator drawerContent={(props) => <SideBarUser {...props} />}>
        <Drawer.Screen name="ListMyTrainers" component={ListMyTrainersScreen} />
      </Drawer.Navigator>
    </>
  );
}


const ListMyTrainersScreen = ({navigation}) => {


  const serverUrl = urlServer.url;

  const [trainersLoaded, setTrainersLoaded] = useState(false);
  const [listTrainers, setlistTrainers] = useState([]);

  const dispatch = useDispatch();

  if(!trainersLoaded)
  {
    axios({
      method: 'get',
      url: `${serverUrl}/userscreens/getlistgeneraltrainers`,
    })
    .then(function (response) {
  

      setlistTrainers(response.data.resp);
      setTrainersLoaded(true);
    })
    .catch(function (error) {
        console.log('error axios',error);
    });
  }



  return (
    <>
      <View style={styles.containerListTrainers}>
        <TopBar navigation={navigation} title={`Lista de entrenadores`} returnButton={true} />
        
        <View style={{ flex:1}}>
            {(() => { 

            if(trainersLoaded)
            {
              return(
                <View>
                  <FlatList
                    data={listTrainers}
                    renderItem= { (trainer) => 
                    {
                      return( ()=> {
   
                        return(
                          <>      
                            <TrainerCard trainer={trainer} navigation={navigation}/>
                          </>
                        );
                      })()
                    }
                    }
                    keyExtractor= {(trainer, key) => key}
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
  }
});