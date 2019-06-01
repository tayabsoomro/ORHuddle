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



import { SQLite } from 'expo';
const db = SQLite.openDatabase('ourhuddle.db');

export default class ScheduleView extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      surgeries: []
    }
  }

  static navigationOptions = {
    title: 'Current Slate',
    headerStyle: {
      backgroundColor: '#BDCDDB',
    },
    headerTintColor: '#222',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  componentDidMount(){
    that = this;
    db.transaction(tx => {
      tx.executeSql(`SELECT Procedures.start_timestamp AS start_time, Procedures.end_timestamp AS end_time, Procedures.id AS procedure_id, ProcedureTypes.id AS procedure_type_id, ProcedureTypes.name AS procedure_name, Surgeons.name AS surgeon_name FROM ((Procedures INNER JOIN ProcedureTypes ON Procedures.procedure_type_id = ProcedureTypes.id) INNER JOIN Surgeons ON Procedures.surgeon_id = Surgeons.id);`,[],(tx,res) => {
        // console.log("THIS");
        // console.log(res);
        var sup = []
        for(var i = 0; i < res.rows.length; ++i){
          sup.push(res.rows.item(i));
        }
        this.setState({ surgeries: sup });
      }, (tx,err)=>{console.log("DBERROR: 05");console.log(err);})
    });
  }


  alertItemName = (item) => {
      alert(item.name)
  }

  formatDate(start,end){
    start = start.split(" ")[1]
    end = end.split(" ")[1]
    return "(" + start + " - " + end + ")";
  }

  render() {
    const {surgeries} = this.state;
    // console.log(surgeries);
    return (
      <View style={styles.container}>
        <View style={{height: 20}}></View>
        <View style={{height: 20}}></View>
        <ScrollView>
        {
          surgeries.map((l, i) => (
            <ListItem
              key={i}
              title={this.formatDate(l.start_time,l.end_time) + " " + l.procedure_name}
              subtitle={l.surgeon_name}
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
   backgroundColor: "#BDCDDB"
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    left: 0
  },
});
