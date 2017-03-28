import React from 'react';
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox';

const MemberModel = {
  phone: {type: String},
  prayer: {type: String},
  prayedFor: {type: Boolean}
};

const members = [
  {phone: '9796763030', prayer: "i think its hilarious u guys talk shit about anime. u wouldn't say this shit about it in japan, they're samurai. not only that but they wears the freshest katanas, eats at the chillest ramen stands and hangs out with the hottest lolis. yall are pathetic lol.", prayerFor: false},
  {phone: '9796763030', prayer: 'ayasdfo', prayerFor: false},
  {phone: '9796763030', prayer: 'aasdfao', prayerFor: false},
  {phone: '9796763030', prayer: 'ayy asdfo', prayerFor: false},
];
const Members = React.createClass({
  getInitialState: function(){
    return {
      source: members
    }
  },

  handleSelect: function(selected){
    alert(selected);
    //ayalm o
  },

  render: function() {
    return(
      <div>
        <h1>Members</h1>
        <Table>
          <TableHead>
            <TableCell>Phone Number</TableCell>
            <TableCell>Prayer</TableCell>
            <TableCell>Prayed For</TableCell>
          </TableHead>
        {members.map((item, idx) => (
          <TableRow key={idx}>
            <TableCell>{item.phone}</TableCell>
            <TableCell>{item.prayer}</TableCell>
            <TableCell>{item.prayerFor.toString()}</TableCell>
          </TableRow>
        ))}
        </Table>
      </div>
    );
  }
});

module.exports = Members;
