import React, {useState} from 'react';
import {
 View,
 Text,
 TouchableOpacity,
 StyleSheet
} from 'react-native';


export default function SafeButton(){

 const [safe,setSafe]=useState(false);


 return(

 <View>

 <TouchableOpacity
 style={[
 styles.button,
 safe && styles.safeActive
 ]}
 onPress={()=>setSafe(true)}
 >

 <Text style={styles.text}>
 {
 safe 
 ? "✓ You are marked SAFE"
 : "I AM SAFE"
 }
 </Text>

 </TouchableOpacity>


 {
 safe &&
 <Text style={styles.status}>
 Emergency contacts notified
 </Text>
 }

 </View>

 );

}


const styles=StyleSheet.create({

button:{
 backgroundColor:'#DC2626',
 padding:18,
 borderRadius:16,
 alignItems:'center',
 marginVertical:15
},


safeActive:{
 backgroundColor:'#059669'
},


text:{
 color:'#fff',
 fontSize:16,
 fontWeight:'900'
},


status:{
 color:'#10B981',
 textAlign:'center',
 marginTop:5
}

});