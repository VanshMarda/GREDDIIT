const express = require("express");
const app = express();
const mongoose = require("mongoose")
const cors = require('cors');
const { MongoNotConnectedError } = require("mongodb");
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
app.use(cors())
app.use(express.json());
const port = 5000;

const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate = `${year}-${month}-${day}`;

const conn_str = 'mongodb+srv://vansh_marda:Vansh%40123@geddiit.fy8yzc2.mongodb.net/data?retryWrites=true&w=majority'

mongoose.set("strictQuery", false)
mongoose.connect(
  conn_str,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log("success");
  }).catch((err) => console.log(err));
//create a server object:
app.listen(port, () => {
  console.log("starting the server");
});


//SCHEMAS
const ProfileSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  username: String,
  email: String,
  age: String,
  contactnumber: String,
  state: String,
  profession: String,
  password: String,
  sg: { type: Array, "default": [] },
});

const MySubGreddiitSchema = new mongoose.Schema({
  name: String,
  description: String,
  tags: { type: Array, "default": [] },
  banned: { type: Array, "default": [] },
  username: String,
  followers: { type: Array, "default": [] },
  requests: { type: Array, "default": [] },
  unfollowers: { type: Array, "default": [] },
  no_of_follower: { type: Array, default: { Date: new Date(), count: 1 } },
  no_of_posts: { type: Array, default: { Date: String, count: 0 } },
  no_of_visitores: { type: Array, default: { Date: String, count: 0 } },
  no_of_rep_posts: { type: Number, default: 0 },
  no_of_del_posts: { type: Number, default: 0 },
  posts: { type: Number, default: 0 },
},
  { timestamps: true },
);


const FollowersSchema = new mongoose.Schema({
  username: String,
  followers: { type: Array, "default": [] }
});

const FollowingSchema = new mongoose.Schema({
  username: String,
  following: { type: Array, "default": [] }
});

const PostsSchema = new mongoose.Schema({
  id: String, //belongs to which subgreddiit
  tittle: String,
  upvote: Number,
  devote: Number,
  post: String,
  username: String,//who wrote this post
  comment: { type: Array, "default": [] },
});

const SavedPostsSchema = new mongoose.Schema({
  id: String, //belongs to which subgreddiit
  tittle: String,//name of the post
  saved_username: String, //who is saving this post
});


const ReportSchema = new mongoose.Schema({
  id: String,
  reported_by: String,
  reported_user: String,
  status: String,
  created_at: Date,
  updated_at: Date,
  concern: String,
  post: String,
});



//SCHEMAS

const User = mongoose.model('User', ProfileSchema);
const Followers = mongoose.model('Followers', FollowersSchema);
const Following = mongoose.model('Following', FollowingSchema);
const MySubGreddiit = mongoose.model('MySubGreddiit', MySubGreddiitSchema);
const Post = mongoose.model('Post', PostsSchema);
const SavedPost = mongoose.model('SavedPost', SavedPostsSchema);
const Report = mongoose.model('Report', ReportSchema);


app.post('/signUp/user', (req, res) => {
  var hash = bcrypt.hashSync(req.body.password, salt);
  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    age: req.body.age,
    contactnumber: req.body.contactnumber,
    state: req.body.state,
    profession: req.body.profession,
    password: hash
  });

  user.save((err, user) => {
    if (err) return console.error(err);
    res.json(user);
  });
});

app.post('/signUp/followers', (req, res) => {

  const followers = new Followers({
    username: req.body.username
  });

  followers.save((err, followers) => {
    if (err) return console.error(err);
    res.json(followers);
  });
});



app.post('/signUp/following', (req, res) => {

  const following = new Following({
    username: req.body.username
  });

  following.save((err, following) => {
    if (err) return console.error(err);
    res.json(following);
  });
});



app.post('/check-username', (req, res) => {
  const username = req.body.username;

  console.log(username);
  // Find the user by name
  User.findOne({ username: username }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (user) {
      return res.send(user);
    }
    return res.status(200).json({ exists: false });
  });
});

app.post('/update-user', (req, res) => {
  var myquery = { _id: req.body.id };
  var newvalues = { $set: { username: req.body.username, age: req.body.age, email: req.body.email, contactnumber: req.body.phonenumber, state: req.body.city } };
  User.updateOne(myquery, newvalues, function (err, res) {
    if (err) throw err;
    console.log("1 document updated");
  });
})

app.get('/data', function (req, res) {
  let posts = User.find({}, function (err, posts) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(posts);
    }
  });
});


app.post('/update-following', (req, res) => {
  Followers.updateOne(
    { username: req.body.followers },
    { $push: { followers: req.body.username } }, function (err, res) {
      if (err) throw err;
      console.log("1 following updated");
    });

  Following.updateOne(
    { username: req.body.username },
    { $push: { following: req.body.followers } }, function (err, res) {
      if (err) throw err;
      console.log("1 follower updated");
    });
})


