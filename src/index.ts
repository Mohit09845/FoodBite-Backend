import express, {Request,Response} from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI as string).
then(()=> console.log('MONGODB connected successfully')).
catch((error)=> console.log('Database connection failed',error));

const app = express();
app.use(express.json());
app.use(cors());

app.get('/health',async(req: Request,res: Response)=>{
    res.send({message: 'health OK!'})
})

import myUserRoute from './route/user.route';
import myRestaurantRoute from './route/restaurant.route';

app.use('/api/my/user',myUserRoute);
app.use('/api/my/restaurant',myRestaurantRoute);

const port: number = parseInt(process.env.PORT as string) || 7000;

app.listen(port,()=>{
    console.log(`Server started on ${port}`);
})