// // import React from 'react';
// // import {
// // View,
// // Text,
// // StyleSheet
// // } from 'react-native';

// // import QRCode from 'react-native-qrcode-svg';



// // export default function HealthQRScreen(){


// // const emergencyData=
// // `
// // Name: Alex
// // Blood Type: O+
// // Allergy: None
// // Emergency Contact:
// // Family Member
// // `;


// // return(

// // <View style={styles.container}>


// // <Text style={styles.title}>
// // Emergency Health QR
// // </Text>


// // <QRCode
// // value={emergencyData}
// // size={220}
// // />


// // <Text style={styles.warning}>
// // Only share with trusted emergency responders
// // </Text>


// // </View>

// // )

// // }



// // const styles=StyleSheet.create({

// // container:{
// // flex:1,
// // backgroundColor:'#020617',
// // alignItems:'center',
// // paddingTop:70
// // },


// // title:{
// // color:'#fff',
// // fontSize:26,
// // fontWeight:'900',
// // marginBottom:40
// // },

// // warning:{
// // color:'#94A3B8',
// // marginTop:30,
// // textAlign:'center'
// // }

// // });      


// import React,{useState} from "react";

// import {
// View,
// Text,
// StyleSheet,
// TextInput,
// TouchableOpacity,
// ScrollView
// } from "react-native";

// import QRCode from "react-native-qrcode-svg";


// export default function HealthQRScreen(){


// const [generated,setGenerated]=useState(false);


// const [profile,setProfile]=useState({

// name:"",
// blood:"",
// allergy:"",
// condition:"",
// contact:""

// });



// function update(field,value){

// setProfile({

// ...profile,
// [field]:value

// });

// }



// const qrData=
// `
// EMERGENCY HEALTH PROFILE

// Name:
// ${profile.name}

// Blood Type:
// ${profile.blood}

// Allergies:
// ${profile.allergy}

// Medical Conditions:
// ${profile.condition}

// Emergency Contact:
// ${profile.contact}

// `;



// return(

// <ScrollView
// style={styles.container}
// >



// <Text style={styles.title}>
// Emergency Health ID
// </Text>


// <Text style={styles.subtitle}>
// Create a medical QR profile for emergency responders
// </Text>



// <TextInput

// style={styles.input}

// placeholder="Full Name"

// placeholderTextColor="#64748B"

// onChangeText={
// text=>update("name",text)
// }

// />



// <TextInput

// style={styles.input}

// placeholder="Blood Type (Example: O+)"

// placeholderTextColor="#64748B"

// onChangeText={
// text=>update("blood",text)
// }

// />



// <TextInput

// style={styles.input}

// placeholder="Allergies"

// placeholderTextColor="#64748B"

// onChangeText={
// text=>update("allergy",text)
// }

// />



// <TextInput

// style={styles.input}

// placeholder="Medical Conditions"

// placeholderTextColor="#64748B"

// onChangeText={
// text=>update("condition",text)
// }

// />



// <TextInput

// style={styles.input}

// placeholder="Emergency Contact"

// placeholderTextColor="#64748B"

// onChangeText={
// text=>update("contact",text)
// }

// />



// <TouchableOpacity

// style={styles.button}

// onPress={()=>setGenerated(true)}

// >


// <Text style={styles.buttonText}>
// Generate Emergency QR
// </Text>


// </TouchableOpacity>





// {
// generated &&

// <View style={styles.qrBox}>


// <QRCode

// value={qrData}

// size={220}

// />


// <Text style={styles.warning}>

// Show this QR only to emergency responders

// </Text>


// </View>

// }



// </ScrollView>

// )

// }



// const styles=StyleSheet.create({

// container:{
// flex:1,
// backgroundColor:"#020617",
// padding:20
// },


// title:{
// color:"#fff",
// fontSize:28,
// fontWeight:"900",
// marginTop:40
// },


// subtitle:{
// color:"#94A3B8",
// marginBottom:25
// },


// input:{
// backgroundColor:"#0F172A",
// color:"#fff",
// padding:15,
// borderRadius:14,
// marginBottom:12
// },


// button:{
// backgroundColor:"#2563EB",
// padding:16,
// borderRadius:14,
// alignItems:"center",
// marginTop:10
// },


// buttonText:{
// color:"#fff",
// fontWeight:"900"
// },


// qrBox:{
// alignItems:"center",
// marginTop:30
// },


// warning:{
// color:"#94A3B8",
// marginTop:20,
// textAlign:"center"
// }

// });


import React, {useState, useEffect} from "react";

import {
View,
Text,
StyleSheet,
TextInput,
TouchableOpacity,
ScrollView,
Alert
} from "react-native";

import QRCode from "react-native-qrcode-svg";

import AsyncStorage from "@react-native-async-storage/async-storage";


