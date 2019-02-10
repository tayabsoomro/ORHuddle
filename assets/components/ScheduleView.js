import React from 'react';
import { StyleSheet, Text, View, FlatList, Platform, List } from 'react-native';
import { ListItem } from 'react-native-elements';
import { TouchableOpacity, ScrollView } from 'react-native';
import
  { createStackNavigator,
    createAppContainer,
    StackActions,
    NavigationActions
  } from 'react-navigation';



export default class ScheduleView extends React.Component {


  constructor(props) {
    super(props);
  }


  alertItemName = (item) => {
      alert(item.name)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{height: 20}}></View>
        <Text style={styles.heading}>Current Slate</Text>
        <View style={{height: 20}}></View>
        <ScrollView>
        {
          list.map((l, i) => (
            <ListItem
              key={i}
              title={l.name}
              subtitle={l.surgeon}
              onPress={() => this.props.navigation.navigate('Details',{item: l})}
            />
          ))
        }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    left: '5%',
    fontWeight: "bold",
    fontSize: 25,
  },
  container: {
   flex: 1,
   flexDirection: 'column',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    left: 0
  },
})

const list = [
  {
    name: 'Surgery 1',
    surgeon: 'Dr. Visvanathan',
    type: "Appendectomy",
    start_time: "Fri Feb 08 2019 09:35:38 GMT-0600",
    end_time: "Fri Feb 08 2019 11:35:38 GMT-0600",
    notes: [
       {
         message: "This is a very important message",
         author: "Dr. Visvanathan",
         priority: "error"
       },
       {
         message: "This is a casual message",
         author: "Dr. Visvanathan",
         priority: "warning"
       }
    ]
  },
  {
    name: 'Surgery 2',
    surgeon: 'Dr. Doe',
    type: "Appendectomy",
    start_time: "Fri Feb 08 2019 17:35:38 GMT-0600",
    end_time: "Fri Feb 08 2019 18:35:38 GMT-0600",
    notes: [
       {
         message: "This is a very important message",
         author: "Dr. Doe",
         priority: "error"
       },
       {
         message: "This is a message from nurse. The nephrectomy equipment is not ready.",
         author: "Nurse 1",
         priority: "warning"
       }
    ]
  },
  {
    name: 'Surgery 3',
    surgeon: 'Dr. Gates',
    type: "Appendectomy",
    start_time: "Fri Feb 08 2019 20:35:38 GMT-0600",
    end_time: "Fri Feb 08 2019 21:35:38 GMT-0600",
    notes: [
       {
         message: "This is a very important message",
         author: "Dr. Gates",
         priority: "error"
       }
    ]
  },
  {
    name: 'Surgery 4',
    surgeon: 'Dr. Bialik',
    type: "Appendectomy",
    start_time: "Fri Feb 08 2019 21:50:38 GMT-0600",
    end_time: "Fri Feb 08 2019 22:35:38 GMT-0600",
    notes: [
       {
         message: "The hospital has been hacked by some meta-human.",
         author: "Nurse 1",
         priority: "error"
       },
       {
         message: "This is a casual message",
         author: "Dr. Bialik",
         priority: "warning"
       }
    ]
  },

]
