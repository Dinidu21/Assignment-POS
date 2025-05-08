import orders from '../db/orders.js';
import OrderModel from '../models/OrderModel.js';
import items from '../db/items.js';

export default class OrderController {
    static getAllOrders() {
        return orders.map(o => new OrderModel(o.id, o.customer, o.date, o.items, o.total, o.status));
    }

    static getOrderById(id) {
        const order = orders.find(o => o.id === id);
        if (!order) return null;
        return new OrderModel(order.id, order.customer, order.date, order.items, order.total, order.status);
    }

    static addOrder(customer, date, orderItems) {
        // Validations
        if (!customer || customer.trim().length < 2) {
            Swal.fire('Error', 'Customer name is required.', 'error');
            return false;
        }
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            Swal.fire('Error', 'Invalid date format.', 'error');
            return false;
        }
        if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
            Swal.fire('Error', 'At least one item is required.', 'error');
            return false;
        }

        let total = 0;
        for (const item of orderItems) {
            const dbItem = items.find(i => i.code === item.code);
            if (!dbItem) {
                Swal.fire('Error', `Item ${item.name} not found.`, 'error');
                return false;
            }
            if (item.quantity <= 0) {
                Swal.fire('Error', `Quantity for ${item.name} must be positive.`, 'error');
                return false;
            }
            if (item.quantity > dbItem.stock) {
                Swal.fire('Error', `Insufficient stock for ${item.name}.`, 'error');
                return false;
            }
            total += dbItem.price * item.quantity;
        }

        const id = `#ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`;
        const newOrder = { id, customer, date, items: orderItems, total, status: 'Pending' };
        orders.push(newOrder);

        // Update stock
        for (const item of orderItems) {
            const dbItem = items.find(i => i.code === item.code);
            dbItem.stock -= item.quantity;
        }

        Swal.fire('Success', 'Order created successfully!', 'success');
        return true;
    }

    static updateOrder(id, customer, date, orderItems, status) {
        // Validations
        if (!customer || customer.trim().length < 2) {
            Swal.fire('Error', 'Customer name is required.', 'error');
            return false;
        }
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            Swal.fire('Error', 'Invalid date format.', 'error');
            return false;
        }
        if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
            Swal.fire('Error', 'At least one item is required.', 'error');
            return false;
        }

        let total = 0;
        for (const item of orderItems) {
            const dbItem = items.find(i => i.code === item.code);
            if (!dbItem) {
                Swal.fire('Error', `Item ${item.name} not found.`, 'error');
                return false;
            }
            if (item.quantity <= 0) {
                Swal.fire('Error', `Quantity for ${item.name} must be positive.`, 'error');
                return false;
            }
            total += dbItem.price * item.quantity;
        }

        const order = orders.find(o => o.id === id);
        if (!order) {
            Swal.fire('Error', 'Order not found.', 'error');
            return false;
        }

        order.customer = customer;
        order.date = date;
        order.items = orderItems;
        order.total = total;
        order.status = status;
        Swal.fire('Success', 'Order updated successfully!', 'success');
        return true;
    }

    static deleteOrder(id) {
        const index = orders.findIndex(o => o.id === id);
        if (index === -1) {
            Swal.fire('Error', 'Order not found.', 'error');
            return false;
        }
        orders.splice(index, 1);
        Swal.fire('Success', 'Order deleted successfully!', 'success');
        return true;
    }
}