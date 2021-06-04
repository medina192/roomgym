import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  ActivityIndicator
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import axios from 'axios';

import { useDispatch, useSelector } from 'react-redux';

import TopBar from '../../shared/TopBar';

import { createDrawerNavigator } from '@react-navigation/drawer';

import SideBarUser from '../../shared/SideBarUser';
import BottomBar from '../../shared/BottomBarUser';

import { saveSubRoutine } from '../../../store/actions/actionsReducer';

import { urlServer } from '../../../services/urlServer';

import CheckBox from '@react-native-community/checkbox';
import Colors from '../../../colors/colors';

import AlertComponent from '../../shared/AlertComponent';

//import { Colors } from 'react-native/Libraries/NewAppScreen';

//import { ScrollView, TextInput } from 'react-native-gesture-handler';


const Drawer = createDrawerNavigator();


export default function SubCategories() {


  return (
    <>
      <Drawer.Navigator drawerContent={(props) => <SideBarUser {...props} />}>
        <Drawer.Screen name="SubCategories" component={SubCategoriesScreen}/>
      </Drawer.Navigator>
    </>
  );
}



const SubCategoriesScreen = ({navigation, route}) => {


  const serverUrl = urlServer.url;

  const dispatch = useDispatch();

  const subCategories = useSelector(state => state.subCategorie.subCategories);
  const categorie = useSelector(state => state.subCategorie.categorie);

  const user = useSelector(state => state.user);
  const state = useSelector(state => state);

  const [refreshState, setRefreshState] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [nameRoutine, setNameRoutine] = useState('');
  const [mainIndicator, setMainIndicator] = useState(false);
  const [showAlert, setShowAlert] = useState({
    show: false,
    type: 'error',
    action: 'close', 
    message: '', 
    title: '', 
    iconAlert: 'times-circle',
    nextScreen: 'MyGymTrainer'
  });


  useEffect(() => {
    
    console.log('sssss', subCategories);
    let auxObject = [];
    for(let i = 0; i < subCategories.length; i++)
    {
      auxObject[i] = {
        name: subCategories[i],
        selected: false,
        description: '',
        repetitions: '0',
        time_minutes: '0',
        time_seconds: '0'
      }
    }
    setExercises(auxObject);

  }, []);

  const changeToSubRoutine = (categorie) => {

      dispatch(saveSubRoutine(categorie));
      navigation.navigate('SubRoutines');
  }


  const setCheckBoxValue = (value, index) => {
    console.log('value', value, ' index', index);
    exercises[index].selected = !value;
    setExercises(exercises);
    setRefreshState(!refreshState);
  }

  const setValuesInputsExercise = (text, type, index) => {

    switch (type) {
      case 'repetitions':
        exercises[index].repetitions = text;
        setExercises(exercises);
        setRefreshState(!refreshState);
      break;
      case 'minutes':
        exercises[index].time_minutes = text;
        setExercises(exercises);
        setRefreshState(!refreshState);
      break;
      case 'seconds':
        exercises[index].time_seconds = text;
        setExercises(exercises);
        setRefreshState(!refreshState);
      break;
      default:
        break;
    }
  }

  const saveRoutine = () => {

    let countExercises = 0;
    for(let i = 0; i < exercises.length; i++)
    {
      if(exercises[i].selected)
      {
        countExercises++;
      }
    }

    if(countExercises > 0)
    {
      if(!nameRoutine == '')
      {

        for(let i = 0; i < exercises.length; i++)
        {
          console.log('---------',exercises[i].repetitions);
          console.log(exercises[i].repetitions != '0');
          if(exercises[i].selected)
          {
            if(exercises[i].repetitions != '' && exercises[i].repetitions != '0' )
            {
              if(exercises[i].time_minutes != '' && exercises[i].time_seconds != '')
              {
                const minutes = Number(exercises[i].time_minutes);
                const seconds = Number(exercises[i].time_seconds);
                if((minutes + seconds) > 0)
                {
                  
                  
                }
                else{
                  setShowAlert({
                    show: true,
                    type: 'error',
                    action: 'close', 
                    message: 'Un ejercicio no puede tener tiempo cero', 
                    title: 'Tiempo cero', 
                    iconAlert: 'close',
                    nextScreen: 'MyGymTrainer'
                  });
                  return;
                }
              }
              else{
                setShowAlert({
                  show: true,
                  type: 'error',
                  action: 'close', 
                  message: 'Asigna un tiempo en los campos correspondientes', 
                  title: 'Campos del tiempo vacíos', 
                  iconAlert: 'close',
                  nextScreen: 'MyGymTrainer'
                });
                return;
              }
            }
            else{
              setShowAlert({
                show: true,
                type: 'error',
                action: 'close', 
                message: 'Debes asignar al menos una repetición', 
                title: 'No asignaste repeticiones', 
                iconAlert: 'close',
                nextScreen: 'MyGymTrainer'
              });
              return;
            }
          }
          else{

          }
        }


      }
      else{
        setShowAlert({
          show: true,
          type: 'error',
          action: 'close', 
          message: 'Debes asignar un nombre a la rutina', 
          title: 'La rutina no tiene nombre', 
          iconAlert: 'close',
          nextScreen: 'MyGymTrainer'
        });
        return;
      }
    }
    else{
      setShowAlert({
        show: true,
        type: 'error',
        action: 'close', 
        message: 'Debes seleccionar al menos un ejercicio', 
        title: 'No seleccionaste ejercicios', 
        iconAlert: 'close',
        nextScreen: 'MyGymTrainer'
      });
      return;
    }

    let auxExercises = [];
    for(let i = 0; i < exercises.length; i++)
    {
      if(exercises[i].selected)
      {
        auxExercises.push(exercises[i]);
      }
    }


    const exercisesString = JSON.stringify(auxExercises);

    const auxObject = {
      ejercicios: exercisesString,
      idUsuario: user.idusuario,
      tipo: categorie,
      nombre: nameRoutine
    };  

    setMainIndicator(true);

    axios({
      method: 'post',
      url: `${serverUrl}/userscreens/saveroutinebyuser`,
      data: auxObject
    })
    .then(function (response) {
        //console.log('routine',response.data.resp.insertId);
        setMainIndicator(false);
        setShowAlert({
          show: true,
          type: 'good',
          action: 'close', 
          message: 'La rutina fue guardada satisfactoriamente', 
          title: 'Rutina guardada con éxito', 
          iconAlert: 'save',
          nextScreen: 'MyGymTrainer'
        });

    })
    .catch(function (error) {
        //console.log('error axios',error);
        setMainIndicator(false);
        if(error.request._response.slice(0,17) === 'Failed to connect')
        {

          setShowAlert({
            show: true,
            type: 'error',
            action: 'close', 
            message: 'Verifica tu conexión a internet o notifica al equipo de GymRoom sobre el problema', 
            title: 'No se pudo conectar con el servidor', 
            iconAlert: 'wifi',
            nextScreen: 'MyGymTrainer'
          });
        }
      });

  }
 


  return (
    <View style={{flex: 1, position: 'relative'}}>
      <TopBar navigation={navigation} title={categorie} returnButton={true} />
        <ScrollView style={{flex:1}}>
          <View style={styles.containerScrollView}>
            <View style={styles.containerRoutineName}>
              <Text style={styles.routineName}>Nombre de la rutina</Text>
              <TextInput 
                style={styles.routineNameTextInput}
                onChangeText={(text) => setNameRoutine(text)}
              />
            </View>
            {
                exercises.map((exercise, indexCategorie) => {

                  //let categorieUpperCase = categorie[0].toUpperCase() + categorie.slice(1,categorie.length - 1);
                  return(
                    <View key={indexCategorie} style={styles.optionsCard}>
                      <View style={styles.containerFlexRow}>
                        <Text style={styles.titleOption}>{exercise.name}</Text>
                          <CheckBox
                            disabled={false}
                            value={exercise.selected}
                            onValueChange={() => setCheckBoxValue(exercise.selected, indexCategorie)}
                            tintColors={{ true: '#00aa00', false: 'black' }}
                            tintColor="000"
                            onFillColor="0b0"
                          />
                      </View>

                      <View style={styles.blueLine}></View>
                      
                      {
                        exercise.selected ? 
                        (
                          <View>
                            <Text style={styles.textSubtitles}>Repeticiones</Text>
                            <View style={styles.repetitionsInput}>
                              <TextInput 
                                style={{color: Colors.MainBlue}}
                                placeholder="0"
                                keyboardType="numeric"
                                placeholderTextColor='#999'
                                onChangeText={ (text) => setValuesInputsExercise(text, 'repetitions', indexCategorie) }
                              />
                            </View>

                            <Text style={styles.textSubtitles}>Tiempo</Text>
                            <View style={styles.containerFlexRow}>
                              <Text>Minutos</Text>
                              <View style={styles.timeInput}>
                                <TextInput 
                                  style={{color: Colors.MainBlue}}
                                  placeholder="0"
                                  keyboardType="numeric"
                                  placeholderTextColor='#999'
                                  onChangeText={ (text) => setValuesInputsExercise(text, 'minutes', indexCategorie) }
                                />
                              </View>
                              <Text>Segundos</Text>
                              <View style={styles.timeInput}>
                                <TextInput 
                                  style={{color: Colors.MainBlue}}
                                  placeholder="0"
                                  keyboardType="numeric"
                                  placeholderTextColor='#999'
                                  onChangeText={ (text) => setValuesInputsExercise(text, 'seconds', indexCategorie) }
                                />
                              </View>
                            </View>
                          </View>
                        )
                        :
                        (
                          <>
                          </>
                        )
                      }

                    </View>
                  )
                })
              }
            </View>
        </ScrollView>
        <View style={styles.containerButtonSave}>
          <TouchableOpacity
            onPress={saveRoutine}
            style={styles.buttonSaveRoutine}
          >
              <Text style={styles.textButtonSave}>Guardar Rutina</Text>
          </TouchableOpacity>
        </View>
      <BottomBar navigation={navigation}/>
      {
                    mainIndicator ? 
                    (
                      <View style={styles.grayContainer}>
                        <View style={styles.containerIndicator}>
                          <ActivityIndicator
                            size={80}
                            color={Colors.MainBlue}
                            style={styles.activityIndicator}
                          />
                        </View>
                      </View>
                    )
                    :
                    (
                      <>
                      </>
                    )
                  }
                  {
                    showAlert.show ? 
                    (
                      <AlertComponent 
                        navigation={navigation} 
                        type={showAlert.type}  
                        action={showAlert.action} 
                        message={showAlert.message} 
                        title={showAlert.title} 
                        iconAlert={showAlert.iconAlert}
                        closeFunction={setShowAlert}
                        stateVariable={showAlert}
                        nextScreen={showAlert.nextScreen}
                      />
                    )
                    :
                    (
                      <>
                      </>
                    )
                  }
    </View>
  );
};