export default function HealthQRScreen(){


const [generated,setGenerated] = useState(false);


const [profile,setProfile] = useState({

healthId:"",
name:"",
dob:"",
blood:"",
allergy:"",
condition:"",
medication:"",
contact:"",
relationship:""

});



useEffect(()=>{

loadProfile();

},[]);



async function loadProfile(){

try{

const saved =
await AsyncStorage.getItem(
"emergency_health_profile"
);


if(saved){

setProfile(JSON.parse(saved));

}

}catch(error){

console.log(error);

}

}




function update(field,value){

setProfile({

...profile,
[field]:value

});

}




async function generateQR(){
    if(
  !profile.name.trim() ||
  !profile.blood.trim() ||
  !profile.allergy.trim() ||
  !profile.condition.trim() ||
  !profile.contact.trim()
){

Alert.alert(
"Missing Information",
"Please complete your name, blood type, allergies, medical conditions, and emergency contact before generating your Emergency Health ID."
);

return;

}

let updatedProfile = {
...profile
};


if(!updatedProfile.healthId){

updatedProfile.healthId =
"PW-" +
Math.floor(
100000 +
Math.random()*900000
);

}


setProfile(updatedProfile);


await AsyncStorage.setItem(

"emergency_health_profile",

JSON.stringify(updatedProfile)

);


setGenerated(true);


Alert.alert(
"Emergency Health ID Created",
"Your emergency profile is now ready."
);


}




const qrData =
JSON.stringify({

type:"Emergency Health ID",

healthId:profile.healthId,

name:profile.name,

dateOfBirth:profile.dob,

bloodType:profile.blood,

allergies:profile.allergy,

medicalConditions:
profile.condition,

medication:
profile.medication,

emergencyContact:
profile.contact,

relationship:
profile.relationship

});





return(

<ScrollView

style={styles.container}

contentContainerStyle={
styles.content
}

showsVerticalScrollIndicator={false}

>


<Text style={styles.title}>
Emergency Health ID
</Text>



<Text style={styles.subtitle}>

Create a medical profile that helps emergency responders identify you.

</Text>




<View style={styles.card}>


<Text style={styles.cardTitle}>
Personal Information
</Text>



<TextInput

style={styles.input}

placeholder="Full Name"

placeholderTextColor="#64748B"

value={profile.name}

onChangeText={
text=>update("name",text)
}

/>



<TextInput

style={styles.input}

placeholder="Date of Birth"

placeholderTextColor="#64748B"

value={profile.dob}

onChangeText={
text=>update("dob",text)
}

/>



<Text style={styles.cardTitle}>
Medical Information
</Text>



<TextInput

style={styles.input}

placeholder="Blood Type (Example: O+)"

placeholderTextColor="#64748B"

value={profile.blood}

onChangeText={
text=>update("blood",text)
}

/>




<TextInput

style={styles.input}

placeholder="Allergies"

placeholderTextColor="#64748B"

value={profile.allergy}

onChangeText={
text=>update("allergy",text)
}

/>




<TextInput

style={styles.input}

placeholder="Medical Conditions"

placeholderTextColor="#64748B"

value={profile.condition}

onChangeText={
text=>update("condition",text)
}

/>



<TextInput

style={styles.input}

placeholder="Medication"

placeholderTextColor="#64748B"

value={profile.medication}

onChangeText={
text=>update("medication",text)
}

/>




<Text style={styles.cardTitle}>
Emergency Contact
</Text>




<TextInput

style={styles.input}

placeholder="Contact Name + Number"

placeholderTextColor="#64748B"

value={profile.contact}

onChangeText={
text=>update("contact",text)
}

/>




<TextInput

style={styles.input}

placeholder="Relationship (Parent, Friend)"

placeholderTextColor="#64748B"

value={profile.relationship}

onChangeText={
text=>update("relationship",text)
}

/>



</View>




<TouchableOpacity

style={styles.button}

onPress={generateQR}

>


<Text style={styles.buttonText}>

Generate Emergency QR

</Text>


</TouchableOpacity>






{
profile.healthId !== "" &&

<View style={styles.idCard}>


<Text style={styles.idTitle}>
Your Health ID
</Text>


<Text style={styles.id}>
{profile.healthId}
</Text>


</View>

}





{
generated &&

<View style={styles.qrBox}>


<QRCode

value={qrData}

size={220}

/>



<Text style={styles.warning}>

Only share this QR with emergency responders.

</Text>


</View>

}



</ScrollView>

)

}






const styles = StyleSheet.create({


container:{

flex:1,

backgroundColor:"#020617"

},


content:{

padding:20,

paddingBottom:60

},



title:{

color:"#FFFFFF",

fontSize:30,

fontWeight:"900",

marginTop:40

},



subtitle:{

color:"#94A3B8",

marginTop:8,

marginBottom:20

},



card:{

backgroundColor:"#0F172A",

padding:18,

borderRadius:20

},



cardTitle:{

color:"#38BDF8",

fontWeight:"900",

fontSize:16,

marginBottom:12,

marginTop:10

},



input:{

backgroundColor:"#111827",

color:"#FFFFFF",

padding:15,

borderRadius:14,

marginBottom:12

},



button:{

backgroundColor:"#2563EB",

padding:17,

borderRadius:15,

alignItems:"center",

marginTop:20

},



buttonText:{

color:"#FFFFFF",

fontWeight:"900",

fontSize:16

},



idCard:{

backgroundColor:"#052E16",

padding:20,

borderRadius:18,

marginTop:20,

alignItems:"center"

},



idTitle:{

color:"#86EFAC",

fontWeight:"700"

},



id:{

color:"#FFFFFF",

fontSize:28,

fontWeight:"900",

marginTop:5

},



qrBox:{

alignItems:"center",

marginTop:30,

backgroundColor:"#FFFFFF",

padding:25,

borderRadius:20

},



warning:{

color:"#475569",

marginTop:20,

textAlign:"center"

}


});