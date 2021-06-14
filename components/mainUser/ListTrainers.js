import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
} from 'react-native';

import axios from 'axios';

import TopBar from '../shared/TopBar';

import { useDispatch, useSelector } from 'react-redux';

import { createDrawerNavigator } from '@react-navigation/drawer';

import SideBarUser from '../shared/SideBarUser';
import TrainerCard from './listTrainersComponents/TrainerCard';
import BottomBar from '../shared/BottomBarUser';

import Colors from '../../colors/colors';

import { urlServer } from '../../services/urlServer';

import { TouchableOpacity } from 'react-native-gesture-handler';

const Drawer = createDrawerNavigator();

export default function ListTrainers() {
  return (
    <>
      <Drawer.Navigator drawerContent={(props) => <SideBarUser {...props} />}>
        <Drawer.Screen name="ListTrainers" component={ListTrainersScreen} />
      </Drawer.Navigator>
    </>
  );
}


const ListTrainersScreen = ({navigation}) => {

  const serverUrl = urlServer.url;

  const [trainersLoaded, setTrainersLoaded] = useState(false);
  const [listTrainers, setlistTrainers] = useState([]);
  const [myTrainers, setMyTrainers] = useState(false);

  const dispatch = useDispatch();
  const userInformation = useSelector(state => state.user);

  useEffect(() => {
    
    loadFirstTrainers();
    
  }, []);



  const loadFirstTrainers = async() => {


      if(!myTrainers)
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
      else{

          try {
            const res = await axios({method: 'get',url: `${serverUrl}/relations/getmytrainers/${userInformation.email}`});
            //console.log(res.data.resp);
            //setlistTrainers(response.data.resp);
            const trainers = res.data.resp;
            let auxtrainers;
            let trainersList = [];
           
            for(let i = 0; i < trainers.length; i++)
            {
              auxtrainers = await axios({method: 'get',url: `${serverUrl}/relations/searchforatrainer/${trainers[i].email_entrenador}`});
              trainersList[i] = auxtrainers.data.resp[0];
            }

            setlistTrainers(trainersList);
            setTrainersLoaded(true);
          } catch (error) {
            console.log(error);        
          }
          //setlistTrainers(response.data.resp);
          //setTrainersLoaded(true);
      }

  }

  const ListMyTrainers = async() => {
    try {
      const res = await axios({method: 'get',url: `${serverUrl}/relations/getmytrainers/${userInformation.email}`});
      //console.log(res.data.resp);
      //setlistTrainers(response.data.resp);
      const trainers = res.data.resp;
      let auxtrainers;
      let trainersList = [];
     
      for(let i = 0; i < trainers.length; i++)
      {
        auxtrainers = await axios({method: 'get',url: `${serverUrl}/relations/searchforatrainer/${trainers[i].email_entrenador}`});
        trainersList[i] = auxtrainers.data.resp[0];
      }

      setlistTrainers(trainersList);
      setTrainersLoaded(true);
    } catch (error) {
      console.log(error);        
    }
  }



  const myTrainersList = () => {
    setMyTrainers(true);
    ListMyTrainers();
  }


  const allTrainers = () => {
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

  const allTrainersList = () => {
    setMyTrainers(false);

    allTrainers();
  }

  return (
    <>
      <View style={styles.containerListTrainers}>
        <TopBar navigation={navigation} title={`Lista de entrenadores`} returnButton={true} />
        <View style={styles.containerButtons}>
          <TouchableOpacity style={myTrainers ? styles.button : styles.buttonPressed } onPress={allTrainersList}>
            <Text style={styles.textButton}>Todos los entrenadores</Text>
          </TouchableOpacity>
          <TouchableOpacity style={!myTrainers ? styles.button : styles.buttonPressed } onPress={myTrainersList}>
            <Text style={styles.textButton}>Mis entrenadores</Text>
          </TouchableOpacity>
        </View>

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
