require('dotenv').config();

if (process.env.NODE_ENV == 'production') {
    module.exports = {mongoURI: `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@blognode-cluster.wm5bj.mongodb.net/blognode-cluster?retryWrites=true&w=majority`}
    
} else {
    module.exports = {mongoURI: "mongodb://localhost/blognode"}

}