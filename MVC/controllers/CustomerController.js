import customers from '../db/customers.js';
import CustomerModel from '../models/CustomerModel.js';

export default class CustomerController {
    static getAllCustomers() {
        return customers.map(c => new CustomerModel(c.id, c.name, c.email, c.phone, c.address));
    }

    static getCustomerById(id) {
        const customer = customers.find(c => c.id === id);
        if (!customer) return null;
        return new CustomerModel(customer.id, customer.name, customer.email, customer.phone, customer.address);
    }

    static addCustomer(name, email, phone) {
        // Validations
        if (!name || name.trim().length < 2) {
            Swal.fire('Error', 'Name must be at least 2 characters long.', 'error');
            return false;
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            Swal.fire('Error', 'Invalid email address.', 'error');
            return false;
        }
        if (!phone || !/^\+?\d{10,}$/.test(phone.replace(/\D/g, ''))) {
            Swal.fire('Error', 'Invalid phone number.', 'error');
            return false;
        }

        const id = `C${String(customers.length + 1).padStart(3, '0')}`;
        const newCustomer = { id, name, email, phone, address: '' };
        customers.push(newCustomer);
        Swal.fire('Success', 'Customer added successfully!', 'success');
        return true;
    }

    static updateCustomer(id, name, email, phone) {
        // Validations
        if (!name || name.trim().length < 2) {
            Swal.fire('Error', 'Name must be at least 2 characters long.', 'error');
            return false;
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            Swal.fire('Error', 'Invalid email address.', 'error');
            return false;
        }
        if (!phone || !/^\+?\d{10,}$/.test(phone.replace(/\D/g, ''))) {
            Swal.fire('Error', 'Invalid phone number.', 'error');
            return false;
        }

        const customer = customers.find(c => c.id === id);
        if (!customer) {
            Swal.fire('Error', 'Customer not found.', 'error');
            return false;
        }
        customer.name = name;
        customer.email = email;
        customer.phone = phone;
        Swal.fire('Success', 'Customer updated successfully!', 'success');
        return true;
    }

    static deleteCustomer(id) {
        const index = customers.findIndex(c => c.id === id);
        if (index === -1) {
            Swal.fire('Error', 'Customer not found.', 'error');
            return false;
        }
        customers.splice(index, 1);
        Swal.fire('Success', 'Customer deleted successfully!', 'success');
        return true;
    }
}