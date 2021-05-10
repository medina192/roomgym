import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';

import moment from 'moment';

import axios from 'axios';

import TopBar from '../shared/TopBar';
//yarn add react-native-awesome-alerts
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';

import SideBarUser from '../shared/SideBarUser';
import BottomBarUser from '../shared/BottomBarUser';

import InputsMeasures from './statistics/InputsMeasures';

import Icon from 'react-native-vector-icons/FontAwesome';

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";

  import CalendarPicker from 'react-native-calendar-picker';

  import { urlServer } from '../../services/urlServer';
  import  Colors  from '../../colors/colors';

const Drawer = createDrawerNavigator();

export default function Statistics() {
  return (
    <>
      <Drawer.Navigator drawerContent={(props) => <SideBarUser {...props} />}>
        <Drawer.Screen name="Statistics" component={StatisticsScreen} />
      </Drawer.Navigator>
    </>
  );
}



const StatisticsScreen = ({navigation}) => {

    
    const serverUrl = urlServer.url;

    const dispatch = useDispatch();

    const userInformation = useSelector(state => state.user);

    const [workMuscle, setWorkMuscle] = useState([]);
    const [dataChartPercentage, setDataChartPercentage] = useState([]);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [showWeeklyProgress, setShowWeeklyProgress] = useState(false);
    const [weeklyProgress, setWeeklyProgress] = useState([]);
    const [measuresLoaded, setMeasuresLoaded] = useState(false);
    const [editMeasures, setEditMeasures] = useState(false);
    const [showComparison, setShowComparison] = useState(false);
    const [measures, setMeasures] = useState({
      medidaBrazo: '',
      medidaPierna: '',
      medidaCintura: '',
      peso: '',
    });


    const setMeasuresValues = (value, type) => {

      switch (type) {
        case 'brazo':
          setMeasures({
            ...measures,
            medidaBrazo: value
          })
        break;
        case 'pierna':
          setMeasures({
            ...measures,
            medidaPierna: value
          })
        break;
        case 'cintura':
          setMeasures({
            ...measures,
            medidaCintura: value
          })
        break;
        case 'peso':
          setMeasures({
            ...measures,
            peso: value
          })
        break;
        default:
          break;
      }
    }

    const weekdays = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']


    const onDateChange = (date) => {
      console.log('date', date._i);
      setSelectedStartDate(date);
    }

    const screenWidth = Dimensions.get("window").width;

    useEffect(() => {
        
        getWorkByMuscle();
        getMeasures();
        
    }, []);


    const CheckIfisSunday = () => {
      const newDate = new Date();
      const ISODate = new Date(newDate.toISOString().slice(0,10));
      const year = ISODate.getFullYear();
      const month = ISODate.getMonth();
      const day = ISODate.getDate();
      const lastDate = new Date(year, month, day+1);

      if(newDate.toString().slice(0,3) === 'Sun')
      {
        return true;
      }
      else{
        return false;
      }
      
    }

    const getWorkByMuscle = async() => {
        try {
            const resp = await axios({
                method: 'get',
                url: `${serverUrl}/userscreens/getworkbymuscle/${userInformation.idusuario}`
              });

              const workMuscleString = resp.data.resp;
              if(workMuscleString)
              {
                const workByMuscleObject = JSON.parse(workMuscleString);
                
                const arrayWorkByMuscle = workByMuscleObject.exercisesRecord;

                getExercisesPercentage(arrayWorkByMuscle);
                
                setWorkMuscle(arrayWorkByMuscle);          
                
              }
              else{

              }
        } catch (error) {
            console.log('error', error);
        }
    }

    



    const getExercisesPercentage = (arrayWorkByMuscle) => {
      const uniqueTypes = getTypesExercises(arrayWorkByMuscle);
      const [typeTimeArray, sum] = getSumTimeExercise(uniqueTypes, arrayWorkByMuscle);


      const colorsChartPercentages = ['#244EAB', '#FF7F11', '#69A2B0', '#FFFC31', '#03312E'];
      const legendFontColor = "#7F7F7F";
      const legendFontSize = 14;
      const dataChartPercentageTemplate = [];

      if(typeTimeArray.length > 5)
      {
        
        for(let i = 0; i < typeTimeArray.length; i++)
        {
          let auxNum = 100 * typeTimeArray[i].time / sum;
          let num = parseFloat(auxNum.toFixed(2));
          
          dataChartPercentageTemplate[i] = {
            name: '% '+typeTimeArray[i].type,
            population: num,
            color: colorsChartPercentages[i],
            legendFontColor,
            legendFontSize,
          }
        }
        
      }
      else{
        for(let i = 0; i < typeTimeArray.length; i++)
        {
          let auxNum = 100 * typeTimeArray[i].time / sum;
          let num = parseFloat(auxNum.toFixed(2));
          dataChartPercentageTemplate[i] = {
            name: '% '+typeTimeArray[i].type,
            population: num,
            color: colorsChartPercentages[i],
            legendFontColor,
            legendFontSize,
          }
        }
        
      }
      setDataChartPercentage(dataChartPercentageTemplate);


    }


    const getTypesExercises = (workByMuscleObject) => {

      // get the yoes
      const arrayTypes = [];
      for( let i = 0; i < workByMuscleObject.length; i++)
      {
        arrayTypes[i] = workByMuscleObject[i].type;
      }


      //get the unique types
      const unique = (value, index, self) => {

        return self.indexOf(value) === index
      }
         
      const uniqueTypes = arrayTypes.filter(unique);

      return uniqueTypes;

    }

    const getSumTimeExercise = (uniqueTypes, arrayWorkByMuscle) => {


      let arraySumTime = new Array(uniqueTypes.length).fill(0);
      let objectTypeTime = [];

      for(let i = 0; i < uniqueTypes.length; i++)
      {
        for(let j = 0; j < arrayWorkByMuscle.length; j++)
        {
          if(uniqueTypes[i] === arrayWorkByMuscle[j].type)
          {
            arraySumTime[i] += arrayWorkByMuscle[j].timeInSeconds;
          }   
        }
        objectTypeTime[i] = {type: uniqueTypes[i], time: arraySumTime[i]};
      }
      
      let sum = arraySumTime.reduce((a,b) => {
        return a + b;
      }, 0);
            
      return [objectTypeTime, sum];
    }



    //  begin functions to weekly progress _____________________________________________



    const getMeasures = async() => {

      try {
        const resp = await axios({
          method: 'get',
          url: `${serverUrl}/userscreens/getmeasures/${userInformation.idusuario}`
        });
        setMeasuresLoaded(true);
        const measuresString = resp.data.resp[0].registro_peso;  

        if(measuresString && measuresString !== 'null')
        {

          const sunday = CheckIfisSunday();

          const measuresArray = JSON.parse(measuresString);

          if(measuresArray == null)
          {
            setWeeklyProgress([]);
            return;
          }
          setWeeklyProgress(measuresArray);
        } 
        else{

          const sunday = CheckIfisSunday();

        }
      } catch (error) {
        console.log('error get measures', error);
      }
    }

    
    const showWeeklyStadistics = () => {
      
      setShowWeeklyProgress(true);
    }

    const getDateFormat = () => {
      let date = new Date();
      let newDate = date.toISOString();
      
      return newDate.slice(0,10);
    }

    const saveFirstMeasures = async () => {

      if(measures.medidaBrazo == '' || measures.medidaPierna == '' || measures.medidaCintura == '' || measures.peso == '')
      {
        console.log('launch alert empty fields');
      }
      else{
        
        const todayDate = getDateFormat();

        const templateMeasureValues = [{      
          date: todayDate,
          medidaBrazo: measures.medidaBrazo,
          medidaPierna: measures.medidaPierna,
          medidaCintura: measures.medidaCintura,
          peso: measures.peso
        }];
  
        const bodyString = JSON.stringify(templateMeasureValues);
  
        const template = {
          bodyString
        }
  
        const respUpdate = await axios({
          method: 'put',
          url: `${serverUrl}/userscreens/updatemeasures/${userInformation.idusuario}`,
          data: template
        });

        setWeeklyProgress(templateMeasureValues);
      }
    }


    const saveSecondMeasuresByFirstTime = async() => {

      try {
        const resp = await axios({
          method: 'get',
          url: `${serverUrl}/userscreens/getmeasures/${userInformation.idusuario}`
        });

        const measuresString = resp.data.resp[0].registro_peso;  
        const measuresArray = JSON.parse(measuresString);

        const todayDate = getDateFormat();

        const templateMeasureValues = {      
          date: todayDate,
          medidaBrazo: measures.medidaBrazo,
          medidaPierna: measures.medidaPierna,
          medidaCintura: measures.medidaCintura,
          peso: measures.peso
        };

        measuresArray[1] = templateMeasureValues;

        const bodyString = JSON.stringify(measuresArray);

        const template = {
          bodyString
        }

        const respUpdate = await axios({
          method: 'put',
          url: `${serverUrl}/userscreens/updatemeasures/${userInformation.idusuario}`,
          data: template
        });


        setWeeklyProgress(measuresArray);
        setEditMeasures(false);
        setShowComparison(true);
        
      } catch (error) {
        console.log('error get measures', error);
      }
    }


    const saveSecondMeasures = async() => {

      const auxOldMeasures = weeklyProgress[0];
      const auxCurrentMeasures = weeklyProgress[1];
      try {
        const resp = await axios({
          method: 'get',
          url: `${serverUrl}/userscreens/getmeasures/${userInformation.idusuario}`
        });

        const measuresString = resp.data.resp[0].registro_peso;  
        const measuresArray = JSON.parse(measuresString);

        const todayDate = getDateFormat();

        const templateMeasureValues = {      
          date: todayDate,
          medidaBrazo: measures.medidaBrazo,
          medidaPierna: measures.medidaPierna,
          medidaCintura: measures.medidaCintura,
          peso: measures.peso
        };

        measuresArray[0] = auxCurrentMeasures;
        measuresArray[1] = templateMeasureValues;

        const bodyString = JSON.stringify(measuresArray);

        const template = {
          bodyString
        }

        const respUpdate = await axios({
          method: 'put',
          url: `${serverUrl}/userscreens/updatemeasures/${userInformation.idusuario}`,
          data: template
        });


        setWeeklyProgress(measuresArray);
        setEditMeasures(false);
        setShowComparison(true);
        
      } catch (error) {
        console.log('error get measures', error);
      }
    }


    const updateMeasure = () => {
      setEditMeasures(true);
    }


    const saveWeeklyProgress = async() => {

      try {
        const resp = await axios({
          method: 'get',
          url: `${serverUrl}/userscreens/getmeasures/${userInformation.idusuario}`
        });

        const measuresString = resp.data.resp[0].registro_peso;
        if(measuresString && measuresString !== 'null')
        {

          const sunday = CheckIfisSunday();

          const measuresArray = JSON.parse(measuresString);

          const todayDate = getDateFormat();

          const templateMeasureValues = {      
            date: todayDate,
            medidaBrazo: measures.medidaBrazo,
            medidaPierna: measures.medidaPierna,
            medidaCintura: measures.medidaCintura,
            peso: measures.peso,
            state: 'saved'
          };

          measuresArray.push(templateMeasureValues);

          const bodyString = JSON.stringify(measuresArray);

          const template = {
            bodyString
          }

          const respUpdate = await axios({
            method: 'put',
            url: `${serverUrl}/userscreens/updatemeasures/${userInformation.idusuario}`,
            data: template
          });

        } 
        else{
          

          
          const sunday = CheckIfisSunday();

          const todayDate = getDateFormat();

          const templateMeasureValues = [{      
            date: todayDate,
            medidaBrazo: measures.medidaBrazo,
            medidaPierna: measures.medidaPierna,
            medidaCintura: measures.medidaCintura,
            peso: measures.peso,
            state: 'saved'
          }];

          const bodyString = JSON.stringify(templateMeasureValues);

          const template = {
            bodyString
          }

          const respUpdate = await axios({
            method: 'put',
            url: `${serverUrl}/userscreens/updatemeasures/${userInformation.idusuario}`,
            data: template
          });


          
        }

      } catch (error) {
        console.log('error u', error); 
      }
    }


    //  end functions to weekly progress _____________________________________________


    // do comparison begin_________________________________________________________

    const doComparison = () => {

      console.log('asdf', weeklyProgress);
      const oldMeasures = weeklyProgress[0];
      const currentMeasures = weeklyProgress[1];

      let messages = {
        armMessage: '',
        armClass: '',
        armIcon: '',
        armIconClass: '',

        legMessage: '',
        legClass: '',
        legIcon: '',
        legIconClass: '',

        waistMessage: '',
        waistClass: '',
        waistIcon: '',
        waistIconClass: '',

        weightMessage: '',
        weightClass: '',
        weightIcon: '',
        weightIconClass: '',
      }


      if(parseFloat(oldMeasures.medidaBrazo) > parseFloat(currentMeasures.medidaBrazo))
      {
        messages.armMessage = 'Invierte más tiempo al ejercicio, puedes mejorar¡';
        messages.armClass = styles.textRed;
        messages.armIcon = 'times';
        messages.armIconClass = styles.iconRed;
      }
      else if(parseFloat(oldMeasures.medidaBrazo) < parseFloat(currentMeasures.medidaBrazo))
      {
        messages.armMessage = 'Bien hecho, sigue así¡';
        messages.armClass = styles.textGreen;
        messages.armIcon = 'check';
        messages.armIconClass = styles.iconGreen;
      }
      else{
        messages.armMessage = 'Lo hiciste bien, pero puedes mejorar¡';
        messages.armClass = styles.textYellow;
        messages.armIcon = 'warning';
        messages.armIconClass = styles.iconYellow;
      }



      if(parseFloat(oldMeasures.medidaPierna) > parseFloat(currentMeasures.medidaPierna))
      {
        messages.legMessage    = 'Invierte más tiempo al ejercicio, puedes mejorar¡';
        messages.legClass = styles.textRed;
        messages.legIcon = 'times';
        messages.legIconClass = styles.iconRed;
      }
      else if(parseFloat(oldMeasures.medidaPierna) < parseFloat(currentMeasures.medidaPierna))
      {
        messages.legMessage = 'Bien hecho, sigue así¡';
        messages.legClass = styles.textGreen;
        messages.legIcon = 'check';
        messages.legIconClass = styles.iconGreen;
      }
      else{
        messages.legMessage = 'Lo hiciste bien, pero puedes mejorar¡';
        messages.legClass = styles.textYellow;
        messages.legIcon = 'warning';
        messages.legIconClass = styles.iconYellow;
      }



      if(parseFloat(oldMeasures.medidaCintura) > parseFloat(currentMeasures.medidaCintura))
      {
        messages.waistMessage = 'Bien hecho, sigue así¡';
        messages.waistClass = styles.textGreen;
        messages.waistIcon = 'check';
        messages.waistIconClass = styles.iconGreen;
      }
      else if(parseFloat(oldMeasures.medidaCintura) < parseFloat(currentMeasures.medidaCintura))
      {
        messages.waistMessage = 'Invierte más tiempo al ejercicio, puedes mejorar¡';
        messages.waistClass = styles.textRed;
        messages.waistIcon = 'times';
        messages.waistIconClass = styles.iconRed;
      }
      else{
        messages.waistMessage = 'Lo hiciste bien, pero puedes mejorar¡';
        messages.waistClass = styles.textYellow;
        messages.waistIcon = 'warning';
        messages.waistIconClass = styles.iconYellow;
      }



      if(parseFloat(oldMeasures.peso) > parseFloat(currentMeasures.peso))
      {
        messages.weightMessage = 'Bien hecho, sigue así¡';
        messages.weightClass = styles.textGreen;
        messages.weightIcon = 'check';
        messages.weightIconClass = styles.iconGreen;
      }
      else if(parseFloat(oldMeasures.peso) < parseFloat(currentMeasures.peso))
      {
        messages.weightMessage = 'Mejora tu dieta, puedes mejorar¡';
        messages.weightClass = styles.textRed;
        messages.weightIcon  = 'times';
        messages.weightIconClass = styles.iconRed;
      }
      else{
        messages.weightMessage = 'Lo hiciste bien, pero puedes mejorar¡';
        messages.weightClass= styles.textYellow;
        messages.weightIcon  = 'warning';
        messages.weightIconClass = styles.iconYellow;
      }

      return messages;

    }
    // do comparison end ______________________________________________________


    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
      };


    const data = [
        {
          name: "Seoul",
          population: 25,
          color: "rgba(131, 167, 234, 1)",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        },
        {
          name: "Toronto",
          population: 50,
          color: "#F00",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        },
        {
          name: "Beijing",
          population: 100,
          color: "#0f0",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        },
      ];


      const dataBar = {
        labels: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"],
        datasets: [
          {
            data: [1,2,3,4,5,6,7]
          }
        ]
      };

      const chartConfigbar = {
        backgroundGradientFrom: "#f00",
        backgroundGradientFromOpacity: 0.4,
        backgroundGradientTo: "#0f0",
        backgroundGradientToOpacity: 0.8,
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
        strokeWidth: 5, // optional, default 3
        barPercentage: 0.1,
        useShadowColorFromDataset: false // optional
      };


      
      const startDate = selectedStartDate ? selectedStartDate.toString() : '';

      //let today = moment();
      //let day = today.clone().startOf('month');
      let day = moment("2021-05-05");
      let customDatesStyles = [];
      //while(day.add(1, 'day').isSame(today, 'month')) {
        //console.log('day clone', day.clone());
        customDatesStyles.push({
          date: day,
          
          // Random colors
          style: {backgroundColor: '#0f0'},
          textStyle: {color: 'black'}, // sets the font color
          containerStyle: [], // extra styling for day container
          allowDisabled: true, // allow custom style to apply to disabled dates
        });
      //}

      const resetToNull = async () => {
        const template = {
          bodyString: null
        }

        const respUpdate = await axios({
          method: 'put',
          url: `${serverUrl}/userscreens/updatemeasures/${userInformation.idusuario}`,
          data: template
        });
      }

  return (
    <>
      <TopBar navigation={navigation} title={`Estadisticas`} returnButton={true} />
        <ScrollView>
            <View style={styles.mainContainer}>

            <View style={styles.containerWeeklyProgress}>
                            <TouchableOpacity style={styles.buttonWeeklyProgress} onPress={showWeeklyStadistics}>
                              <Text style={styles.textWeeklyProgress}>Progreso semanal</Text>
                            </TouchableOpacity>
                          </View>
                          {
                            showWeeklyProgress ? 
                            (

                              
                              <View style={styles.mainContainerWeeklyProgress}>



                                <View style={styles.containerCards}>

                                {
                                  measuresLoaded ? 
                                  (
                                    weeklyProgress[0] ? 
                                    (
                                      <View style={styles.containerMeasures}>
                                        <Text>Fecha</Text>
                                        <Text>{weeklyProgress[0].date}</Text>
                                        <Text>Medida brazo</Text>
                                        <Text>{weeklyProgress[0].medidaBrazo}</Text>
                                        <Text>Medida Pierna</Text>
                                        <Text>{weeklyProgress[0].medidaPierna}</Text>
                                        <Text>Medida cintura</Text>
                                        <Text>{weeklyProgress[0].medidaCintura}</Text>
                                        <Text>Peso</Text>
                                        <Text>{weeklyProgress[0].peso}</Text>
                                      </View>

                                    )
                                    :
                                    (
                                      <View style={styles.containerCardMeasures}>
                                        <View style={styles.containerTitleCardMeasures}>
                                          <Text style={styles.textCardMeasures}>Registra tu primer peso</Text>
                                        </View>
                                        <View>
                                          <InputsMeasures 
                                            setMeasuresValues={setMeasuresValues}  
                                          />
                                        </View>
                                        <View style={styles.containerButtonClose}>
                                          <TouchableOpacity style={styles.buttonClose}
                                            onPress={saveFirstMeasures}>
                                            <Text style={styles.textButtonClose}>Guardar</Text>
                                          </TouchableOpacity>
                                        </View>
                                      </View>
                                    )
                                  )
                                  :
                                  (
                                    <>
                                    </>
                                  )
     
                                }


                                {
                                  weeklyProgress[0] && measuresLoaded ? 
                                  (
                                    <View>
                                    {
                                      weeklyProgress[1] ? 
                                      (
                                        <View>
                                          {
                                            editMeasures ? 
                                            (
                                              <View style={styles.containerCardMeasures}>
                                                <View style={styles.containerTitleCardMeasures}>
                                                  <Text style={styles.textCardMeasures}>Actualiza tus primer medida</Text>
                                                </View>
                                                <View>
                                                  <InputsMeasures 
                                                    setMeasuresValues={setMeasuresValues}  
                                                  />
                                                </View>
                                                <View style={styles.containerButtonClose}>
                                                  <TouchableOpacity style={styles.buttonClose}
                                                    onPress={saveSecondMeasures}>
                                                    <Text style={styles.textButtonClose}>Guardar</Text>
                                                  </TouchableOpacity>
                                                </View>
                                              </View>
                                            )
                                            :
                                            (
                                              <View>
                                                <View style={styles.containerMeasures}>
                                                  <Text>Fecha</Text>
                                                  <Text>{weeklyProgress[1].date}</Text>
                                                  <Text>Medida brazo</Text>
                                                  <Text>{weeklyProgress[1].medidaBrazo}</Text>
                                                  <Text>Medida Pierna</Text>
                                                  <Text>{weeklyProgress[1].medidaPierna}</Text>
                                                  <Text>Medida cintura</Text>
                                                  <Text>{weeklyProgress[1].medidaCintura}</Text>
                                                  <Text>Peso</Text>
                                                  <Text>{weeklyProgress[1].peso}</Text>
                                                </View>
                                                <View style={styles.containerButtonClose}>
                                                  <TouchableOpacity 
                                                    style={styles.buttonClose}
                                                    onPress={() => setShowComparison(true)}>
                                                      <Text style={styles.textButtonClose}>Comparar</Text>
                                                  </TouchableOpacity>
                                                </View>
                                                <View style={styles.containerButtonClose}>
                                                  <TouchableOpacity style={styles.buttonClose}
                                                    onPress={updateMeasure}>
                                                    <Text style={styles.textButtonClose}>Actualizar</Text>
                                                  </TouchableOpacity>
                                                </View>
                                              </View>
                                            )
                                          }
                                        </View>
                                      )
                                      :
                                      (
                                        <View style={styles.containerCardMeasures}>
                                        <View style={styles.containerTitleCardMeasures}>
                                          <Text style={styles.textCardMeasures}>Actualiza tus medidas</Text>
                                        </View>
                                        <View>
                                          <InputsMeasures 
                                            setMeasuresValues={setMeasuresValues}  
                                          />
                                        </View>
                                        <View style={styles.containerButtonClose}>
                                          <TouchableOpacity style={styles.buttonClose}
                                            onPress={saveSecondMeasuresByFirstTime}>
                                            <Text style={styles.textButtonClose}>Guardar</Text>
                                          </TouchableOpacity>
                                        </View>
                                      </View>
                                      )

                                    }
                                    </View>
                                  )
                                  :
                                  (
                                    <Text></Text>
                                  )
                                }


                                  <View style={styles.containerButtonClose}>
                                    <TouchableOpacity style={styles.buttonClose}
                                      onPress={() => setShowWeeklyProgress(false)}>
                                      <Text style={styles.textButtonClose}>Cerrar</Text>
                                    </TouchableOpacity>
                                  </View>
                                  <TouchableOpacity 
                                    style={styles.buttonClose}
                                    onPress={resetToNull}>
                                      <Text style={styles.textButtonClose}>reset</Text>
                                  </TouchableOpacity>
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
                    workMuscle.length > 0 ?
                    (
                        <>

                          <View style={styles.containerCharts}>
                            <View style={styles.containerChart}>
                              <PieChart
                                  data={dataChartPercentage}
                                  width={screenWidth - (screenWidth*0.05)}
                                  height={250}
                                  chartConfig={chartConfig}
                                  accessor={"population"}
                                  backgroundColor={"transparent"}
                                  paddingLeft={"15"}
                                  center={[0, 0]}
                                  absolute
                              />
                            </View>
                            <CalendarPicker
                              weekdays={weekdays}
                              months={months}
                              startFromMonday={true}
                              customDatesStyles={customDatesStyles}
                              onDateChange={date => onDateChange(date)}
                            />
                          </View>
                          <View>
                            <Text>SELECTED DATE:{ startDate }</Text>
                          </View>

                          <BarChart
                              style={{padding: 10, marginRight: 20}}
                              data={dataBar}
                              width={screenWidth - 30}
                              height={220}
                              yAxisLabel=""
                              chartConfig={chartConfigbar}
                              verticalLabelRotation={30}
                              showBarTops={true}
                              fromZero={true}
                              showValuesOnTopOfBars={true}
                              withHorizontalLabels={false}
                              center={[5, 50]}
                              withInnerLines={false}
                          />
                        </>
                    )
                    :
                    (
                        <>
                          <View style={styles.containerMessage}>
                            <Text style={styles.textMessage}>Aun no tienes estadisticas, haz ejercicio para tenerlas¡</Text>
                          </View>
                        </>
                    )
                }
            </View>
        </ScrollView>
      <BottomBarUser />
      {
        showComparison ? 
        (
          <>
            {
              (
              () => {
                const dataMeasures = doComparison();
                console.log('messages', dataMeasures);
                let a = 'arrow-right';
                a = 'arrow-left';
                console.log('styles', styles.containerAbsolute);
                return (
                  <View style={styles.containerAbsolute}>
                    <View style={styles.containerSavedRoutines}>
                      <ScrollView style={{width: '100%', flex: 1}}>
                          <Text>Resumen de tu avance</Text>

                          <View style={styles.containerCardComparison}>
                            <Text>Medida Brazo</Text>
                            <View style={styles.containerComparisonMeasures}>
                              <View style={styles.containerFlexLeft}>
                                <Text>{weeklyProgress[0].medidaBrazo}</Text>
                                <Text>cm</Text>
                                <Icon name="arrow-right" size={24} style={styles.iconBottomBar} color="#a31" />
                                <Text>{weeklyProgress[1].medidaBrazo}</Text>
                                <Text>cm</Text>
                              </View>
                              <View style={styles.containerFlexRight}>
                                <Icon name={dataMeasures.armIcon} size={24} style={dataMeasures.armIconClass} color="#000" />
                              </View>
                            </View>
                            <Text style={dataMeasures.armClass}>{dataMeasures.armMessage}</Text>    
                          </View>


                          <View  style={styles.containerCardComparison}>
                            <Text>Medida Pierna</Text>
                            <View style={styles.containerComparisonMeasures}>
                              <View style={styles.containerFlexLeft}>
                                <Text>{weeklyProgress[0].medidaPierna}</Text>
                                <Text>cm</Text>
                                <Icon name="arrow-right" size={24} style={styles.iconBottomBar} color="#a31" />
                                <Text>{weeklyProgress[1].medidaPierna}</Text>
                                <Text>cm</Text>
                              </View>
                              <View style={styles.containerFlexRight}>
                                <Icon name={dataMeasures.legIcon} size={24} style={dataMeasures.legIconClass} color="#000" />
                              </View>
                            </View>
                            <Text style={dataMeasures.legClass}>{dataMeasures.legMessage}</Text>    
                          </View>

                          <View  style={styles.containerCardComparison}>
                            <Text>Medida Cintura</Text>
                            <View style={styles.containerComparisonMeasures}>
                              <View style={styles.containerFlexLeft}>
                                <Text>{weeklyProgress[0].medidaCintura}</Text>
                                <Text>cm</Text>
                                <Icon name="arrow-right" size={24} style={styles.iconBottomBar} color="#a31" />
                                <Text>{weeklyProgress[1].medidaCintura}</Text>
                                <Text>cm</Text>
                              </View>
                              <View style={styles.containerFlexRight}>
                                <Icon name={dataMeasures.waistIcon} size={24} style={dataMeasures.waistIconClass} color="#000" />
                              </View>
                            </View>
                            <Text style={dataMeasures.waistClass}>{dataMeasures.waistMessage}</Text>    
                          </View>

                          <View style={styles.containerCardComparison}>
                            <Text>Peso</Text>
                            <View style={styles.containerComparisonMeasures}>
                              <View style={styles.containerFlexLeft}>
                                <Text>{weeklyProgress[0].peso}</Text>
                                <Text>kg</Text>
                                <Icon name="arrow-right" size={24} style={styles.iconBottomBar} color="#a31" />
                                <Text>{weeklyProgress[1].peso}</Text>
                                <Text>kg</Text>
                              </View>
                              <View style={styles.containerFlexRight}>
                                <Icon name={dataMeasures.weightIcon} size={24} style={dataMeasures.weightIconClass} color="#000" />
                              </View>
                            </View>
                            <Text style={dataMeasures.weightClass}>{dataMeasures.weightMessage}</Text>    
                          </View>

                          <TouchableOpacity 
                            style={styles.buttonClose}
                            onPress={() => setShowComparison(false)}>
                              <Text style={styles.textButtonClose}>Cerrar</Text>
                          </TouchableOpacity>
                      </ScrollView>
                    </View>
                  </View>
                )
              }
              )()
            }
          </>
        )
        :
        (
          <>

          </>
        )
      }
    </>
  );
};