app.post('/following-list', (req, res) => {
  const username = req.body.username;
  // Find the user by name
  Following.find({ username: username }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (user) {
      return res.send(user);
    }
    return res.status(200).json({ exists: false });
  });
});

app.post('/followers-list', (req, res) => {
  const username = req.body.username;
  // Find the user by name
  Followers.find({ username: username }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (user) {
      return res.send(user);
    }
    return res.status(200).json({ exists: false });
  });
});

app.post('/unfollow', (req, res) => {
  Following.updateOne(
    { username: req.body.username },
    { $pull: { following: req.body.unfollow } }, function (err, res) {
      if (err) throw err;
      console.log("1 unfollowed");
    });
  Followers.updateOne(
    { username: req.body.unfollow },
    { $pull: { following: req.body.username } }, function (err, res) {
      if (err) throw err;
      console.log("1 unfollowed");
    });

})

app.post('/remove', (req, res) => {
  Following.updateOne(
    { username: req.body.unfollow },
    { $pull: { following: req.body.username } }, function (err, res) {
      if (err) throw err;
      console.log("1 removed");
    });
  Followers.updateOne(
    { username: req.body.username },
    { $pull: { followers: req.body.unfollow } }, function (err, res) {
      if (err) throw err;
      console.log("1 removed");
    });

})


//add a new subgreddiit
app.post('/addSubgGreddiit', (req, res) => {
  const user = new MySubGreddiit({
    name: req.body.name,
    description: req.body.description,
    tags: req.body.tags,
    banned: req.body.banned,
    username: req.body.username,
    followers: [req.body.username],
  });

  User.updateOne(
    { username: req.body.username },
    { $push: { sg: req.body.name } }, function (err, res) {
      if (err) throw err;
      console.log("added in msg list");
    });

  user.save((err, user) => {
    if (err) return console.error(err);
    res.json(user);

  });

});



//get all the data of user with username in the collection of subgreddiit
app.post('/get_msg_data', (req, res) => {
  let posts = MySubGreddiit.find({ username: req.body.username }, function (err, posts) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(posts);
    }
  });
});



//remove subgreddiit
app.post('/removefrommsg', (req, res) => {
  MySubGreddiit.deleteOne({ name: req.body.name }, function (err) {
    if (!err) {
      console.log('Success!');
    } else {
      console.log(err);
    }
  })
  User.updateOne(
    { username: req.body.username },
    { $pull: { sg: req.body.name } }, function (err, res) {
      if (err) throw err;
      console.log("deleted in msg list");
    });
  Post.deleteMany({ id: req.body.id }, function (err) {
    if (!err) {
      console.log('deleted from posts!');
    } else {
      console.log(err);
    }
  })
  Report.deleteMany({ id: req.body.id }, function (err) {
    if (!err) {
      console.log('deleted from report!');
    } else {
      console.log(err);
    }
  })
});

app.get('/users/:id', (req, res) => {
  MySubGreddiit.findById(req.params.id, (err, user) => {
    if (err) return res.status(500).send(err);
    if (!user) return res.status(404).send('User not found');
    res.send(user);
  });
});


//get all the data in the collection of subgreddiit
app.post('/get_sg_data', (req, res) => {
  let posts = MySubGreddiit.find({}, function (err, posts) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(posts);
    }
  });
});

//searching the subgreddiit by name
app.get("/subreddits", async (req, res) => {
  const name = req.query.name;
  const regex = new RegExp(`.*${name}.*`, "i");
  const subreddits = await MySubGreddiit.find({ name: regex });
  res.send(subreddits);
});

//adding request from user
app.patch('/addrequesttosg', async (req, res) => {
  const { name, username } = req.body;
  const subreddit = await MySubGreddiit.findOne({ name: req.body.name });
  const found = subreddit.unfollowers.find((el) => el === username);
  if (!found) {
    const example = await MySubGreddiit.findOne({ name, requests: { $in: [username] } });
    if (example) {
      return res.status(400).json({ message: 'Element already exists in the array' });
    }
    MySubGreddiit.updateOne({ name }, { $push: { requests: username } }, (error) => {
      if (error) {
        return res.status(500).json({ error });
      }
      res.send("request sent!!");
    });
  }
  else {
    res.send("u cannot follow");
  }
});

//shows the folloers of a particular sg
app.get('/getusersforasg', function (req, res) {
  let posts = MySubGreddiit.find({ name: req.body.name }, function (err, posts) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(posts);
    }
  });
});

