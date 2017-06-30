import React, { PropTypes } from 'react';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

/**
 * Dialog with action buttons. The actions are passed in as an array of React objects,
 * in this example [FlatButtons](/#/components/flat-button).
 *
 * You can also close this dialog by clicking outside the dialog, or with the 'Esc' key.
 */
export default class LoginDialog extends React.Component {
  state = {
    open: false,
  };

  handleLogin = () => {
    this.context.router.replace('/login');
  };

  handleNeverSeeAgain = () => {
    console.log("NEVER SEE AGAIN!")
    localStorage.setItem('never_see', true);
    this.props.onClose();
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          onRequestClose={this.props.onClose}
        >
          <DialogTitle>{"Login bro!"}</DialogTitle>
          <DialogContent>
              <div>
                <h2>Log in to get more features such as:</h2>
                <ul>
                  <li>See prayer requests you prayed for</li>
                  <li>Get updates on prayer requests</li>
                  <li>Update your own prayer requests</li>
                  <li>..And more!</li>
                </ul>
              </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleNeverSeeAgain} color="primary">Don't see again</Button>
            <Button onClick={this.handleLogin}>Login</Button>
            <Button color="accent" onClick={this.props.onClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

LoginDialog.contextTypes = {
  router: PropTypes.object.isRequired
};