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
  Dimensions,
} from 'react-native';

import moment from 'moment';

import axios from 'axios';

import TopBar from '../shared/TopBar';
//yarn add react-native-awesome-alerts
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';

import SideBarUser from '../shared/SideBarUser';
import BottomBarUser from '../shared/BottomBarUser';

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

    const weekdays = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

    const onDateChange = (date) => {
      console.log('date', date._i);
      setSelectedStartDate(date);
    }

    const screenWidth = Dimensions.get("window").width;

    useEffect(() => {
        
        getWorkByMuscle();
        
    }, []);


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
        console.log('data', dataChartPercentageTemplate);
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
        console.log('data', dataChartPercentageTemplate);
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

      const databar2 = {
        labels: ["Test1"],
        legend: ["L1", "L2", "L3"],
        data: [
          [60, 60, 60]
        ],
        barColors: ["#dfe4ea", "#ced6e0", "#a4b0be"]
      };

      const chartConfigBar2 = {
        backgroundGradientFrom: "#f00",
        backgroundGradientFromOpacity: 0.4,
        backgroundGradientTo: "#0f0",
        backgroundGradientToOpacity: 0.8,
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
        strokeWidth: 5, // optional, default 3
        barPercentage: 0.6,
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

  return (
    <>
      <TopBar navigation={navigation} title={`Estadisticas`} returnButton={true} />
        <ScrollView>
            <View style={styles.mainContainer}>
                {
                    workMuscle.length > 0 ?
                    (
                        <>
                          <View>
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
                          <PieChart
                              data={dataChartPercentage}
                              width={screenWidth}
                              height={230}
                              chartConfig={chartConfig}
                              accessor={"population"}
                              backgroundColor={"transparent"}
                              paddingLeft={"15"}
                              center={[0, 0]}
                              absolute
                          />
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
                          <StackedBarChart
                              //style={graphStyle}
                              data={databar2}
                              width={screenWidth}
                              height={220}
                              chartConfig={chartConfigBar2}
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
    </>
  );
};

const styles = StyleSheet.create({
    mainContainer:{
        flex: 1
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