app.post("/handleacceptinsg", async (req, res) => {
  const today = currentDate;
  const subreddit = await MySubGreddiit.findOne({ _id: req.body.id });
  const found = subreddit.no_of_follower.find((el) => el.Date === today);
  if (!found) {
    const per4 = await MySubGreddiit.updateOne(
      {
        _id: req.body.id
      },
      { $addToSet: { no_of_follower: { Date: today, count: 1 } } }
    );
    res.send(per4)

  } else {
    const per3 = await MySubGreddiit.updateOne(
      {
        _id: req.body.id
      },
      { $inc: { "no_of_follower.$[element].count": 1 } },
      {
        arrayFilters: [{ "element.Date": today }],
      }
    );
    res.send(per3)
  }
  MySubGreddiit.updateOne(
    { _id: req.body.id },
    { $pull: { requests: req.body.name } }, function (err, res) {
      if (err) throw err;
      console.log("removed from requested list")
    });
  MySubGreddiit.updateOne(
    { _id: req.body.id },
    { $push: { followers: req.body.name } }, function (err, res) {
      if (err) throw err;
      console.log("added to followers list")
    });
});


app.post('/handlerejectinsg', function (req, res) {
  MySubGreddiit.updateOne(
    { _id: req.body.id },
    { $pull: { requests: req.body.name } }, function (err, res) {
      if (err) throw err;
      console.log("removed from requested list")
    });
});



app.post('/addPost', (req, res) => {
  MySubGreddiit.updateOne({ _id: req.body.id }, { $inc: { posts: 1 } }, (error, result) => { });

  const post = new Post({
    id: req.body.id,
    tittle: req.body.tittle,
    upvote: 0,
    devote: 0,
    post: req.body.post,
    username: req.body.username
  });


  post.save((err, post) => {
    if (err) return console.error(err);
    res.json(post);
  });
});

app.post('/get_posts_data', (req, res) => {
  Post.find({ id: req.body.id }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (user) {
      return res.send(user);
    }
    return res.status(200).json({ exists: false });
  });
});

app.post('/upvote', (req, res) => {
  Post.updateOne({ tittle: req.body.tittle }, { $inc: { upvote: 1 } }, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    }
    else {
      console.log("upvoted");
    }
  });
});

app.post('/devote', (req, res) => {
  Post.updateOne({ tittle: req.body.tittle }, { $inc: { devote: 1 } }, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    }
    else {
      console.log("devoted");
    }
  });
});

app.post('/follow_post', async (req, res) => {
  try {
    const post = await Post.findOne({ tittle: req.body.tittle });
    const postUsername = post.username;
    const followersDocument = await Followers.findOne({ username: postUsername });
    const followingDocument = await Following.findOne({ username: req.body.curr_username });
    followersDocument.followers.push(req.body.curr_username);
    followingDocument.following.push(postUsername);
    await followersDocument.save();
    await followingDocument.save();
    console.log(`Successfully updated the followers array for the username: ${postUsername}`);
  } catch (error) {
    console.log(`Error while updating the followers array: ${error}`);
  }
});

app.post('/addComment', (req, res) => {
  Post.updateOne(
    { tittle: req.body.tittle },
    { $push: { comment: req.body.comment } }, function (err, res) {
      if (err) throw err;
      console.log("comment added");
    });
});


//save the post
app.post('/save_post', (req, res) => {
  const post = new SavedPost({
    id: req.body.id,
    tittle: req.body.tittle,
    saved_username: req.body.curr_username
  });

  post.save((err, post) => {
    if (err) return console.error(err);
    res.json(post);
  });
});

//inc the no of posts
app.post("/inc_no_of_posts", async (req, res) => {
  const today = currentDate;
  const subreddit = await MySubGreddiit.findOne({ _id: req.body.id });
  const found = subreddit.no_of_posts.find((el) => el.Date === today);
  if (!found) {
    const per4 = await MySubGreddiit.updateOne(
      {
        _id: req.body.id
      },
      { $addToSet: { no_of_posts: { Date: today, count: 1 } } }
    );
    res.send(per4)

  } else {
    const per3 = await MySubGreddiit.updateOne(
      {
        _id: req.body.id
      },
      { $inc: { "no_of_posts.$[element].count": 1 } },
      {
        arrayFilters: [{ "element.Date": today }],
      }
    );
    res.send(per3)
  }
});


app.post("/inc_no_of_visitors", async (req, res) => {
  const today = currentDate;
  const subreddit = await MySubGreddiit.findOne({ _id: req.body.id });
  const found = subreddit.no_of_posts.find((el) => el.Date === today);
  if (!found) {
    const per4 = await MySubGreddiit.updateOne(
      {
        _id: req.body.id
      },
      { $addToSet: { no_of_visitores: { Date: today, count: 1 } } }
    );
    res.send(per4)

  } else {
    const per3 = await MySubGreddiit.updateOne(
      {
        _id: req.body.id
      },
      { $inc: { "no_of_visitores.$[element].count": 1 } },
      {
        arrayFilters: [{ "element.Date": today }],
      }
    );
    res.send(per3)
  }
});



