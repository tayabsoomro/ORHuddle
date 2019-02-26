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

  componentDidMount(){
    that = this;
    db.transaction(tx => {
      tx.executeSql(`SELECT Procedures.id AS procedure_id, ProcedureTypes.id AS procedure_type_id, ProcedureTypes.name AS procedure_name, Surgeons.name AS surgeon_name FROM ((Procedures INNER JOIN ProcedureTypes ON Procedures.procedure_type_id = ProcedureTypes.id) INNER JOIN Surgeons ON Procedures.surgeon_id = Surgeons.id);`,[],(tx,res) => {
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

  render() {
    const {surgeries} = this.state;
    // console.log(surgeries);
    return (
      <View style={styles.container}>
        <View style={{height: 20}}></View>
        <Text style={styles.heading}>Current Slate</Text>
        <View style={{height: 20}}></View>
        <ScrollView>
        {
          surgeries.map((l, i) => (
            <ListItem
              key={i}
              title={l.procedure_name}
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
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    left: 0
  },
});
