let orders = [
    {
        id: '#ORD-2023-001',
        customer: 'John Smith',
        date: '2025-04-15',
        items: [
            { code: 'P001', name: 'Laptop HP Elite', quantity: 1 },
            { code: 'P002', name: 'Wireless Mouse', quantity: 2 }
        ],
        total: 250.00,
        status: 'Completed'
    },
    {
        id: '#ORD-2023-002',
        customer: 'Jane Doe',
        date: '2025-04-15',
        items: [
            { code: 'P003', name: 'USB-C Charger', quantity: 2 }
        ],
        total: 120.50,
        status: 'Pending'
    },
    {
        id: '#ORD-2023-003',
        customer: 'Robert Johnson',
        date: '2025-04-14',
        items: [
            { code: 'P001', name: 'Laptop HP Elite', quantity: 1 },
            { code: 'P002', name: 'Wireless Mouse', quantity: 3 }
        ],
        total: 350.75,
        status: 'Completed'
    },
    {
        id: '#ORD-2023-004',
        customer: 'Emily Wilson',
        date: '2025-04-14',
        items: [
            { code: 'P002', name: 'Wireless Mouse', quantity: 1 }
        ],
        total: 185.20,
        status: 'Cancelled'
    },
    {
        id: '#ORD-2023-005',
        customer: 'Michael Brown',
        date: '2025-04-13',
        items: [
            { code: 'P001', name: 'Laptop HP Elite', quantity: 2 },
            { code: 'P003', name: 'USB-C Charger', quantity: 3 }
        ],
        total: 420.00,
        status: 'Completed'
    }
];

export default orders;