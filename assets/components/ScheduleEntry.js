import React from 'react';
import { StyleSheet, Text, View, Image, AppRegistery, TextInput } from 'react-native';
import { Divider, Picker, Button } from 'react-native-elements';
import { ScrollView } from 'react-native';

import t from 'tcomb-form-native';

import { SQLite } from 'expo';


const db = SQLite.openDatabase('ourhuddle.db');


export default class ScheduleEntry extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      surgery_types: []
    }
  }

  componentDidMount(){
    that = this;
    db.transaction(tx => {
      tx.executeSql(`SELECT * FROM ProcedureTypes`,[],(tx,res) => {
        var sup = []
        for(var i = 0; i < res.rows.length; ++i){
          sup.push(res.rows.item(i));
        }
        this.setState({ surgery_types: sup });
      }, (tx,err)=>{console.log("DBERROR: 04");console.log(err);})
    });
  }


  addSurgeryToDatabase = () => {
    const value = this._form.getValue(); // use that ref to get the form value
    console.log('TAYAB: ', value);
    console.log(value["name"]);
    //add new surgery to database
    db.transaction(tx => {
      tx.executeSql(`INSERT INTO Procedures
            (procedure_type_id,surgeon_id,start_timestamp,end_timestamp) VALUES
            (1,1,:start_time,:end_time)`,
            [
              value["startTime"],
              value["endTime"]
            ],
            (tx,res)=>{console.log("[NEW_SURGERY_ADDED]");},
            (tx,err)=>{console.log("SURGERY NOT ADDED");console.log(err)}
      );

    });
  }

  render() {
    var dict = {}
    var surg = this.state.surgery_types;
    for(var i = 0; i < surg.length; i++){
      dict[surg[i]["id"]] = surg[i]["name"];
    }

    var surg_dict = {}
    var surgeons = tis.state.surgeons;
    for(var i = 0; i < surg_dict.length;

    const SurgeryType = t.enums(dict);
    const SurgeonName = t.enums(surg_dict);

    const Surgery = t.struct({
      type: SurgeryType,
      surgeonName: t.String,
      startTime: t.Date,
      endTime: t.Date,
    });

    var options = {
      fields: {
        type: {
          label: 'Surgery Type',
          value: 'Choose a surgery type',
          error: 'Surgery type is required.'
        },
        surgeonName: {
          error: 'Surgeon name is required.'
        }
      }
    }

    const Form  = t.form.Form;

    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.main}>
          <Text style={styles.heading}>Add New Surgery</Text>
          <View style={styles.container}>
            <Form ref={c => this._form = c}  type={Surgery} options={options} />
            <Button title="Create Surgery" onPress={this.addSurgeryToDatabase} style={{left: -20}} />
          </View>
          <View style={{height: 20 + '%' }}></View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    width: '50%'
  },
  contentContainer: {
    paddingVertical: 20
  },
  heading: {
    left: '5%',
    fontWeight: "bold",
    fontSize: 25,
  },
  main: {
    justifyContent: 'flex-start',
    left: 20 + '%',
    top: 10 + "%",
    padding: 20,
    bottom: 150
  }
});
