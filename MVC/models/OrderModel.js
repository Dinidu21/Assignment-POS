export default class OrderModel {
    constructor(id, customer, date, items, total, status) {
        this.id = id;
        this.customer = customer;
        this.date = date;
        this.items = items;
        this.total = total;
        this.status = status;
    }
}