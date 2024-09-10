const flattenObject = (obj: Record<string, any>, prefix = ''): Record<string, any> => {
  return Object.keys(obj).reduce<Record<string, any>>((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
};

const getDefaultHeaderMapping = (): { [key: string]: string } => ({
  created_at: 'Created At',
  customer_id: 'Customer ID',
  'customers.phone': 'Phone',
  'customers.email': 'Email',
  'customers.customer_name': 'Customer Name',
  'customers.address': 'Address',
  price: 'Price',
  quantity: 'Quantity',
  currency: 'Currency',
  tsx_id: 'Txn ID',
  customer_name: 'customer_name',
  category: 'Category',
  remarks: 'Description',
  period: 'Installments',
});

const getFileSpecificHeaderMapping = (fileName: string): { [key: string]: string } => {
  switch (fileName) {
    case 'products':
      return {
        id: 'Product ID',
        product_name: 'Product Name',
      };
    case 'orders':
      return {
        id: 'Order ID',
        status: 'Status',
        'products.product_name': 'Product',
      };
    case 'customers':
      return {};
    case 'transactions':
      return {
        'product.product_name': 'Product',
      };
    default:
      return {};
  }
};

const filterHeaders = (header: string, fileName: string): boolean => {
  let excludedFields: string[] = [];

  switch (fileName) {
    case 'products':
      excludedFields = ['status', 'product_id'];
      break;
    case 'orders':
      excludedFields = ['product_id'];
      break;
    case 'customers':
      excludedFields = ['id'];
      break;
    case 'transactions':
      excludedFields = ['stripe_id', 'merchant_id', 'customers.customer_name'];
      break;
    default:
      excludedFields = [];
  }

  const commonExclusions = [
    'user_id',
    'stripe_id',
    'merchant_id',
    'customers.id',
    'customers.user_id',
    'customers.stripe_id',
    'next_instalment_date',
    'end_instalment_date',
    'paid_amount',
    'installments_options',
    'stripe_cus_id',
  ];

  excludedFields = [...commonExclusions, ...excludedFields];

  return !excludedFields.some((field) => header === field || header.endsWith(`.${field}`));
};

const convertToCSV = (data: Record<string, any>[], fileName: string) => {
  const defaultHeaderMapping = getDefaultHeaderMapping();
  const fileSpecificHeaderMapping = getFileSpecificHeaderMapping(fileName);
  const headerMapping = { ...defaultHeaderMapping, ...fileSpecificHeaderMapping };

  // Flatten all objects in the data array
  const flattenedData = data.map((item) => flattenObject(item));

  // Determine headers based on headerMapping
  const headers = [
    'Sr No.',
    ...Array.from(
      new Set(
        flattenedData.flatMap((item) => Object.keys(item).filter((header) => filterHeaders(header, fileName)))
      )
    ).map((header) => headerMapping[header] || header),
  ];

  // Map rows and include 'SR No.' as the first column
  const csvRows = flattenedData.map((row, index) =>
    [
      index + 1,
      ...headers.slice(1).map((header) => {
        // Find the original key corresponding to the header
        const originalKey = Object.keys(headerMapping).find((key) => headerMapping[key] === header) || header;
        return JSON.stringify(row[originalKey] ?? '');
      }),
    ].join(',')
  );

  return [headers.join(','), ...csvRows].join('\r\n');
};

export const downloadCSV = (data: Record<string, any>[], fileName: string) => {
  try {
    const csvData = convertToCSV(data, fileName);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', fileName ?? 'download.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.log('Error downloading CSV', error);
  }
};
