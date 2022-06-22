import express from 'express';
import { controller } from './controller';
import { request } from 'http';
import { User } from '../public/user';
import { customer } from './customer';
import { role} from './role';


const route = express.Router();

route.get('/user', controller.getAllUser);
route.get('/user/:id', controller.getUserById);
route.post('/users', controller.createUser);
route.put('/users/:id', controller.updateUser);
route.delete('/users/:id', controller.deleteUser);
route.get('/customer', customer.getCustomer);
route.get('/customerList', customer.getCustomerList);
route.get('/customers/:name', customer.getCustomerById);
route.get('/roles', role.getRoles);
route.get('/roles/:name', role.getRoleKeyByName);

export default route;