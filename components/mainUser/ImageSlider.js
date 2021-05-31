import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
} from 'react-native';


const ImageSlider = ({stopImageSlider}) => {

    const [carrusel, setCarrusel] = useState(1);

    setTimeout(() => {
      if(!stopImageSlider)
      {
        if(carrusel === 5)
        {
          setCarrusel(1);
        }
        else{
          setCarrusel(carrusel + 1);
        }
      }
    }, 2000);

    //Attention: Do not use overflow: 'hidden';, in iOS all of the shadows disappear by this property.

  return (
    <>
        <View style={styles.containerSlider}>
            <View style={styles.containerImage}>
                {(() => {
                    switch (carrusel) {
                        case 1:
                        return(
                            <Image style={styles.imageSlider} 
                                   source={ require('../../assets/img/1.jpg')} />
                        );
                        case 2:
                        return(
                            <Image style={styles.imageSlider}
                                   source={ require('../../assets/img/2.jpg')} />
                        );
                        case 3:
                        return(
                            <Image style={styles.imageSlider}
                                   source={ require('../../assets/img/3.jpg')} />
                        );
                        case 4:
                        return(
                            <Image style={styles.imageSlider}
                                   source={ require('../../assets/img/4.jpg')} />
                        );
                        case 5:
                        return(
                            <Image style={styles.imageSlider}
                                   source={ require('../../assets/img/5.jpg')} />
                        );                                                     
                        default:
                        break;
                    } 
                })()}
            </View>
        </View>       

    </>
  );
};

const styles = StyleSheet.create({
  containerSlider:{
    height: 150,
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal:  25,
    marginBottom: 25
  },
  containerImage:{
    height: '100%',
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden', 
  },
  imageSlider:{
    height: '100%',
    width: '100%',
  }
});

export default ImageSlider;