const styles = StyleSheet.create({
    mainContainer:{
        flex: 1,
        position: 'relative'
    },

    // absolute containers
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
        backgroundColor: '#fff',
        width: '80%',
        height: '70%',
        top: '15%',
        left: '10%',
        display: 'flex',
        flexDirection: 'column',
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
      containerCardComparison:{
        padding: 10,
        marginVertical: 6,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.41,
        shadowRadius: 5,
        
        elevation: 2   ,
      },  
      containerComparisonMeasures:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
      containerFlexLeft:{
        display: 'flex',
        flexDirection: 'row'
      },
      containerFlexRight:{

      },
      textGreen: {
        color: '#0b0',
        fontSize: 16
      },  
      textRed:{
        color: '#d00',
        fontSize: 16
      },
      textYellow:{
        color: '#ff0',
        fontSize: 16
      },  
      iconGreen: {
        color:'#0b0',
        fontSize: 28
      },
      iconRed: {
        color:'#d00',
        fontSize: 28
      },
      iconYellow: {
        color:'#ff0',
        fontSize: 28
      },


    // weekly progress
    containerNewMessage:{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10
    },
    newMessage:{
      backgroundColor: '#f00',
      padding: 10,
      color: '#fff',
      fontSize: 14,
      fontWeight: '700',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },
    containerWeeklyProgress:{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10
    },
    buttonWeeklyProgress:{
      backgroundColor: '#eee',
      padding: 10,
      width: '85%',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 7,
      },
      shadowOpacity: 0.41,
      shadowRadius: 5,
      
      elevation: 14,
    },
    textWeeklyProgress:{
      fontSize: 14,
      fontWeight: '700',
      color: '#000',
    },

    // list weekly progress
    mainContainerWeeklyProgress:{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,

    },
    containerCards:{
      width: '90%',
      paddingVertical: 20,
      paddingHorizontal: 10,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      backgroundColor: '#ddd'
    },
        // button close
        containerButtonClose:{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginVertical: 5
        },
        buttonClose:{
          backgroundColor: '#009',
          padding: 8
        },
        textButtonClose:{
          color: '#fff',
          fontSize: 15,
          fontWeight: '700',
          textAlign: 'center'
        },
        containerInputCm:{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end'
        },
        textAboveInput:{
          marginTop: 10,
          marginBottom: 2
        },
        textInputMeasures:{
          backgroundColor: '#fff',
          color: '#000',
          width: 60,
          height: 40,
          fontSize: 15,
          display: 'flex',
          justifyContent: 'flex-end'
        },
        textcm:{
          marginLeft: 10,
          fontSize: 17
        },  

    // card progress
    containerCardMeasures: {
      backgroundColor: '#ddd'
    },
    containerTitleCardMeasures: {
      backgroundColor: '#ddd'
    },  
    textCardMeasures: {
      fontSize: 14,
      
    },
    
    // measures
    containerMeasures:{
      marginVertical: 10,
      backgroundColor: '#eee'
    },

    //container charts
    containerCharts:{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    containerChart:{
      marginTop: 15,
      width: '98%',
      padding: 5,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      
    },


    // text if there is no statistics
    containerMessage:{
      padding: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    textMessage:{
      backgroundColor: Colors.MainBlue,
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
      padding: 10,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    }
});
