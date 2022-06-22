import { pool } from "./queries";
import { Request, Response } from "express";
class CustomerController {
    public async getCustomer(req: Request, res: Response) {
        pool.query('SELECT name FROM Customer', (error: any, result: any) => {
            if (error) {
                throw error;
            }
            else {
                res.status(200).json(result.rows);
            }
        }
        );
    }
    public async getCustomerById(req: Request, res: Response) {
        const CustomerName = req.params.name;  //CustomerName
        pool.query('SELECT cust_id FROM Customer WHERE name = $1', [CustomerName], (error, result) => {
            if (error) {
                throw error;
            }
            else {
                res.status(200).send(result.rows);

            }
        })
    }
    public async getCustomerList(req: Request, res: Response) {
        pool.query('SELECT * FROM Customer', (error: any, result: any) => {
            if (error) {
                throw error;
            }
            else {
                res.status(200).json(result.rows);
            }
        }
        );
    }

}

export const customer = new CustomerController();