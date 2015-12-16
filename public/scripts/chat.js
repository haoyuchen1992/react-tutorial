/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


var OnlineUserAvatar = React.createClass({
  render: function() {
    return (
      <div className="avatar-chat">
        <img src={this.props.avatarURL} /> 
      </div>
    );
  }
});

var OnlineUserList = React.createClass({
  render: function() {
    var onlineUserListNode = this.props.data.map(function(user) {
      return (
        <OnlineUserAvatar avatarURL={user.avatarURL} key={user.id} />
      );
    });
    return (
      <div className="online-user-list">
        {onlineUserListNode}
      </div>
    );
  }  
});


// var ChatRecord = React.createClass({
//   render: function() {
//     return (
//       <li className = {this.props.data.selfChat ? "self-chat" : "others-chat"} 
//           profile-img-url = {"url:(" + this.props.data.avatarURL + ")"} >
//               {this.props.data.body}
//       </li>
//     );
//   }  
// });


var ChatRecordsList = React.createClass({
  render: function() {
    return (
        <div className="chat-container">
          <div className="chat-box">
            <div className="message-box left-img">
              <div className="picture">
                <div className="avatar-chat">
                  <img src="https://avatars0.githubusercontent.com/u/5420789?v=3&s=460"></img>
                </div>
                <span className="time">10 mins</span>
              </div>
              <div className="message">
                <span>Bobby Giangeruso</span>
                <p>Hey Mike, how are you doing?</p>
              </div>
            </div>
            <div className="message-box right-img">
              <div className="picture">
                <div className="avatar-chat">
                  <img src="https://avatars0.githubusercontent.com/u/5420789?v=3&s=460"></img>
                </div>
                <span className="time">2 mins</span>
              </div>
              <div className="message">
                <span>Mike Moloney</span>
                <p>Pretty good, Eating nutella, nommommom</p>
              </div>
            </div>
          </div>
    </div>
    );
  }  
});

// var ChatRecordsList = React.createClass({
//   render: function() {
//     var chatRecordsNodes = this.props.data.map(function(record) {
//       return (
//           <ChatRecord data={record} key={record.id} />
//       );
//     });

//     return (
//       <ul className="chat-thread">
//           {chatRecordsNodes}
//       </ul>
//     );
//   }  
// });

var Comment = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },

  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

var CommentBox = React.createClass({
  loadUsersFromServer: function () {
    $.ajax({
      url: '/api/users',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({onlineUsersData: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/users', status, err.toString());
      }.bind(this)
    });
  },
  loadChatRecordsFromServer: function () {
    $.ajax({
      url: '/api/chatrecords',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({chatRecordsData: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/chatrecords', status, err.toString());
      }.bind(this)
    });
  },  
  getInitialState: function() {
    return {onlineUsersData: [], chatRecordsData: []};
  },
  componentDidMount: function() {
    this.loadUsersFromServer();
    this.loadChatRecordsFromServer();
    setInterval(this.loadUsersFromServer, this.props.pollInterval);
    setInterval(this.loadChatRecordsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <OnlineUserList data={this.state.onlineUsersData} />
        <ChatRecordsList data={this.state.chatRecordsData} />
      </div>
    );
  }
});


ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);
