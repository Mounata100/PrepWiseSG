// import React from 'react';
// import {
// View,
// Text,
// StyleSheet,
// TouchableOpacity
// } from 'react-native';


// export default function FamilySafetyScreen(){

// const members=[
//  {
//  name:"Parent",
//  status:"SAFE"
//  },
//  {
//  name:"Sibling",
//  status:"WAITING"
//  }
// ];


// return(

// <View style={styles.container}>


// <Text style={styles.title}>
// Family Safety Circle
// </Text>


// {
// members.map((m,index)=>(

// <View 
// key={index}
// style={styles.card}
// >

// <Text style={styles.name}>
// {m.name}
// </Text>


// <Text
// style={{
// color:m.status==="SAFE"
// ?'#10B981'
// :'#F59E0B'
// }}
// >
// {m.status}
// </Text>


// </View>

// ))
// }



// <TouchableOpacity
// style={styles.button}
// >

// <Text style={styles.btnText}>
// Send Safety Check
// </Text>

// </TouchableOpacity>


// </View>

// );

// }



// const styles=StyleSheet.create({

// container:{
// flex:1,
// backgroundColor:'#020617',
// padding:20
// },

// title:{
// color:'#fff',
// fontSize:26,
// fontWeight:'900',
// marginTop:40
// },

// card:{
// backgroundColor:'#0F172A',
// padding:20,
// borderRadius:16,
// marginTop:15,
// flexDirection:'row',
// justifyContent:'space-between'
// },

// name:{
// color:'#fff',
// fontSize:17,
// fontWeight:'700'
// },

// button:{
// backgroundColor:'#2563EB',
// padding:16,
// borderRadius:14,
// marginTop:30,
// alignItems:'center'
// },

// btnText:{
// color:'#fff',
// fontWeight:'900'
// }

// });


import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FamilySafetyScreen() {
  const [members, setMembers] = useState([
    { name: 'Parent (Primary Caregiver)', status: 'SAFE', location: 'Home Shelter Zone' },
    { name: 'Sibling (Workplace Link)', status: 'WAITING', location: 'CBD Sector' }
  ]);

  const sendBroadcastAlert = () => {
    Alert.alert(
      "📡 Safety Check Dispatched",
      "Broadcasting low-bandwidth check-in pings to all linked family nodes across Singapore nodes.",
      [{ text: "Acknowledge", style: "default" }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Family Safety Circle</Text>
      <Text style={styles.subtitle}>Real-time telemetry tracking for emergency muster links.</Text>

      {members.map((m, index) => (
        <View key={index} style={styles.card}>
          <View>
            <Text style={styles.name}>{m.name}</Text>
            <Text style={styles.locationText}>{m.location}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: m.status === 'SAFE' ? '#064E3B' : '#78350F' }]}>
            <Text style={{ color: m.status === 'SAFE' ? '#34D399' : '#FBBF24', fontWeight: '800', fontSize: 12 }}>
              {m.status}
            </Text>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={sendBroadcastAlert}>
        <Ionicons name="radio-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={styles.btnText}>Broadcast Safety Status Check</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  title: { color: '#FFFFFF', fontSize: 26, fontWeight: '900' },
  subtitle: { color: '#94A3B8', fontSize: 13, marginTop: 4, marginBottom: 20 },
  card: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 18,
    borderRadius: 16,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  locationText: { color: '#64748B', fontSize: 12, marginTop: 2 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  button: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 14,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 15 }
});