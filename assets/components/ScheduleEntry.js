import React from 'react';
import { StyleSheet, Text, View, Image, AppRegistery, TextInput } from 'react-native';
import { Divider, Picker, Button } from 'react-native-elements';
import { ScrollView } from 'react-native';

import t from 'tcomb-form-native';


const SurgeryType = t.enums({
  Head_Surgery: 'Head Surgery',
  Neurosurgery: 'Neurosurgery'
});

const Surgery = t.struct({
  name: t.maybe(t.String),
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

var placeholder = {
  name: 'Name (optional)'
};

const Form  = t.form.Form;

export default class ScheduleEntry extends React.Component {

  constructor(props) {
    super(props);

  }

  addSurgeryToDatabase = () => {
    const value = this._form.getValue(); // use that ref to get the form value
    console.log('value: ', value);
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.main}>
          <Text style={styles.heading}>Add New Surgery</Text>
          <Text style={{ height: 50}}></Text>
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