// to get the saved posts

app.post('/get_saved_posts', async (req, res) => {
  SavedPost.find({ saved_username: req.body.curr_username }, (err, savedPosts) => {
    if (err) {
      res.send(err);
    }
    const tittles = savedPosts.map(savedPost => savedPost.tittle);
    Post.find({ tittle: { $in: tittles } }, (err, posts) => {
      if (err) {
        res.send(err);
      }
      res.send(posts);
    });
  });
});



app.post('/remove_from_saved_posts', function (req, res) {
  SavedPost.deleteOne({ name: req.body.name }, function (err) {
    if (!err) {
      console.log('deleted!');
    } else {
      console.log(err);
    }
  })
});



// report the user
app.post('/report_user', (req, res) => {
  const post = new Report({
    id: req.body.id,
    reported_by: req.body.reported_by,
    reported_user: req.body.reported_user,
    concern: req.body.concern,
    post: req.body.post,
    status: 'open',
    created_at: new Date(),
    updated_at: new Date(),
  });

  post.save((err, post) => {
    if (err) return console.error(err);
    res.json(post);
  });
});


// to get the saved posts

app.post('/get_reported_people', (req, res) => {
  Report.find({ id: req.body.id }, (err, report) => {
    if (err) {
      res.send(err);
    }
    res.send(report)
  });
});

app.post('/block_user', async (req, res) => {
  const id = req.body.id;
  const username = req.body.name;
  const updatedUsername = await Post.updateOne({ id, username }, {
    $set: { username: 'Blocked User' }
  });
  MySubGreddiit.updateOne(
    { _id: req.body.id },
    { $pull: { followers: req.body.name } }, function (err, res) {
      if (err) throw err;
      console.log("guy blocked!1");
    });
  Report.deleteOne({ reported_user: username, id: id }, function (err) {
    if (!err) {
      console.log('deleted!');
    } else {
      console.log(err);
    }
  })
  MySubGreddiit.updateOne(
    { _id: req.body.id },
    { $push: { unfollowers: req.body.name } }, function (err, res) {
      if (err) throw err;
      console.log("guy added to unfolowers array");
    });

});

app.post('/delete_post', function (req, res) {
  const id = req.body.id;
  const username = req.body.name;
  Post.deleteOne({ post: req.body.post, id: req.body.id }, function (err) {
    if (!err) {
      console.log('deleted post!');
    } else {
      console.log(err);
    }
  })
  Report.deleteOne({ reported_user: username, id: id }, function (err) {
    if (!err) {
      console.log('deleted!');
    } else {
      console.log(err);
    }
  })
});

app.post('/ignore', function (req, res) {
  const id = req.body.id;
  const username = req.body.name;
  Report.deleteOne({ reported_user: username, id: id }, function (err) {
    if (!err) {
      console.log('deleted!');
    } else {
      console.log(err);
    }
  })
  res.send({message:"Request ignored"})
});


app.get('/get_followers_data', (req, res) => {
  MySubGreddiit.find({ id: req.body.id }, (err, report) => {
    if (err) {
      res.send(err);
    }
    res.send(report)
  });
});

app.post('/get_banned_words', (req, res) => {
  MySubGreddiit.find({ _id: req.body.id }, (err, report) => {
    if (err) {
      res.send(err);
    }
    // console.log(report);
    res.send(report)
  });
});


//removing from sg
app.post('/removefromsg', async (req, res) => {
  await MySubGreddiit.updateOne(
    { _id: req.body.id },
    { $pull: { followers: req.body.name } }, function (err, res) {
      if (err) throw err;
      console.log("removed from requested list")
    }).clone().catch(function (err) { console.log(err) })
  await MySubGreddiit.updateOne(
    { _id: req.body.id },
    { $push: { unfollowers: req.body.name } }, function (err, res) {
      if (err) throw err;
      console.log("added to followers list")
    }).clone().catch(function (err) { console.log(err) })
});



const checkExpiredReports = async () => {
  try {
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);

    const expiredReports = await Report.find({ status: 'open', updated_at: { $lt: tenDaysAgo } }).toArray();

    for (const report of expiredReports) {
      await Report.deleteOne({ _id: report._id });
    }
    console.log(`Checked for expired reports. Deleted ${expiredReports.length} expired reports.`);
  } catch (err) {
    console.error('Error checking for expired reports:', err);
  }
};


// Schedule the check to run every day at midnight
const checkTimer = setInterval(checkExpiredReports, 24 * 60 * 60 * 1000);