const styles = StyleSheet.create({
  containerScrollView:{
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },

  
  grayContainer:{
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#00000099',

  },
    containerIndicator:{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      backgroundColor: '#fff',
      width: '70%',
      height: '50%',
      top: '25%',
      left: '15%',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,

    },
  
  routineName:{
    fontSize: 18,
    color: Colors.MainBlue,
    textAlign: 'center',
    marginVertical: 10
  },
  containerRoutineName:{

  },
  routineNameTextInput:{
    backgroundColor: '#fff',
    width: Dimensions.get('window').width * 0.9,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: Colors.MainBlue,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    color: Colors.MainBlue
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

  //hide options
  repetitionsInput:{
    width: 50,
    borderColor: '#999',
    //borderLeftWidth: 1,
    //borderRightWidth: 1,
    //borderTopWidth: 1,
    //borderBottomWidth: 1,
    fontSize: 18,
    color: Colors.MainBlue
  },
  textSubtitles:{
    color: Colors.MainBlue,
    fontSize: 16
  },

  containerButtonSave:{
    display: 'flex',
    justifyContent:'center',
    alignItems: 'center',
    padding: 10
  },
  buttonSaveRoutine:{
    backgroundColor: Colors.Orange,
    padding: 10
  },
  textButtonSave: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18
  },

});

