import React from 'react';

import { ScrollView } from 'react-native';
import { Text, View, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Button } from 'react-native-elements';
import t from 'tcomb-form-native';

import { SQLite } from 'expo';
const db = SQLite.openDatabase('test.db');


class EditSurgeryView extends React.Component {

  constructor(props){
    super(props);
    // this.state{
    //
    // }
  }

  componentDidMount(){

  }

  addNoteToDatabase = () => {
    const { navigation } = this.props;
    const value = this._form.getValue(); // use that ref to get the form value
    currentItem = navigation.getParam("item", "NULL");
    //add new surgery to database
    db.transaction(tx => {
      tx.executeSql(`INSERT INTO notes
            (message,surgery_id, priority,author) VALUES
            (:message,:surgery_id,:priority,:author)`,
            [
              value["message"],
              parseInt(currentItem["id"]),
              value["priority"]
            ],
            (tx,res)=>{console.log("[NEW_NOTE_ADDED]");},
            (tx,err)=>{console.log("NOTE NOT ADDED");console.log(err)}
      );

    });
  }


  render(){
    const { navigation } = this.props;
    const currentItem = navigation.getParam("item", "NULL");

    const PriorityType = t.enums({
      error: "error",
      warning: "warning"
    });

    const Note = t.struct({
      author: t.String,
      message: t.String,
      priority: PriorityType
    });

    var options = {
      fields: {
        message: {
          label: 'Your Message',
          error: 'Message is required.'
        },
        author: {
          label: 'Author',
        }
      }
    }

    const Form  = t.form.Form;

    return(
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.main}>
          <Text style={styles.heading}>Add New Note</Text>
          <Text style={{ height: 20}}></Text>
          <View style={styles.container}>
            <Form ref={c => this._form = c}  type={Note} options={options} />
            <Button title="Add Note" onPress={this.addNoteToDatabase} style={{left: -20}} />
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
    width: '90%'
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
    top: 10 + "%",
    padding: 20,
    bottom: 150
  }
})

export default EditSurgeryView;
