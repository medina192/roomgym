import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';



import {Picker} from '@react-native-picker/picker';

import axios from 'axios';

import { useDispatch, useSelector } from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Button, Paragraph, Dialog, Portal } from 'react-native-paper';

import TopBar from '../../shared/TopBar';

import { createDrawerNavigator } from '@react-navigation/drawer';

import SideBarTrainer from '../../shared/SideBarTrainer';
import BottomBar from '../../shared/BottomBarUser';

import Colors  from '../../../colors/colors';

import { urlServer } from '../../../services/urlServer';

import AlertComponent from '../../shared/AlertComponent';

import PickerText from '../../shared/Picker';

const Drawer = createDrawerNavigator();


export default function CreateRoutines() {


  return (
    <>
      <Drawer.Navigator drawerContent={(props) => <SideBarTrainer {...props} />}>
        <Drawer.Screen name="CreateRoutines" component={CreateRoutinesScreen}/>
      </Drawer.Navigator>
    </>
  );
}



const CreateRoutinesScreen = ({navigation}) => {


  const serverUrl = urlServer.url;

  const dispatch = useDispatch();
  const subRoutine = useSelector(state => state.subRoutine);
  const idRelation = useSelector(state => state.idRelation);
  const user = useSelector(state => state.T_user);


  const [mainIndicator, setMainIndicator] = useState(true);
  const [routinesCreated, setRoutinesCreated] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [showListSavedRoutines, setShowListSavedRoutines] = useState(false);
  const [routinesSaved, setRoutinesSaved] = useState([]);


  const [visible, setVisible] = useState(false);
  const [nameExists, setNameExists] = useState(false);
  const [nameExerciseExists, setNameExerciseExists] = useState(false);
  const [visibleRoutines, setVisibleRoutines] = useState(false);
  const [visibleTime, setVisibleTime] = useState(false);
  const [state, setstate] = useState(false);

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
    getSavedRoutines();
  }, []);



  const addNewRoutine = () => {
    const template = {
      name: '',
      state: 4,   // 1 normal ---- 2 see more ----- 3 edit
      //description: '',
      tipo: '',
      exercises: []
    }
    const a = {
      name: '',
      repetitions: '',
      time_minutes: '',
      time_seconds: ''
    }
    setRoutinesCreated([...routinesCreated, template]);
  }

  const disscardRoutine = (index) => {

    routinesCreated.splice(index,1);
    setRoutinesCreated(routinesCreated);
    setstate(!state);
  }


  const saveRoutine = (index) => {


    if(routinesCreated[index].name != '')
    {
      if(routinesCreated[index].exercises.length > 0)
      {
        let allExercisesGood = false;
        const auxExercises = routinesCreated[index].exercises;
        for(let i = 0; i < auxExercises.length; i++ )
        {
          if(auxExercises[i].name != '' )
          {
            if(auxExercises[i].repetitions != '' && auxExercises[i].repetitions != '0' )
            {
              if(auxExercises[i].time_minutes != '' && auxExercises[i].time_seconds != '')
              {
                const minutes = Number(auxExercises[i].time_minutes);
                const seconds = Number(auxExercises[i].time_seconds);
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
            setShowAlert({
              show: true,
              type: 'error',
              action: 'close', 
              message: 'Debes asignar un nombre al ejercicio', 
              title: 'El ejercicio no tiene nombre', 
              iconAlert: 'close',
              nextScreen: 'MyGymTrainer'
            });
            return;
          }
        }
      }
      else{
        setShowAlert({
          show: true,
          type: 'error',
          action: 'close', 
          message: 'Debes crear al menos un ejercicio', 
          title: 'No hay ejercicios', 
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
        message: 'Debes asignar un nombre a la rutina', 
        title: 'La rutina no tiene nombre', 
        iconAlert: 'wifi',
        nextScreen: 'MyGymTrainer'
      });
      return;
    }
    //console.log('rty', routinesCreated[index]);
    if(routinesCreated[index].tipo == '') routinesCreated[index].tipo = 'brazo';
    saveRoutineDatabase(routinesCreated, index);
  }


  const saveRoutineDatabase = (routineObject, index) => {

    setMainIndicator(true);

    const routinesString = JSON.stringify(routineObject[index].exercises);

    const auxObject = {
      ejercicios: routinesString,
      idUsuario: user.idUsuario,
      id_relacion_entrenador_usuario: user.id_relacion_entrenador_usuario,
      tipo: routineObject[index].tipo,
      nombre: routineObject[index].name
    };                  


    axios({
      method: 'post',
      url: `${serverUrl}/relations/saveroutinebytrainer`,
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

        getSavedRoutines();
        routineObject[index].state = 1;
        routineObject[index].idRutinas = response.data.resp.insertId;
        setRoutinesCreated(routineObject);
        setstate(!state);
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
  const editRoutine = (index) => {
    routinesCreated[index].state = 3;
    setRoutinesCreated(routinesCreated);
    setstate(!state);
  }
  


  const setValuesInputsRoutine = (text, index, type, inputType) => {

      switch (inputType) {
        case 'name':
            routinesCreated[index].name = text;
          break;
        case 'description':
            routinesCreated[index].description = text;
          break;
        default:
          break;
      }
      setRoutinesCreated(routinesCreated);
      setstate(!state);
  }




  const setValuesInputsExercise = (text, index, indexExercise, type, inputType) => {

      switch (inputType) {
        case 'name':
            routinesCreated[index].exercises[indexExercise].name = text;
          break;
          case 'description':
            routinesCreated[index].exercises[indexExercise].description = text;
          break;
        case 'repetitions':
            routinesCreated[index].exercises[indexExercise].repetitions = text;
          break;
        case 'minutes':
            routinesCreated[index].exercises[indexExercise].time_minutes = text;
          break;
        case 'seconds':
            routinesCreated[index].exercises[indexExercise].time_seconds = text;
          break;
        default:
          break;
      }
      setRoutinesCreated(routinesCreated);
      setstate(!state);
  }


  const addNewExercise = (index) => {

    const exercise = {
      name: '',
      description: '',
      repetitions: '',
      time_minutes: '',
      time_seconds: ''
    }
    const lengthExercises = routinesCreated[index].exercises.length;
    
    if(lengthExercises > 0)
    {
      routinesCreated[index].exercises.push(exercise);
    }
    else{
      routinesCreated[index].exercises[0] = exercise;
    }
    setRoutinesCreated(routinesCreated);
    setstate(!state);
  }



  const disscardExercise = (index, indexExercise) => {

    routinesCreated[index].exercises.splice(indexExercise,1);
    setRoutinesCreated(routinesCreated);
    setstate(!state);
  }


  const seeMore = (index) => {
    routinesCreated[index].state = 2;
    setRoutinesCreated(routinesCreated);
    setstate(!state);

  }

  const seeLess = (index) => {
    routinesCreated[index].state = 1;
    setRoutinesCreated(routinesCreated);
    setstate(!state);
  }

  const showSavedRoutine = () => {
    setShowListSavedRoutines(true);
  }

  const getSavedRoutines = () => {
    axios({
      method: 'get',
      url: `${serverUrl}/relations/getroutinesbytrainer/${user.idEntrenador}`,
    })
    .then(function (response) {
        console.log('saved',response.data);
        setMainIndicator(false);
        setRoutinesSaved(response.data.routines);
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
            message: 'Si ya tienes rutinas guardadas, no las podras usar', 
            title: 'Sin conexión a internet', 
            iconAlert: 'wifi',
            nextScreen: 'MyGymTrainer'
          });
        }
    });
  }




  const addSavedRoutine = (item) => {

    const {idRutinas, ...Routine} = item;


    const RoutineObject = JSON.parse(Routine.ejercicios);

    const template = {
      name: Routine.nombre,
      state: 5,   // 1 normal ---- 2 see more ----- 3 edit
      //description: '',
      tipo: Routine.tipo,
      exercises: RoutineObject
    }


    setRoutinesCreated([...routinesCreated, template]);
    setShowListSavedRoutines(false);

  }



  const updateRoutine = (index) => {
    //console.log('update', routinesCreated[index]);

    if(routinesCreated[index].name != '')
    {
      if(routinesCreated[index].exercises.length > 0)
      {

        const auxExercises = routinesCreated[index].exercises;
        for(let i = 0; i < auxExercises.length; i++ )
        {
          if(auxExercises[i].name != '' )
          {
            if(auxExercises[i].repetitions != '' && auxExercises[i].repetitions != '0' )
            {
              if(auxExercises[i].time_minutes != '' && auxExercises[i].time_seconds != '')
              {
                const minutes = Number(auxExercises[i].time_minutes);
                const seconds = Number(auxExercises[i].time_seconds);
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
            setShowAlert({
              show: true,
              type: 'error',
              action: 'close', 
              message: 'Debes asignar un nombre al ejercicio', 
              title: 'El ejercicio no tiene nombre', 
              iconAlert: 'close',
              nextScreen: 'MyGymTrainer'
            });
            return;
          }
        }
      }
      else{
        setShowAlert({
          show: true,
          type: 'error',
          action: 'close', 
          message: 'Debes crear al menos un ejercicio', 
          title: 'No hay ejercicios', 
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
        message: 'Debes asignar un nombre a la rutina', 
        title: 'La rutina no tiene nombre', 
        iconAlert: 'close',
        nextScreen: 'MyGymTrainer'
      });
      return;
    }


    //saveRoutineDatabase(routinesCreated, index);

    const routinesString = JSON.stringify(routinesCreated[index].exercises);

    const auxObject = {
      ejercicios: routinesString,
      idRutinas: routinesCreated[index].idRutinas,
      idUsuario: user.idUsuario,
      id_relacion_entrenador_usuario: user.id_relacion_entrenador_usuario,
      tipo: routinesCreated[index].tipo,
      nombre: routinesCreated[index].name
    };        
    
    setMainIndicator(true);

    axios({
      method: 'put',
      url: `${serverUrl}/relations/updateroutinebytrainer/${routinesCreated[index].idRutinas}`,
      data: auxObject
    })
    .then(function (response) {
        //console.log('routine',response.data.resp);
        setMainIndicator(false);
        setShowAlert({
          show: true,
          type: 'good',
          action: 'close', 
          message: 'La rutina fue actualizada satisfactoriamente', 
          title: 'Rutina actualizada con éxito', 
          iconAlert: 'save',
          nextScreen: 'MyGymTrainer'
        });
        getSavedRoutines();
        const exercisesObject = JSON.parse(auxObject.ejercicios);
        routinesCreated[index].state = 1;
        routinesCreated[index].exercises = exercisesObject;
        setRoutinesCreated(routinesCreated);
        setstate(!state);
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
            message: 'Si ya tienes rutinas guardadas, no las podras usar', 
            title: 'Sin conexión a internet', 
            iconAlert: 'wifi',
            nextScreen: 'MyGymTrainer'
          });
        }
    });

  }

  const onViewableItemsChanged = ({
    viewableItems, changed
  }) => {
    console.log('vie', viewableItems, ' j ', changed);
    console.log('asd');
    console.log('asd');
  };

  const viewabilityConfigCallbackPairs = useRef([
    { onViewableItemsChanged },
  ]);

  const viewabilityConfig1 = {
    itemVisiblePercentThreshold: 50
  };

  const viewabilityConfig = useRef([{viewabilityConfig1}]);


  const returnButton = () => {
    setShowListSavedRoutines(false);
  }

  const addTypeNewRoutine = (type, index) => {
    
    routinesCreated[index].tipo = type;
    setRoutinesCreated(routinesCreated);
    setstate(!state);
    
  }

  const categories = ['Brazo', 'Pierna', 'Espalda', 'Pecho', 'Hombro'];
  
  return (
    <View style={styles.mainContainer}>
      <TopBar navigation={navigation} title={'Crear Rutinas'} returnButton={true} />
        <View style={styles.containerScrollView}>
          <ScrollView>
            <View style={styles.containerCardsRoutines}>
              {
                routinesCreated.length > 0 ?
                (
                  routinesCreated.map((routine, index) => {

                    if(routine.state == 1)  // normal view
                    {
                      return(
                        <View key={index} style={styles.cardRoutine}>
                          <Text style={styles.textRoutineName}>{routine.name}</Text>
                          <View style={styles.containerSeeMoreButton}>
                            <TouchableOpacity style={styles.editButton}
                              onPress={() => editRoutine(index)}>
                              <Icon name="edit" size={24} style={styles.iconEditButton} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.seeMoreButton} 
                              onPress={() => seeMore(index)}>
                              <Text style={styles.textSeeMoreButton}>Ver más</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )
                    }
                    else if( routine.state == 2) // see more
                    {
                      return(
                        <View key={index} style={styles.cardRoutine}>
                          <Text style={styles.textRoutineName}>{routine.name}</Text>
                          <Text style={styles.textRoutineName}>{routine.description}</Text>
                          <View style={styles.containerSeeMoreButton}>
                            <TouchableOpacity style={styles.editButton}
                              onPress={() => editRoutine(index)}>
                              <Icon name="edit" size={24} style={styles.iconEditButton} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.seeMoreButton} 
                              onPress={() => seeLess(index)}
                              >
                              <Text style={styles.textSeeMoreButton}>Ver menos</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )
                    }//end else 2
                    else if( routine.state == 3){ // edit
                      return(
                        <View key={index} style={styles.cardRoutine}>
                          <TextInput style={styles.inputNameRoutine}
                            placeholder="Nombre Rutina"
                            defaultValue={routine.name}
                            placeholderTextColor='#999'
                            onChangeText={ (text) => setValuesInputsRoutine(text, index, 'routine', 'name') }
                          />
                          <Text style={styles.textTypePicker}>Tipo</Text>
                                        <View style={styles.containerPicker}>
                                          
                                          <Picker
                                            selectedValue={routine.tipo}
                                            onValueChange={(itemValue, itemIndex) =>
                                              addTypeNewRoutine(itemValue, index)
                                            }>
                                            <Picker.Item label="Brazo" value="Brazo" />
                                            <Picker.Item label="Pierna" value="Pierna" />
                                            <Picker.Item label="Espalda" value="Espalda" />
                                            <Picker.Item label="Pecho" value="Pecho" />
                                            <Picker.Item label="Hombro" value="Hombro" />
                                          </Picker>
                                        </View>
                            {
                              /*
                                                        <TextInput style={styles.inputDescriptionRoutine}
                            placeholder="Descripción"
                            defaultValue={routine.description}
                            multiline={true}
                            onChangeText={ (text) => setValuesInputsRoutine(text, index, 'routine', 'description') }
                          />
                              */
                            }
                          {
                              routine.exercises.length > 0 ?
                              (
                                routine.exercises.map((exercise, indexExercise) => {
                                
                                  return(
                                    <View key={indexExercise} style={styles.containerExerciseCard}>
                                      <View>
                                        <View>
                                            <TextInput style={styles.inputNameExercise}
                                              placeholder="Nombre Ejercicio"
                                              defaultValue={exercise.name}
                                              placeholderTextColor='#999'
                                              onChangeText={ (text) => setValuesInputsExercise(text, index, indexExercise, 'exercise', 'name')}
                                            />
                                        </View>

                                            <View>
                                                <TextInput style={styles.inputNameExercise}
                                                  placeholder="Descripción Ejercicio"
                                                  defaultValue={exercise.description}
                                                  onChangeText={ (text) => setValuesInputsExercise(text, index, indexExercise, 'exercise', 'description')}
                                                />
                                            </View>

                                        <View style={styles.containerTimeRepetitionsInputs}>
                                          <View style={styles.containerRepetitionsInput}>
                                            <Text>Repeticiones</Text>
                                            <TextInput style={styles.inputRepetitionsExercise}
                                              placeholder="0"
                                              defaultValue={exercise.repetitions}
                                              keyboardType="numeric"
                                              placeholderTextColor='#999'
                                              onChangeText={ (text) => setValuesInputsExercise(text, index, indexExercise, 'exercise', 'repetitions') }
                                            />
                                          </View>
                                          <View style={styles.containerInputsTime}>
                                            <View style={styles.containerInputTime}>
                                              <Text>Minutos</Text>
                                              <TextInput style={styles.inputTimeExercise}
                                                placeholder="0"
                                                keyboardType="numeric"
                                                placeholderTextColor='#999'
                                                defaultValue={exercise.time_minutes}
                                                onChangeText={ (text) => setValuesInputsExercise(text, index, indexExercise, 'exercise', 'minutes') }
                                              />
                                            </View>
                                            <View style={styles.containerInputTime}>
                                              <Text>Segundos</Text>
                                              <TextInput style={styles.inputTimeExercise}
                                                placeholder="0"
                                                keyboardType="numeric"
                                                placeholderTextColor='#999'
                                                defaultValue={exercise.time_seconds}
                                                onChangeText={ (text) => setValuesInputsExercise(text, index, indexExercise, 'exercise','seconds') }
                                              />
                                            </View>
                                          </View>
                                        </View>
                                      </View>
                                      <View style={styles.containerRemoveDisscardExercise}>
                                        <TouchableOpacity style={styles.removeDisscardExerciseButton}
                                          onPress={() => disscardExercise(index, indexExercise)}>
                                          <Icon name="remove" size={24} style={styles.iconRemoveExerciseButton} color="#fff" />
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  )// return
                                })// map
                              ) // ? ternary
                              :
                              (
                                <Text>No hay ejercicios</Text>
                              )
                            } 
                          <TouchableOpacity style={styles.containerIconAddExerciseButton}
                            onPress={() => addNewExercise(index)}>
                            <Icon name="plus" size={24} style={styles.iconAddExerciseButton} color="#fff" />
                          </TouchableOpacity>
                          {
                            /*
                                                        <TouchableOpacity style={styles.buttonDiscardRoutine}
                              onPress={() => disscardRoutine(index)}>
                              <Text style={styles.textButtons}>Descartar</Text>
                            </TouchableOpacity>
                            */
                          }
                          <View style={styles.containerButtons}>
                            <TouchableOpacity style={styles.buttonSaveRoutine} 
                              onPress={() => seeLess(index)}
                              >
                              <Text style={styles.textButtons}>Descartar Edición</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonSaveRoutine}
                              onPress={() => updateRoutine(index)}>
                              <Text style={styles.textButtons}>Actualizar</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        
                      )
                    } // end else
                    else if( routine.state == 5){ // edit
                      return(
                        <View key={index} style={styles.cardRoutine}>
                          <TextInput style={styles.inputNameRoutine}
                            placeholder="Nombre Rutina"
                            defaultValue={routine.name}
                            placeholderTextColor='#999'
                            onChangeText={ (text) => setValuesInputsRoutine(text, index, 'routine', 'name') }
                          />
                          <Text style={styles.textTypePicker}>Tipo</Text>
                                        <View style={styles.containerPicker}>
                                          
                                          <Picker
                                            selectedValue={routine.tipo}
                                            onValueChange={(itemValue, itemIndex) =>
                                              addTypeNewRoutine(itemValue, index)
                                            }>
                                            <Picker.Item label="Brazo" value="Brazo" />
                                            <Picker.Item label="Pierna" value="Pierna" />
                                            <Picker.Item label="Espalda" value="Espalda" />
                                            <Picker.Item label="Pecho" value="Pecho" />
                                            <Picker.Item label="Hombro" value="Hombro" />
                                          </Picker>
                                        </View>
                            {
                              /*
                                                        <TextInput style={styles.inputDescriptionRoutine}
                            placeholder="Descripción"
                            defaultValue={routine.description}
                            multiline={true}
                            onChangeText={ (text) => setValuesInputsRoutine(text, index, 'routine', 'description') }
                          />
                              */
                            }
                          {
                              routine.exercises.length > 0 ?
                              (
                                routine.exercises.map((exercise, indexExercise) => {
                                  console.log('exer', exercise);
                                  return(
                                    <View key={indexExercise} style={styles.containerExerciseCard}>
                                      <View>
                                        <View>
                                            <TextInput style={styles.inputNameExercise}
                                              placeholder="Nombre Ejercicio"
                                              defaultValue={exercise.name}
                                              placeholderTextColor='#999'
                                              onChangeText={ (text) => setValuesInputsExercise(text, index, indexExercise, 'exercise', 'name')}
                                            />
                                        </View>

                                            <View>
                                                <TextInput style={styles.inputNameExercise}
                                                  placeholder="Descripción Ejercicio"
                                                  placeholderTextColor={Colors.MainBlue}
                                                  defaultValue={exercise.description}
                                                  onChangeText={ (text) => setValuesInputsExercise(text, index, indexExercise, 'exercise', 'description')}
                                                />
                                            </View>

                                        <View style={styles.containerTimeRepetitionsInputs}>
                                          <View style={styles.containerRepetitionsInput}>
                                            <Text>Repeticiones</Text>
                                            <TextInput style={styles.inputRepetitionsExercise}
                                              placeholder="0"
                                              defaultValue={exercise.repetitions}
                                              keyboardType="numeric"
                                              placeholderTextColor='#999'
                                              onChangeText={ (text) => setValuesInputsExercise(text, index, indexExercise, 'exercise', 'repetitions') }
                                            />
                                          </View>
                                          <View style={styles.containerInputsTime}>
                                            <View style={styles.containerInputTime}>
                                              <Text>Minutos</Text>
                                              <TextInput style={styles.inputTimeExercise}
                                                placeholder="0"
                                                keyboardType="numeric"
                                                defaultValue={exercise.time_minutes}
                                                placeholderTextColor='#999'
                                                onChangeText={ (text) => setValuesInputsExercise(text, index, indexExercise, 'exercise', 'minutes') }
                                              />
                                            </View>
                                            <View style={styles.containerInputTime}>
                                              <Text>Segundos</Text>
                                              <TextInput style={styles.inputTimeExercise}
                                                placeholder="0"
                                                keyboardType="numeric"
                                                placeholderTextColor='#999'
                                                defaultValue={exercise.time_seconds}
                                                onChangeText={ (text) => setValuesInputsExercise(text, index, indexExercise, 'exercise','seconds') }
                                              />
                                            </View>
                                          </View>
                                        </View>
                                      </View>
                                      <View style={styles.containerRemoveDisscardExercise}>
                                        <TouchableOpacity style={styles.removeDisscardExerciseButton}
                                          onPress={() => disscardExercise(index, indexExercise)}>
                                          <Icon name="remove" size={24} style={styles.iconRemoveExerciseButton} color="#fff" />
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  )// return
                                })// map
                              ) // ? ternary
                              :
                              (
                                <Text>No hay ejercicios</Text>
                              )
                            } 
                          <TouchableOpacity style={styles.containerIconAddExerciseButton}
                            onPress={() => addNewExercise(index)}>
                            <Icon name="plus" size={24} style={styles.iconAddExerciseButton} color="#fff" />
                          </TouchableOpacity>
                          {
                            /*
                                                        <TouchableOpacity style={styles.buttonDiscardRoutine}
                              onPress={() => disscardRoutine(index)}>
                              <Text style={styles.textButtons}>Descartar</Text>
                            </TouchableOpacity>
                            */
                          }
                          <View style={styles.containerButtons}>
                            <TouchableOpacity style={styles.buttonDiscardRoutine}
                              onPress={() => disscardRoutine(index)}>
                              <Text style={styles.textButtons}>Descartar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonSaveRoutine}
                              onPress={() => saveRoutine(index)}>
                              <Text style={styles.textButtons}>Guardar</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        
                      )
                    } // end else
                    else{
                      return(
                        <View key={index} style={styles.cardRoutine}>
                          <TextInput style={styles.inputNameRoutine}
                            placeholder="Nombre Rutina"
                            placeholderTextColor='#999'
                            onChangeText={ (text) => setValuesInputsRoutine(text, index, 'routine', 'name') }
                          />
                          <Text style={styles.textTypePicker}>Tipo</Text>
                          <View style={styles.containerPicker}>
                            
                            <Picker
                              selectedValue={selectedLanguage}
                              onValueChange={(itemValue, itemIndex) =>
                                addTypeNewRoutine(itemValue, index)
                              }>
                              <Picker.Item label="Brazo" value="Brazo" />
                              <Picker.Item label="Pierna" value="Pierna" />
                              <Picker.Item label="Espalda" value="Espalda" />
                              <Picker.Item label="Pecho" value="Pecho" />
                              <Picker.Item label="Hombro" value="Hombro" />
                            </Picker>
                          </View>
                          {
                            /*
                                                      <TextInput style={styles.inputDescriptionRoutine}
                            placeholder="Descripción"
                            multiline={true}
                            onChangeText={ (text) => setValuesInputsRoutine(text, index, 'routine', 'description') }
                          />
                            */
                          }
                    {
                      routine.exercises.length > 0 ?
                      (
                        routine.exercises.map((exercise, indexExercise) => {
                        
                          return(
                            <View key={indexExercise} style={styles.containerExerciseCard}>
                              <View>
                                <View>
                                    <TextInput style={styles.inputNameExercise}
                                      placeholder="Nombre Ejercicio"
                                      placeholderTextColor='#999'
                                      onChangeText={ (text) => setValuesInputsExercise(text, index, indexExercise, 'exercise', 'name')}
                                    />
                                </View>
                                <View>
                                    <TextInput style={styles.inputNameExercise}
                                      placeholder="Descripción Ejercicio"
                                      placeholderTextColor='#999'
                                      onChangeText={ (text) => setValuesInputsExercise(text, index, indexExercise, 'exercise', 'description')}
                                    />
                                </View>

                                <View style={styles.containerTimeRepetitionsInputs}>
                                  <View style={styles.containerRepetitionsInput}>
                                    <Text>Repeticiones</Text>
                                    <TextInput style={styles.inputRepetitionsExercise}
                                      placeholder="0"
                                      keyboardType="numeric"
                                      placeholderTextColor='#999'
                                      onChangeText={ (text) => setValuesInputsExercise(text, index, indexExercise, 'exercise', 'repetitions') }
                                    />
                                  </View>
                                  <View style={styles.containerInputsTime}>
                                    <View style={styles.containerInputTime}>
                                      <Text>Minutos</Text>
                                      <TextInput style={styles.inputTimeExercise}
                                        placeholder="0"
                                        keyboardType="numeric"
                                        placeholderTextColor='#999'
                                        onChangeText={ (text) => setValuesInputsExercise(text, index, indexExercise, 'exercise', 'minutes') }
                                      />
                                    </View>
                                    <View style={styles.containerInputTime}>
                                      <Text>Segundos</Text>
                                      <TextInput style={styles.inputTimeExercise}
                                        placeholder="0"
                                        keyboardType="numeric"
                                        placeholderTextColor='#999'
                                        onChangeText={ (text) => setValuesInputsExercise(text, index, indexExercise, 'exercise','seconds') }
                                      />
                                    </View>
                                  </View>
                                </View>
                              </View>
                              <View style={styles.containerRemoveDisscardExercise}>
                                <TouchableOpacity style={styles.removeDisscardExerciseButton}
                                  onPress={() => disscardExercise(index, indexExercise)}>
                                  <Icon name="remove" size={24} style={styles.iconRemoveExerciseButton} color="#fff" />
                                </TouchableOpacity>
                              </View>
                            </View>
                          )// return
                        })// map
                      ) // ? ternary
                      :
                      (
                        <Text>No hay ejercicios</Text>
                      )
                    } 
                    <TouchableOpacity style={styles.containerIconAddExerciseButton}
                      onPress={() => addNewExercise(index)}>
                      <Icon name="plus" size={24} style={styles.iconAddExerciseButton} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.containerButtons}>
                      <TouchableOpacity style={styles.buttonDiscardRoutine}
                        onPress={() => disscardRoutine(index)}>
                        <Text style={styles.textButtons}>Descartar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonSaveRoutine}
                        onPress={() => saveRoutine(index)}>
                        <Text style={styles.textButtons}>Guardar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                      )// return
                    }  //else
                  })
                )
                :
                (
                  <Text style={styles.textAuxMessage}>No hay rutinas, crea una¡</Text>
                )
              }
            </View>
          </ScrollView>

        </View>

        <View style={styles.containerFloatingButtons}>
          <View style={styles.containerCenterFloatingButtons}>
            <View style={styles.containerFloatButtonAddRoutine}>
                <TouchableOpacity  style={styles.floatButtonAddRoutine}
                  onPress={addNewRoutine}>
                    <Icon name="plus" size={24} style={styles.iconAddRoutineButton} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.containerFloatButtonAddRoutine}>
                <TouchableOpacity  style={styles.floatButtonAddRoutine}
                  onPress={showSavedRoutine}>
                    <Icon name="search" size={24} style={styles.iconAddRoutineButton} color="#fff" />
                </TouchableOpacity>
            </View>
          </View>
        </View>

      <BottomBar navigation={navigation}/>
      {
        (() => {
          if(showListSavedRoutines)
          {
            
              if(routinesSaved.length > 0)
              {

                return(
                  <View style={styles.containerAbsolute}>
                      <View style={styles.containerSavedRoutines}>
                        <ScrollView style={{flex: 1}}>
                          {
                            routinesSaved.map((item, index) => {
                              return(
                                <View key={index} style={styles.containerItemRoutine}>
                                  <Text style={styles.textNameRoutineSved}>{item.nombre}</Text>
                                  <View style={styles.containerButtonAddSavedRoutine}>
                                    <TouchableOpacity style={styles.buttonAddSavedRoutine}
                                      onPress={() => addSavedRoutine(item)}>
                                      <Icon name="plus" size={24} style={styles.iconAddSavedRoutine} color="#fff" />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.containerSeparatorLine}>
                                  </View>
                                </View>
                              )
                            })
                          }
                          </ScrollView>
                          <View>
                            <TouchableOpacity style={styles.returnButton}
                              onPress={returnButton}>
                              <Icon name="reply" size={24} style={styles.iconReturn} color="#fff" />
                            </TouchableOpacity>
                          </View>
                      </View>                  
                  </View>
                )
              }
              else{
                return(
                  <View style={styles.containerAbsolute}>
                    <View style={styles.containerSavedRoutines}>
                        <Text style={styles.textWithoutRoutines}>No tienes rutinas guardadas, regresa y crea una</Text>
                        <Icon name="frown-o" size={40} style={styles.iconLink} color="#999" />
                        <View>
                          <TouchableOpacity style={styles.returnButton}
                            onPress={returnButton}>
                            <Icon name="reply" size={24} style={styles.iconReturn} color="#fff" />
                          </TouchableOpacity>
                        </View>
                    </View>
                  </View>
                )
              }
            
          }
          /*
          else{
            return(
              <View style={styles.containerAbsolute}>
                <View style={styles.containerSavedRoutines}>
                    <Text>No tienes rutinas guardadas</Text>
                    <View>
                      <TouchableOpacity style={styles.returnButton}
                        onPress={returnButton}>
                        <Icon name="reply" size={24} style={styles.iconReturn} color="#fff" />
                      </TouchableOpacity>
                    </View>
                </View>
              </View>
            )
          }*/
        })()
      }
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

  grayContainer:{
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#00000099',
    elevation: 40
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
      elevation: 40
    },

  mainContainer:{
    position: 'relative',
    flex: 1,
  },
    containerScrollView:{
        flex: 1
      },

      // absolute
      containerAbsolute:{
        position: 'absolute',
        backgroundColor: '#000000af',
        width: '100%',
        height: '100%',
        //top: (Dimensions.get('window').height / 2) -120,
        top: 0,
        bottom: 0,
        //left: (Dimensions.get('window').width / 2) - 50,
        left: 0,
        right: 0,
        justifyContent: 'center', 
        alignItems: 'center',
      },
      containerSavedRoutines:{
        position: 'absolute',
        width: '100%',
        backgroundColor: '#fff',
        width: '70%',
        height: '50%',
        top: '25%',
        left: '15%',
        justifyContent: 'center', 
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        marginVertical: 10,
      },
      containerItemRoutine:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        maxWidth: '90%',
        padding: 10,
        marginHorizontal: '5%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 5,
        
        elevation: 5,
        borderTopLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        marginVertical: 5
      },
      textNameRoutineSved:{
        fontSize: 20,
        color:'#000',
        width: '100%'
      },
      containerButtonAddSavedRoutine:{
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%'
      },
      buttonAddSavedRoutine:{
        backgroundColor: Colors.MainBlue,
        width: 35,
        height: 35,
        borderTopLeftRadius: 50,
        borderBottomRightRadius: 50,
        borderTopRightRadius: 50,
        borderBottomLeftRadius: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      },
      iconAddSavedRoutine:{
        fontSize: 25,
        color: '#fff'
      },
      containerSeparatorLine:{
        height: 2,
        backgroundColor: Colors.MainBlue,
        width: '100%'
      },
      separatorLine:{

      },

      // floating buttons
      containerFloatingButtons:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      },
      containerCenterFloatingButtons:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '60%',
      },
      textWithoutRoutines:{
        fontSize: 16,
        color: '#999',
        marginBottom: 10
      },
      returnButton:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.MainBlue,
        borderTopLeftRadius: 50,
        borderBottomRightRadius: 50,
        borderTopRightRadius: 50,
        borderBottomLeftRadius: 50,
        width: 40,
        height: 40,
        marginTop: 20
      },
      iconReturn:{
        color: '#fff'
      },

      // card Routine
      containerCardsRoutines:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      cardRoutine:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.MainBlue,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        marginVertical: 10,
        width: '90%'
      },
      textRoutineName:{
        fontSize: 20,
        color: '#fff'
      },
      containerExerciseCard:{
        backgroundColor: '#fff',
        
        paddingVertical: 10,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        marginVertical: 10,
        paddingHorizontal: 5,
        display:'flex',
        width: '90%'
      },
      textNameExercise:{
        color: '#fff',
        fontSize :18
      },
      containerButtons:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
      },
      buttonSaveRoutine:{
        backgroundColor: '#fff',
        marginHorizontal: 5,
        padding: 5,
        borderTopLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
      },
      textButtons:{
        fontSize: 18,
        color: Colors.MainBlue,
        fontWeight: '700',
      },
      buttonDiscardRoutine:{
        backgroundColor: '#fff',
        marginHorizontal: 5,
        padding: 5,
        borderTopLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
      },
      containerIconAddExerciseButton:{
        backgroundColor: '#fff',
        borderTopLeftRadius: 50,
        borderBottomRightRadius: 50,
        borderTopRightRadius: 50,
        borderBottomLeftRadius: 50,
        width: 40,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10
      },
      iconAddExerciseButton:{
        color: Colors.MainBlue,
        fontSize: 28
      },
      containerPicker:{
        backgroundColor: '#fff',
        width: '80%',
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        marginVertical: 10,
      },
      textTypePicker:{
        fontSize: 18,
        color: '#fff'
      },

      // normal
      containerSeeMoreButton:{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 10
      },
      seeMoreButton:{
        padding: 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
      },
      textSeeMoreButton:{
        fontSize: 16,
        fontWeight: '700',
        color: Colors.MainBlue
      },

      // edit normal
      editButton:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginRight: 8,
        padding: 3,
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        width: 35,
        height: 35
      },
      iconEditButton: {
        color: Colors.MainBlue
      },

      // edit new
      inputNameExercise:{
        color: Colors.MainBlue,
      },
      inputNameRoutine:{
        width: '80%',
        color: Colors.MainBlue,
        backgroundColor: '#fff',
        borderTopLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        marginVertical: 7,
        borderColor: Colors.MainBlue,
        borderBottomWidth: 2,
      },
      inputDescriptionRoutine:{
        width: '80%',
        color: Colors.MainBlue,
        backgroundColor: '#fff',
        borderTopLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        marginVertical: 7
      },

      textAuxMessage:{
        backgroundColor: "#999",
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginVertical: 10,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
      },
      containerRepetitionsInput:{
        
      },
      containerTimeRepetitionsInputs:{
        display:'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
      },  
      containerInputsTime:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      containerInputTime:{
        marginLeft: 10
      },
      inputRepetitionsExercise:{
        backgroundColor:'#fff',
        width: '100%',
        color: Colors.MainBlue,
      },
      inputTimeExercise:{
        backgroundColor: '#fff',
        width: '100%',
        color: Colors.MainBlue,
      },
      containerRemoveDisscardExercise:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%'
      },
      removeDisscardExerciseButton:{
        color: '#fff',
        marginRight: 10
      },
      iconRemoveExerciseButton:{
        color: Colors.MainBlue,
        fontSize: 26
      },


      // button add routine routine
      containerFloatButtonAddRoutine: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
      },
      floatButtonAddRoutine:{
        backgroundColor: Colors.MainBlue,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderTopLeftRadius: 100,
        borderBottomRightRadius: 100,
        borderTopRightRadius: 100,
        borderBottomLeftRadius: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 5,
        
        elevation: 14,
      },
      iconAddRoutineButton:{
        fontSize: 22
      },
      
      containerTouchableImage:{
        height: 150,
        width: '100%',
        backgroundColor: '#fff',
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 25,
        marginBottom: 10
      },


      containerInput:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
     
      containerIconInput:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%',
        backgroundColor: '#fff',
        paddingVertical: 0,
        marginVertical: 10,
        //borderColor: '#FB5012',
        borderColor: Colors.MainBlue,
        borderBottomWidth: 2,
        paddingHorizontal: 0
      },
      inputRegister:{
        backgroundColor: '#fff',
        width: '97%',
        fontSize: 18,
        marginLeft: 5,
        color: Colors.MainBlue,
        //borderRightWidth: 1,
        //borderLeftWidth: 1,
        //borderTopWidth: 1,
        //borderBottomRightRadius: 3,
        //borderBottomLeftRadius: 3,
        //borderTopLeftRadius: 3,
        //borderTopRightRadius: 3
      },

     //inputs
     containerInputs:{
      paddingHorizontal: 25,
      marginBottom: 20,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-end'
    },
    containerNumberRoutineInput:{
      
    },

    textNumberRoutine:{
      fontSize: 16
    },
    inputNumberRoutine:{
      backgroundColor: '#fff',
      fontSize: 15,
      width: '60%',
      color: Colors.MainBlue,
    },
    textTime:{
      fontSize: 16
    },  


      // save button
      containerSaveButton:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        backgroundColor: 'transparent'
      },
      saveButton:{
        width: '70%',
        backgroundColor: Colors.Orange,
        paddingVertical: 10
      },
      textSaveButton:{
        fontSize: 18,
        color: '#fff',
        fontWeight: '700',
        textAlign: 'center'
      }
});
