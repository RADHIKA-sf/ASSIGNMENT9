import { CRUD } from "./crudInterface";
import { User } from "./user.js";
import {findIndex,getCustomer, getCustomerId, getRoleKeys, getRoles } from './function';
import {myURL} from '../server';
import { SelectRoleValue } from "./select";
import { controller } from "../src/controller";



export class UserCRUD implements CRUD<User>
{
    users: User[];
    col: string[];
    customerLists: string[];
    roleLists: string[];
    tableContainer: HTMLDivElement;
    tableEle: HTMLTableElement;
    myURL: string;
    AddBtn: HTMLButtonElement;
    addContainer: HTMLDivElement;

    constructor() {
        this.users = [];
        this.col = [];
        this.customerLists = [];
        this.roleLists = []
        this.tableContainer = document.querySelector('.table')! as HTMLDivElement;
        this.myURL = `http://localhost:4000`;
        this.tableEle = document.createElement("table") as HTMLTableElement;
        this.AddBtn = document.createElement("button");
        this.AddBtn.classList.add("create-btn");
        this.AddBtn.addEventListener('click', () => this.addUser());
        this.addContainer = document.querySelector('.AddContainer');
        this.initialize();
    }

    async initialize() {
        const dataR = await getRoles(this.myURL);
        this.roleLists = dataR;
        const dataL = await getCustomer(this.myURL);
        this.customerLists = dataL;
        const response = await fetch(this.myURL + '/users');
        const data = await response.json();
        for (let key in data[0]) {
            if (this.col.indexOf(key) < 0 && (key !== "id")) {
                this.col.push(key);

            }
        }
        data.forEach((ob: any) => {
            this.users.push(new User(ob.id, ob.firstname, ob.middlename, ob.lastname, ob.email, ob.phone, ob.role, ob.address, ob.customer,ob.createdon,ob.modifiedon));
        }
        )
    }
    load() {
        this.tableEle = document.createElement("table");
        let tr = this.tableEle.insertRow(-1);

        for (let i = 0; i < this.col.length; i++) {
            let th = tr.insertCell(i);
            th.innerHTML = this.col[i];
        }
        this.AddBtn.innerHTML = "Add User";
        this.addContainer.append(this.AddBtn);
        this.users.forEach((user) => this.loadTableContent(user))
    }
    loadTableContent(user: User) {
        let tr = document.createElement("tr");
        let editBtn = document.createElement("button");
        editBtn.innerHTML = "Edit";
        editBtn.addEventListener('click', () => this.update(user));
        editBtn.setAttribute('class', 'edit');
        let deleteBtn = document.createElement("button");
        deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "Delete";
        deleteBtn.addEventListener('click', () => this.delete(user));
        deleteBtn.classList.add("dlt");

        tr.innerHTML = `<td id = "fname">${user.FirstName}</td>
                        <td id = "middle">${user.MiddleName}</td>
                        <td id = "last">${user.LastName}</td>
                        <td id = "email">${user.Email}</td>
                        <td id = "phone">${user.Phone}</td>
                        <td id = "role-cell">${user.Role}</td>
                        <td id = "address">${user.Address}</td>
                        <td id = "customer">${user.CustomerName}</td>
                        <td id = "createdon">${user.created_on}</td>
                        <td id = "modifiedon">${user.modified_on}</td>`;
        tr.append(editBtn);
        tr.append(deleteBtn);
        this.tableEle.append(tr);
        this.tableContainer.innerHTML = "";
        this.tableContainer.append(this.tableEle);

    }

