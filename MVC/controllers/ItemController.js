import items from '../db/items.js';
import ItemModel from '../models/ItemModel.js';

export default class ItemController {
    static getAllItems() {
        return items.map(i => new ItemModel(i.code, i.name, i.category, i.price, i.stock, i.description));
    }

    static getItemByCode(code) {
        const item = items.find(i => i.code === code);
        if (!item) return null;
        return new ItemModel(item.code, item.name, item.category, item.price, item.stock, item.description);
    }

    static addItem(name, category, price, stock) {
        // Validations
        if (!name || name.trim().length < 2) {
            Swal.fire('Error', 'Item name must be at least 2 characters long.', 'error');
            return false;
        }
        if (!category || !['Electronics', 'Accessories', 'Storage', 'Audio'].includes(category)) {
            Swal.fire('Error', 'Invalid category.', 'error');
            return false;
        }
        if (!price || isNaN(price) || price <= 0) {
            Swal.fire('Error', 'Price must be a positive number.', 'error');
            return false;
        }
        if (!stock || isNaN(stock) || stock < 0) {
            Swal.fire('Error', 'Stock must be a non-negative number.', 'error');
            return false;
        }

        const code = `P${String(items.length + 1).padStart(3, '0')}`;
        const newItem = { code, name, category, price: parseFloat(price), stock: parseInt(stock), description: '' };
        items.push(newItem);
        Swal.fire('Success', 'Item added successfully!', 'success');
        return true;
    }

    static updateItem(code, name, category, price, stock) {
        // Validations
        if (!name || name.trim().length < 2) {
            Swal.fire('Error', 'Item name must be at least 2 characters long.', 'error');
            return false;
        }
        if (!category || !['Electronics', 'Accessories', 'Storage', 'Audio'].includes(category)) {
            Swal.fire('Error', 'Invalid category.', 'error');
            return false;
        }
        if (!price || isNaN(price) || price <= 0) {
            Swal.fire('Error', 'Price must be a positive number.', 'error');
            return false;
        }
        if (!stock || isNaN(stock) || stock < 0) {
            Swal.fire('Error', 'Stock must be a non-negative number.', 'error');
            return false;
        }

        const item = items.find(i => i.code === code);
        if (!item) {
            Swal.fire('Error', 'Item not found.', 'error');
            return false;
        }
        item.name = name;
        item.category = category;
        item.price = parseFloat(price);
        item.stock = parseInt(stock);
        Swal.fire('Success', 'Item updated successfully!', 'success');
        return true;
    }

    static deleteItem(code) {
        const index = items.findIndex(i => i.code === code);
        if (index === -1) {
            Swal.fire('Error', 'Item not found.', 'error');
            return false;
        }
        items.splice(index, 1);
        Swal.fire('Success', 'Item deleted successfully!', 'success');
        return true;
    }
}