import CustomerController from '../controllers/CustomerController.js';
import ItemController from '../controllers/ItemController.js';
import OrderController from '../controllers/OrderController.js';

$(document).ready(function() {
    // Navigation: Handle sidebar menu clicks
    $('.sidebar-menu li').click(function() {
        const pageId = $(this).data('page');
        $('.sidebar-menu li').removeClass('active');
        $(this).addClass('active');
        $('.page-section').removeClass('active').hide();
        $('#' + pageId).addClass('active').show();
        localStorage.setItem('activePageId', pageId);
        if ($(window).width() < 768) {
            $('#sidebar').removeClass('active');
            $('#content').removeClass('active');
        }
    });

    // Load last active page from localStorage
    const lastActivePage = localStorage.getItem('activePageId') || 'dashboard';
    $('.page-section').removeClass('active').hide();
    $('#' + lastActivePage).addClass('active').show();
    $('.sidebar-menu li').removeClass('active');
    $(`.sidebar-menu li[data-page="${lastActivePage}"]`).addClass('active');

    // Toggle sidebar on mobile
    $('#toggle-sidebar').click(function() {
        $('#sidebar').toggleClass('active');
        $('#content').toggleClass('active');
    });

    // Update dashboard counts
    function updateDashboard() {
        const customers = CustomerController.getAllCustomers();
        const items = ItemController.getAllItems();
        const orders = OrderController.getAllOrders();
        const revenue = orders.reduce((sum, order) => sum + order.total, 0);

        $('#totalCustomers').text(customers.length);
        $('#totalItems').text(items.length);
        $('#totalOrders').text(orders.length);
        $('#totalRevenue').text('$' + revenue.toFixed(2));
    }

    // Customer Management
    function renderCustomers() {
        const customers = CustomerController.getAllCustomers();
        const tbody = $('#customerTableBody');
        tbody.empty();
        customers.forEach(c => {
            tbody.append(`
                <tr>
                    <td>${c.id}</td>
                    <td>${c.name}</td>
                    <td>${c.email}</td>
                    <td>${c.phone}</td>
                    <td>
                        <button class="btn btn-sm btn-primary btn-action edit-customer" data-id="${c.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn-action delete-customer" data-id="${c.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
        });
    }

    $('#saveCustomer').click(function() {
        const id = $('#customerForm').data('edit-id');
        const name = $('#customerName').val();
        const email = $('#customerEmail').val();
        const phone = $('#customerPhone').val();
        if (id) {
            if (CustomerController.updateCustomer(id, name, email, phone, '')) {
                $('#addCustomerModal').modal('hide');
                $('#customerForm')[0].reset();
                $('#addCustomerModalLabel').text('Add New Customer');
                $('#customerForm').removeData('edit-id');
                renderCustomers();
                renderOrders(false);
                updateDashboard();
            }
        } else {
            if (CustomerController.addCustomer(name, email, phone, '')) {
                $('#addCustomerModal').modal('hide');
                $('#customerForm')[0].reset();
                renderCustomers();
                renderOrders(false);
                updateDashboard();
            }
        }
    });

    $(document).on('click', '.edit-customer', function() {
        const id = $(this).data('id');
        const customer = CustomerController.getCustomerById(id);
        if (customer) {
            $('#customerName').val(customer.name);
            $('#customerEmail').val(customer.email);
            $('#customerPhone').val(customer.phone);
            $('#addCustomerModalLabel').text('Edit Customer');
            $('#customerForm').data('edit-id', id);
            $('#addCustomerModal').modal('show');
        }
    });

    $(document).on('click', '.delete-customer', function() {
        const id = $(this).data('id');
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                if (CustomerController.deleteCustomer(id)) {
                    renderCustomers();
                    renderOrders(false);
                    updateDashboard();
                }
            }
        });
    });

    $('#customerSearch').on('keyup', function() {
        const value = $(this).val().toLowerCase();
        $('#customerTableBody tr').filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    // Item Management
    function renderItems() {
        const items = ItemController.getAllItems();
        const tbody = $('#itemTableBody');
        tbody.empty();
        items.forEach(i => {
            tbody.append(`
                <tr>
                    <td>${i.code}</td>
                    <td>${i.name}</td>
                    <td>${i.category}</td>
                    <td>$${i.price.toFixed(2)}</td>
                    <td>${i.stock}</td>
                    <td>
                        <button class="btn btn-sm btn-primary btn-action edit-item" data-code="${i.code}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn-action delete-item" data-code="${i.code}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `);
        });
    }

    $('#saveItem').click(function() {
        const code = $('#itemForm').data('edit-code');
        const name = $('#itemName').val();
        const category = $('#itemCategory').val();
        const price = $('#itemPrice').val();
        const stock = $('#itemStock').val();
        if (code) {
            if (ItemController.updateItem(code, name, category, price, stock, '')) {
                $('#addItemModal').modal('hide');
                $('#itemForm')[0].reset();
                $('#addItemModalLabel').text('Add New Item');
                $('#itemForm').removeData('edit-code');
                renderItems();
                renderOrders(false);
                updateDashboard();
            }
        } else {
            if (ItemController.addItem(name, category, price, stock, '')) {
                $('#addItemModal').modal('hide');
                $('#itemForm')[0].reset();
                renderItems();
                renderOrders(false);
                updateDashboard();
            }
        }
    });

    $(document).on('click', '.edit-item', function() {
        const code = $(this).data('code');
        const item = ItemController.getItemByCode(code);
        if (item) {
            $('#itemName').val(item.name);
            $('#itemCategory').val(item.category);
            $('#itemPrice').val(item.price);
            $('#itemStock').val(item.stock);
            $('#addItemModalLabel').text('Edit Item');
            $('#itemForm').data('edit-code', code);
            $('#addItemModal').modal('show');
        }
    });

    $(document).on('click', '.delete-item', function() {
        const code = $(this).data('code');
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                if (ItemController.deleteItem(code)) {
                    renderItems();
                    renderOrders(false);
                    updateDashboard();
                }
            }
        });
    });

    $('#itemSearch').on('keyup', function() {
        const value = $(this).val().toLowerCase();
        $('#itemTableBody tr').filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    // Order Management
    function renderOrders(updateTable = true, preserveItems = false) {
        if (updateTable) {
            const orders = OrderController.getAllOrders();
            const tbody = $('#orderTableBody');
            tbody.empty();
            orders.forEach(o => {
                tbody.append(`
                    <tr>
                        <td>${o.id}</td>
                        <td>${o.customer}</td>
                        <td>${o.date}</td>
                        <td>$${o.total.toFixed(2)}</td>
                        <td><span class="badge bg-${o.status === 'Completed' ? 'success' : o.status === 'Pending' ? 'warning' : 'danger'}">${o.status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-primary btn-action edit-order" data-id="${o.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-action delete-order" data-id="${o.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `);
            });
        }

        // Update customer dropdown
        const customers = CustomerController.getAllCustomers();
        const customerSelect = $('#orderCustomer');
        const currentCustomer = customerSelect.val();
        customerSelect.empty().append('<option value="" selected disabled>Select customer</option>');
        customers.forEach(c => {
            customerSelect.append(`<option value="${c.id}">${c.name}</option>`);
        });
        if (currentCustomer) {
            customerSelect.val(currentCustomer);
        }

        // Update item dropdowns
        const items = ItemController.getAllItems();
        $('.item-select').each(function() {
            const currentItem = $(this).val();
            $(this).empty().append('<option value="" selected disabled>Select item</option>');
            items.forEach(i => {
                $(this).append(`<option value="${i.code}" data-price="${i.price}" data-stock="${i.stock}">${i.name} (Stock: ${i.stock})</option>`);
            });
            if (currentItem) {
                $(this).val(currentItem);
            }
        });

        // Add one item row if none exist and not preserving items
        if (!preserveItems && $('#orderItemsTable tbody tr').length === 0) {
            $('#orderItemsTable tbody').empty().append(getOrderItemRow(items));
        }
    }

    function getOrderItemRow(items, selectedItem = null, quantity = 1) {
        const price = selectedItem ? ItemController.getItemByCode(selectedItem.code)?.price || 0 : 0;
        const stock = selectedItem ? ItemController.getItemByCode(selectedItem.code)?.stock || 0 : 0;
        return `
            <tr>
                <td>
                    <select class="form-select item-select">
                        <option value="" ${!selectedItem ? 'selected' : ''} disabled>Select item</option>
                        ${items.map(i => `<option value="${i.code}" data-price="${i.price}" data-stock="${i.stock}" ${selectedItem && i.code === selectedItem.code ? 'selected' : ''}>${i.name} (Stock: ${i.stock})</option>`).join('')}
                    </select>
                </td>
                <td class="item-price">$${price.toFixed(2)}</td>
                <td>
                    <input type="number" class="form-control item-quantity" value="${quantity}" min="1" max="${stock}">
                </td>
                <td class="item-total">$${(price * quantity).toFixed(2)}</td>
                <td>
                    <button type="button" class="btn btn-sm btn-danger remove-item">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }

    $('#addOrderItem').click(function() {
        const items = ItemController.getAllItems();
        $('#orderItemsTable tbody').append(getOrderItemRow(items));
        validateOrderItems();
    });

    $(document).on('click', '.remove-item', function() {
        if ($('#orderItemsTable tbody tr').length > 1) {
            $(this).closest('tr').remove();
            calculateOrderTotal();
            validateOrderItems();
        }
    });

    $(document).on('change', '.item-select', function() {
        const row = $(this).closest('tr');
        const price = parseFloat($(this).find('option:selected').data('price') || 0);
        const stock = parseInt($(this).find('option:selected').data('stock') || 0);
        row.find('.item-price').text('$' + price.toFixed(2));
        const quantityInput = row.find('.item-quantity');
        quantityInput.attr('max', stock);
        const quantity = parseInt(quantityInput.val());
        if (quantity > stock) {
            quantityInput.val(stock);
        }
        row.find('.item-total').text('$' + (price * (quantity > stock ? stock : quantity)).toFixed(2));
        calculateOrderTotal();
        validateOrderItems();
    });

    $(document).on('change input', '.item-quantity', function() {
        const row = $(this).closest('tr');
        const price = parseFloat(row.find('.item-price').text().replace('$', ''));
        const stock = parseInt(row.find('.item-select option:selected').data('stock') || 0);
        let quantity = parseInt($(this).val());
        if (quantity > stock) {
            quantity = stock;
            $(this).val(stock);
        }
        if (quantity < 1) {
            quantity = 1;
            $(this).val(1);
        }
        row.find('.item-total').text('$' + (price * quantity).toFixed(2));
        calculateOrderTotal();
        validateOrderItems();
    });

    function calculateOrderTotal() {
        let subtotal = 0;
        $('#orderItemsTable tbody tr').each(function() {
            const total = parseFloat($(this).find('.item-total').text().replace('$', '')) || 0;
            subtotal += total;
        });
        const taxRate = 0.075;
        const tax = subtotal * taxRate;
        const total = subtotal + tax;
        $('#subtotal').text('$' + subtotal.toFixed(2));
        $('#tax').text('$' + tax.toFixed(2));
        $('#total').text('$' + total.toFixed(2));
    }

    function validateOrderItems() {
        let isValid = true;
        const itemCounts = {};
        $('#orderItemsTable tbody tr').each(function() {
            const code = $(this).find('.item-select').val();
            const quantity = parseInt($(this).find('.item-quantity').val()) || 0;
            if (code) {
                itemCounts[code] = (itemCounts[code] || 0) + quantity;
            }
        });

        for (const code in itemCounts) {
            const item = ItemController.getItemByCode(code);
            if (item && itemCounts[code] > item.stock) {
                isValid = false;
                Swal.fire('Error', `Quantity for ${item.name} exceeds available stock (${item.stock}).`, 'error');
            }
        }

        $('#saveOrder').prop('disabled', !isValid);
        return isValid;
    }

    $('#saveOrder').click(function() {
        if (!validateOrderItems()) {
            return;
        }

        const customerId = $('#orderCustomer').val();
        const customer = $('#orderCustomer option:selected').text();
        const date = $('#orderDate').val();
        const orderItems = [];
        $('#orderItemsTable tbody tr').each(function() {
            const code = $(this).find('.item-select').val();
            const name = $(this).find('.item-select option:selected').text();
            const quantity = parseInt($(this).find('.item-quantity').val());
            if (code && quantity > 0) {
                orderItems.push({ code, name, quantity });
            }
        });

        if (orderItems.length === 0) {
            Swal.fire('Error', 'At least one item is required.', 'error');
            return;
        }

        const id = $('#orderForm').data('edit-id');
        if (id) {
            if (OrderController.updateOrder(id, customer, date, orderItems, 'Pending', '')) {
                $('#newOrderModal').modal('hide');
                $('#orderForm')[0].reset();
                $('#newOrderModalLabel').text('Create New Order');
                $('#orderForm').removeData('edit-id');
                renderOrders();
                updateDashboard();
            }
        } else {
            if (OrderController.addOrder(customer, date, orderItems, '')) {
                $('#newOrderModal').modal('hide');
                $('#orderForm')[0].reset();
                renderOrders();
                updateDashboard();
            }
        }
    });

    $(document).on('click', '.edit-order', function() {
        const id = $(this).data('id');
        const order = OrderController.getOrderById(id);
        if (order) {
            // Set customer and date
            $('#orderCustomer').val([...$('#orderCustomer option')].find(o => o.text === order.customer)?.value || '');
            $('#orderDate').val(order.date);
            $('#newOrderModalLabel').text('Edit Order');
            $('#orderForm').data('edit-id', id);

            // Populate order items
            const items = ItemController.getAllItems();
            $('#orderItemsTable tbody').empty();
            order.items.forEach(item => {
                $('#orderItemsTable tbody').append(getOrderItemRow(items, item, item.quantity));
            });

            // Calculate totals
            calculateOrderTotal();
            validateOrderItems();

            // Show modal
            $('#newOrderModal').modal('show');
        }
    });

    $(document).on('click', '.delete-order', function() {
        const id = $(this).data('id');
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                if (OrderController.deleteOrder(id)) {
                    renderOrders();
                    updateDashboard();
                }
            }
        });
    });

    $('#orderSearch').on('keyup', function() {
        const value = $(this).val().toLowerCase();
        $('#orderTableBody tr').filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    // Initial render
    updateDashboard();
    renderCustomers();
    renderItems();
    renderOrders();
});