    addUser() {
        let newRow = this.tableEle.insertRow(-1);
        newRow.contentEditable = 'true';
        for (let i = 0; i < this.col.length; i++) {
            let newCell = newRow.insertCell(0);
        }
        let roleCell = newRow.children[5] as HTMLTableCellElement;
        SelectRoleValue(this.roleLists, roleCell);
        let customerCell = newRow.children[6] as HTMLTableCellElement;
        SelectRoleValue(this.customerLists, customerCell);
        let submit = document.createElement('submit') as HTMLButtonElement;
        submit.innerHTML = 'Submit';
        submit.classList.add('submit')
        newRow.append(submit);
        submit.addEventListener('click', async () => {

            newRow.contentEditable = 'false';
            let selectedrole, selectedCustomer;

            for (let i = 0; i <= 2; i++) {

                let r = newRow.children[5].children[0].children[i] as HTMLOptionElement;

                if (r.selected) {
                    selectedrole = r.textContent;
                }
            }

            for (let j = 0; j <= 2; j++) {
                let option;
                let s = newRow.children[6].children[0].children[j] as HTMLOptionElement;
                if (option = s) {
                    selectedCustomer = option.textContent;
                }
            }
            const data1 = await getRoleKeys(this.myURL, selectedrole);
            const data = await getCustomerId(this.myURL, selectedCustomer);

            const newUser = {
               // customerid: data[0].customerid,  
                Id: this.users.length + 1,
                FirstName: newRow.children[0].textContent,
                MiddleName: newRow.children[1].textContent,
                LastName: newRow.children[2].textContent,
                Email: newRow.children[3].textContent,
                Phone: newRow.children[4].textContent,
                Role: data1[0].key,
                Address: newRow.children[6].textContent,
                CustomerName: selectedCustomer,
                created_on: newRow.children[8].textContent,
                modified_on: newRow.children[9].textContent,
            }
            this.create(newUser);
        })
    }
    async create(user: User) {
        console.log(user);
        const createUrl = this.myURL + '/add';
        const res = await fetch(createUrl, {
            method: 'post',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let getUser = await fetch(this.myURL + '/users');
        let Data = await getUser.json();
        let ob = Data[Data.length - 1];
        const mybody = {
            "Id": ob.id,
            "FirstName": ob.firstname,
            "MiddleName": ob.middlename,
            "LastName": ob.lastname,
            "Email": ob.email,
            "Phone": ob.phone,
            "Role": ob.role,
            "Address": ob.address,
            "CustomerName": ob.customer,
            "created_on": ob.createdon,
            "modified_on": ob.modifiedon,
        }

        this.users.push(mybody);
        this.load();
    }
    read(): User[] {
        return this.users;
    }
    async update(user: User) {
        let index = findIndex(user.Id, this.users);
        let tr = this.tableEle.children[index + 1] as HTMLTableRowElement;
        let editbtn = tr.children[tr.children.length - 2] as HTMLButtonElement;
        let dltbtn = tr.children[tr.children.length - 1] as HTMLButtonElement;
        let cell = tr.cells.namedItem("role-cell") as HTMLTableCellElement;
        let customerCell = tr.cells.namedItem("customer");
        if (editbtn.innerHTML === "Edit") {
            tr.contentEditable = "true";
            editbtn.innerHTML = "Save";
            dltbtn.innerHTML = "Cancel";
            editbtn.contentEditable = "false";
            dltbtn.contentEditable = "false";

            let select = document.createElement("select") as HTMLSelectElement;
            select.classList.add("select");
            select.setAttribute('id', 'select');
            SelectRoleValue(this.customerLists, customerCell);
            SelectRoleValue(this.roleLists, cell);
        }
        else {
            this.save(user);
        }
    }
    async save(user: User) {
        let index = findIndex(user.Id, this.users);
        let tr = this.tableEle.children[index + 1] as HTMLTableRowElement;
        let editbtn = tr.children[tr.children.length - 2] as HTMLButtonElement;
        let dltbtn = tr.children[tr.children.length - 1] as HTMLButtonElement;
        let fnameCell = tr.cells.namedItem("fname");
        let middlenameCell = tr.cells.namedItem("middle");
        let lastnameCell = tr.cells.namedItem("last");
        let emailCell = tr.cells.namedItem("email");
        let phoneCell = tr.cells.namedItem("phone");
        let addressCell = tr.cells.namedItem("address");
        let CustomerName = tr.cells.namedItem("customer");
        let selectCell = tr.cells.namedItem("select");

        tr.contentEditable = "false";
        editbtn.innerHTML = "Edit";
        dltbtn.innerHTML = "Delete";
        const updateURL = this.myURL + '/update/' + `${user.Id}`;

        user.FirstName = fnameCell.textContent!;
        user.MiddleName = middlenameCell.textContent!;
        user.LastName = lastnameCell.textContent!;
        user.Email = emailCell.textContent!;
        user.Phone = phoneCell.textContent!;
        user.Address = addressCell.textContent!;
        for (let i = 0; i <= 2; i++) {
            let s = tr.children[5].children[0].children[i] as HTMLOptionElement;
            if (s.selected) {

                user.Role = s.textContent!;
            }
        }
        let td = document.createElement("td");
        td.setAttribute('id', 'role-cell');
        tr.children[5].replaceWith(td);
        let roleCell = tr.cells.namedItem('role-cell');
        roleCell.innerHTML = user.Role;
        const data1 = await getRoleKeys(this.myURL, user.Role);
        console.log(data1);
        for (let i = 0; i <= 2; i++) {
            let optionValue = tr.children[7].children[0].children[i] as HTMLOptionElement;
            if (optionValue.selected) {
                user.CustomerName = optionValue.textContent;
            }
            let td1 = document.createElement('td1');
            td1.setAttribute('id', 'customer');
            tr.children[7].append(td1);
            let customerCell = tr.children[7];
            customerCell.innerHTML = user.CustomerName;
            const dataC = await getCustomerId(this.myURL, user.CustomerName);
            console.log(dataC);
        }

        const mybody = {
            "id": user.Id,
            "firstname": user.FirstName,
            "middlename": user.MiddleName,
            "lastname": user.LastName,
            "email": user.Email,
            "phone": user.Phone,
            "role": data1[0].key,
            "address": user.Address,
            "customername": user.CustomerName,
        };

        const response = await fetch(updateURL, {
            method: 'PUT',
            body: JSON.stringify(mybody), 
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async delete(user: User) {

        const index = findIndex(user.Id, this.users);
        let tr = this.tableEle.children[index + 1] as HTMLTableRowElement;
        let dltbtn = tr.children[tr.children.length - 1] as HTMLButtonElement;
        if (dltbtn.innerHTML === "Delete") {
            const deleteURL = this.myURL + '/delete/' + `${user.Id}`;
            const response = await fetch(deleteURL,
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });

            tr.remove();
            this.users.splice(index, 1);
            this.load();
        }
        else {
            this.cancel(user);
        }

    }

    cancel(user: User) {
        let index = findIndex(user.Id, this.users);
        let tr = this.tableEle.children[index + 1] as HTMLTableRowElement;
        let editbtn = tr.children[tr.children.length - 2] as HTMLButtonElement;
        let dltbtn = tr.children[tr.children.length - 1] as HTMLButtonElement;

        tr.contentEditable = "false";
        dltbtn.innerHTML = "Delete";
        editbtn.innerHTML = "Edit";
        this.load();
    }

    refresh() {
        this.users = [];
        this.initialize();
        this.load();
    }
}