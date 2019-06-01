import React from 'react';
import { StyleSheet, Text, View, Image, AppRegistery, TextInput } from 'react-native';
import { Divider, Picker, Button } from 'react-native-elements';
import { ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import t from 'tcomb-form-native';
var _ = require('lodash');

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.controlLabel.normal.fontSize = 20;
stylesheet.controlLabel.normal.textAlign = "center";

stylesheet.pickerContainer.normal.borderColor = "#222222";
stylesheet.pickerContainer.normal.paddingBottom = 20;
stylesheet.pickerContainer.normal.marginBottom = 20;

stylesheet.datepicker.normal.paddingBottom = 20;



import { SQLite, Font } from 'expo';


const db = SQLite.openDatabase('ourhuddle.db');


export default class ScheduleEntry extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      surgery_types: [],
      surgeons: [],
      fontLoaded: false
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      BreeSerifRegular: require('../../assets/fonts/BreeSerif-Regular.ttf'),
      OpenSansLight: require('../../assets/fonts/OpenSans-Light.ttf'),
    });
    this.setState({ fontLoaded: true })
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

      tx.executeSql(`SELECT * FROM Surgeons`,[],(tx,res) => {
        var surg = []
        for(var i = 0; i < res.rows.length; ++i){
          surg.push(res.rows.item(i))
        }
        this.setState({ surgeons: surg });
      }, (tx,err)=>{console.log("DBERROR: 08");console.log(err);})
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
    if(this.state.fontLoaded) {
      var dict = {}
      var surg_type = this.state.surgery_types;
      for(var i = 0; i < surg_type.length; i++){
        dict[surg_type[i]["id"]] = surg_type[i]["name"];
      }

      var surg_dict = {}
      var surgeons = this.state.surgeons;
      for(var i = 0; i < surgeons.length; i++){
        surg_dict[surgeons[i]["id"]] = surgeons[i]["name"];
      }

      const ProcedureType = t.enums(dict);
      const SurgeonName = t.enums(surg_dict);

      const Surgery = t.struct({
        type: ProcedureType,
        surgeonName: SurgeonName,
        startTime: t.Date,
        endTime: t.Date,
      });

      var options = {
        fields: {
          type: {
            label: 'Procedure Type',
            value: 'Choose a surgery type',
            error: 'Procedure type is required.'
          },
          surgeonName: {
            error: 'Surgeon name is required.',
            label: 'Surgeon Name',
            value: 'Choose the surgeon name',
          }
        },
        stylesheet: stylesheet
      }

      const Form  = t.form.Form;

      return (
        <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.heading}>Add New Surgery</Text>
        <View style={styles.main}>
            <View style={styles.container}>
              <Form ref={c => this._form = c}  type={Surgery} options={options} />
              <Button style={styles.createSurgeryButton} title="Create Surgery" onPress={this.addSurgeryToDatabase} style={{left: -20}} />
            </View>
            <View style={{height: 20 + '%' }}></View>
          </View>
        </ScrollView>
      );
    } else {
      return(
        <View><Text>The app is loading</Text></View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 80,
    padding: 0,
    width: '50%'
  },
  contentContainer: {
    paddingVertical: 20
  },
  heading: {
    fontFamily: "OpenSansLight",
    fontSize: 35,
    top: 50,
    textAlign: "center"
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    left: 22 + '%',
    top: 10 + "%",
    padding: 20,
    bottom: 150
  },
  createSurgeryButton: {
    backgroundColor: "#0489B2",
    borderColor: "#084B8A",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: "stretch",
    justifyContent: "center"
  }
});
