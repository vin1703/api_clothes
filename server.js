const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');
const productRoute = require('./routes/productRoute');
const cartRoute = require('./routes/cartRoute');
const stripeRoute = require('./routes/stripeRoute');
const orderRoute = require('./routes/orderRoute');
const cors = require('cors');

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });

app.use(cors());

app.use(express.json());

app.use('/api/auth',authRoute);

app.use('/api/user',userRoute);

app.use('/api/product',productRoute);

app.use('/api/cart',cartRoute);

app.use('/api/checkout',stripeRoute);

app.use('/api/order',orderRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is running!");
  });
