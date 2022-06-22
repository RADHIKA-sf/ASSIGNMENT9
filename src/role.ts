import { pool } from './queries';
import { Request, Response } from 'express';

class RolesController {

    public async getRoles(req: Request, res: Response) {
        pool.query('SELECT name from Roles', (error, result) => {
            if (error) {
                throw error;
            }
            else {
                res.status(200).json(result.rows);
            }
        })
    }
    public async getRoleKeyByName(req: Request, res: Response) {
        const RoleName = req.params.name;          //Rolename 
        pool.query('SELECT key FROM Roles WHERE name = $1', [RoleName], (error, result) => {
            if (error) {
                throw error;
            }
            else {
                res.status(200).send(result.rows);
            }
        })
    }
}

export const role = new RolesController();