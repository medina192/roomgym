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



const InputsMeasures = ({setMeasuresValues}) => {

    return (
        <View>
            <Text style={styles.textAboveInput}>Medida brazo</Text>
            <View style={styles.containerInputCm}>
                <TextInput 
                    style={styles.textInputMeasures}
                    keyboardType="numeric"
                    maxLength={3}
                    onChangeText={ (text) => setMeasuresValues(text, 'brazo') }
                />
                <Text style={styles.textcm}>cm</Text>
            </View>

            <Text style={styles.textAboveInput}>Medida pierna</Text>
            <View style={styles.containerInputCm}>
                <TextInput 
                    style={styles.textInputMeasures}
                    keyboardType="numeric"
                    maxLength={3}
                    onChangeText={ (text) => setMeasuresValues(text, 'pierna') }
                />
                <Text style={styles.textcm}>cm</Text>
            </View>

            <Text style={styles.textAboveInput}>Medida cintura</Text>
                <View style={styles.containerInputCm}>
                    <TextInput 
                    style={styles.textInputMeasures}
                    keyboardType="numeric"
                    maxLength={3}
                    onChangeText={ (text) => setMeasuresValues(text, 'cintura') }
                />
                <Text style={styles.textcm}>cm</Text>
            </View>

            <Text style={styles.textAboveInput}>Peso</Text>
                <View style={styles.containerInputCm}>
                    <TextInput 
                        style={styles.textInputMeasures}
                        keyboardType="numeric"
                        maxLength={3}
                        onChangeText={ (text) => setMeasuresValues(text, 'peso') }
                    />
                    <Text style={styles.textcm}>kg</Text>
                </View>
        </View>
    )
}

export default InputsMeasures;

const styles = StyleSheet.create({
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

});
